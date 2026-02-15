#!/usr/bin/env node

// Simple test script to verify SMS webhook logic locally
// Usage: node test-sms.js

const handler = require('./api/sms.ts').default;

// Mock Vercel request/response objects
function createMockReq(body) {
  return {
    method: 'POST',
    body: body
  };
}

function createMockRes() {
  const headers = {};
  let status = 200;
  let response = '';
  
  return {
    setHeader: (key, value) => { headers[key] = value; },
    status: (code) => { status = code; return mockRes; },
    json: (data) => { response = data; return mockRes; },
    send: (data) => { response = data; return mockRes; },
    getStatus: () => status,
    getResponse: () => response,
    getHeaders: () => headers
  };
}

async function testConversationFlow() {
  console.log('🧪 Testing FindALocalPro SMS Webhook\n');
  
  const phoneNumber = '+1234567890';
  
  const testCases = [
    {
      name: 'Initial message',
      body: { Body: 'Hello', From: phoneNumber, To: '+1800555test' },
      expectedStatus: 200
    },
    {
      name: 'Service type - Plumbing',
      body: { Body: 'plumbing', From: phoneNumber, To: '+1800555test' },
      expectedStatus: 200
    },
    {
      name: 'Invalid zip code',
      body: { Body: 'abc123', From: phoneNumber, To: '+1800555test' },
      expectedStatus: 200
    },
    {
      name: 'Valid zip code',
      body: { Body: '12345', From: phoneNumber, To: '+1800555test' },
      expectedStatus: 200
    },
    {
      name: 'Provide name',
      body: { Body: 'John Smith', From: phoneNumber, To: '+1800555test' },
      expectedStatus: 200
    },
    {
      name: 'URGENT message',
      body: { Body: 'URGENT', From: phoneNumber, To: '+1800555test' },
      expectedStatus: 200
    },
    {
      name: 'STOP opt-out',
      body: { Body: 'STOP', From: phoneNumber, To: '+1800555test' },
      expectedStatus: 200
    }
  ];
  
  for (const testCase of testCases) {
    console.log(`📱 Testing: ${testCase.name}`);
    console.log(`   Input: "${testCase.body.Body}"`);
    
    const req = createMockReq(testCase.body);
    const res = createMockRes();
    
    try {
      await handler(req, res);
      
      const status = res.getStatus();
      const response = res.getResponse();
      const headers = res.getHeaders();
      
      console.log(`   Status: ${status}`);
      console.log(`   Content-Type: ${headers['Content-Type']}`);
      
      if (typeof response === 'string' && response.includes('<Response>')) {
        // Extract message from TwiML
        const messageMatch = response.match(/<Message>(.*?)<\/Message>/);
        const message = messageMatch ? messageMatch[1] : 'No message found';
        console.log(`   Response: "${message}"`);
      } else {
        console.log(`   Response: ${JSON.stringify(response)}`);
      }
      
      if (status === testCase.expectedStatus) {
        console.log('   ✅ PASS\n');
      } else {
        console.log(`   ❌ FAIL (expected status ${testCase.expectedStatus})\n`);
      }
      
    } catch (error) {
      console.log(`   ❌ ERROR: ${error.message}\n`);
    }
    
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('🏁 Test completed');
}

// Run tests
if (require.main === module) {
  testConversationFlow().catch(console.error);
}

module.exports = { testConversationFlow };