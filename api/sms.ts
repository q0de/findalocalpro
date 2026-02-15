import { VercelRequest, VercelResponse } from '@vercel/node';
import { writeFile, readFile, mkdir } from 'fs/promises';
import { join } from 'path';

// Conversation states
type ConversationState = 'initial' | 'awaiting_service' | 'awaiting_zip' | 'awaiting_name' | 'complete';

interface UserSession {
  state: ConversationState;
  serviceType?: string;
  zipCode?: string;
  name?: string;
  phoneNumber: string;
  lastMessage?: Date;
}

interface Lead {
  phoneNumber: string;
  serviceType: string;
  zipCode: string;
  name: string;
  timestamp: Date;
  urgentFlag?: boolean;
}

// In-memory session store (will reset on function restart)
const sessions = new Map<string, UserSession>();

const SERVICE_TYPES = ['plumbing', 'hvac', 'electrical', 'pest control', 'appliance repair'];

function createTwiMLResponse(message: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Message>${message}</Message>
</Response>`;
}

function normalizeServiceType(input: string): string | null {
  const normalized = input.toLowerCase().trim();
  
  // Direct matches
  if (SERVICE_TYPES.includes(normalized)) {
    return normalized;
  }
  
  // Partial matches and common variations
  if (normalized.includes('plumb')) return 'plumbing';
  if (normalized.includes('hvac') || normalized.includes('heating') || normalized.includes('cooling') || normalized.includes('air')) return 'hvac';
  if (normalized.includes('electric') || normalized.includes('wiring')) return 'electrical';
  if (normalized.includes('pest') || normalized.includes('bug') || normalized.includes('exterminator')) return 'pest control';
  if (normalized.includes('appliance') || normalized.includes('washer') || normalized.includes('dryer') || normalized.includes('refrigerator') || normalized.includes('dishwasher')) return 'appliance repair';
  
  return null;
}

function isValidZipCode(zip: string): boolean {
  // US ZIP code validation (5 digits or 5+4 format)
  return /^\d{5}(-\d{4})?$/.test(zip.trim());
}

async function saveSession(phoneNumber: string, session: UserSession) {
  try {
    const dataDir = '/tmp/findalocalpro-data';
    await mkdir(dataDir, { recursive: true });
    
    const sessionsFile = join(dataDir, 'sessions.json');
    let allSessions: Record<string, UserSession> = {};
    
    try {
      const data = await readFile(sessionsFile, 'utf-8');
      allSessions = JSON.parse(data);
    } catch {
      // File doesn't exist or is invalid, start fresh
    }
    
    allSessions[phoneNumber] = session;
    await writeFile(sessionsFile, JSON.stringify(allSessions, null, 2));
  } catch (error) {
    console.error('Failed to save session:', error);
  }
}

async function loadSession(phoneNumber: string): Promise<UserSession | null> {
  try {
    const sessionsFile = '/tmp/findalocalpro-data/sessions.json';
    const data = await readFile(sessionsFile, 'utf-8');
    const allSessions = JSON.parse(data);
    return allSessions[phoneNumber] || null;
  } catch {
    return null;
  }
}

async function saveLead(lead: Lead) {
  try {
    const dataDir = '/tmp/findalocalpro-data';
    await mkdir(dataDir, { recursive: true });
    
    const leadsFile = join(dataDir, 'leads.jsonl');
    const leadLine = JSON.stringify(lead) + '\n';
    
    // Append to JSONL file
    await writeFile(leadsFile, leadLine, { flag: 'a' });
    console.log('Lead saved:', lead);
  } catch (error) {
    console.error('Failed to save lead:', error);
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { Body, From, To } = req.body;
  
  if (!Body || !From) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const phoneNumber = From;
  const messageBody = Body.trim();
  
  // Set proper content type for TwiML
  res.setHeader('Content-Type', 'text/xml');

  // Handle opt-out
  if (messageBody.toUpperCase() === 'STOP') {
    // Remove from sessions
    sessions.delete(phoneNumber);
    try {
      const sessionsFile = '/tmp/findalocalpro-data/sessions.json';
      const data = await readFile(sessionsFile, 'utf-8');
      const allSessions = JSON.parse(data);
      delete allSessions[phoneNumber];
      await writeFile(sessionsFile, JSON.stringify(allSessions, null, 2));
    } catch {
      // File might not exist
    }
    
    const response = createTwiMLResponse("You've been unsubscribed from FindALocalPro messages. Reply START to re-subscribe.");
    return res.status(200).send(response);
  }

  // Handle re-subscription
  if (messageBody.toUpperCase() === 'START') {
    sessions.delete(phoneNumber);
    const response = createTwiMLResponse("Welcome back to FindALocalPro! What type of service do you need? (Plumbing, HVAC, Electrical, Pest Control, or Appliance Repair)");
    return res.status(200).send(response);
  }

  // Load or create session
  let session = sessions.get(phoneNumber) || await loadSession(phoneNumber);
  
  if (!session) {
    // New conversation
    session = {
      state: 'initial',
      phoneNumber,
      lastMessage: new Date()
    };
  }

  session.lastMessage = new Date();
  let responseMessage = '';

  switch (session.state) {
    case 'initial':
      // First message - ask for service type
      session.state = 'awaiting_service';
      responseMessage = "Hi! Thanks for reaching out to FindALocalPro. What type of service do you need? (Plumbing, HVAC, Electrical, Pest Control, or Appliance Repair)";
      break;

    case 'awaiting_service':
      const serviceType = normalizeServiceType(messageBody);
      if (!serviceType) {
        responseMessage = "I didn't recognize that service type. Please choose from: Plumbing, HVAC, Electrical, Pest Control, or Appliance Repair";
      } else {
        session.serviceType = serviceType;
        session.state = 'awaiting_zip';
        responseMessage = "Great! What's your zip code?";
      }
      break;

    case 'awaiting_zip':
      if (!isValidZipCode(messageBody)) {
        responseMessage = "Please enter a valid 5-digit zip code (like 12345 or 12345-6789)";
      } else {
        session.zipCode = messageBody.trim();
        session.state = 'awaiting_name';
        responseMessage = "Got it! What's your name so we can connect you with a pro?";
      }
      break;

    case 'awaiting_name':
      if (messageBody.length < 2) {
        responseMessage = "Please enter your name";
      } else {
        session.name = messageBody.trim();
        session.state = 'complete';
        
        // Check for urgent flag
        const isUrgent = messageBody.toUpperCase().includes('URGENT');
        
        // Save the lead
        const lead: Lead = {
          phoneNumber: session.phoneNumber,
          serviceType: session.serviceType!,
          zipCode: session.zipCode!,
          name: session.name,
          timestamp: new Date(),
          urgentFlag: isUrgent
        };
        
        await saveLead(lead);
        
        responseMessage = `Thanks ${session.name}! A local ${session.serviceType} pro will be reaching out shortly. If you need immediate help, reply URGENT.`;
      }
      break;

    case 'complete':
      // Handle post-completion messages
      if (messageBody.toUpperCase().includes('URGENT')) {
        responseMessage = "We've flagged your request as urgent. A pro will contact you as soon as possible.";
        
        // Update the lead with urgent flag
        const urgentLead: Lead = {
          phoneNumber: session.phoneNumber,
          serviceType: session.serviceType!,
          zipCode: session.zipCode!,
          name: session.name!,
          timestamp: new Date(),
          urgentFlag: true
        };
        
        await saveLead(urgentLead);
      } else {
        // Start new conversation
        session.state = 'initial';
        session.serviceType = undefined;
        session.zipCode = undefined;
        session.name = undefined;
        responseMessage = "Hi again! What type of service do you need? (Plumbing, HVAC, Electrical, Pest Control, or Appliance Repair)";
      }
      break;

    default:
      // Reset to initial state on unknown state
      session.state = 'initial';
      responseMessage = "Hi! Thanks for reaching out to FindALocalPro. What type of service do you need? (Plumbing, HVAC, Electrical, Pest Control, or Appliance Repair)";
  }

  // Save session state
  sessions.set(phoneNumber, session);
  await saveSession(phoneNumber, session);

  // Return TwiML response
  const twimlResponse = createTwiMLResponse(responseMessage);
  return res.status(200).send(twimlResponse);
}