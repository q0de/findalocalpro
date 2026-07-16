import { NextResponse } from 'next/server';
import { createPartnerApplication } from '@/lib/partner-store';
import type { PartnerApplicationInput } from '@/lib/partner-types';

function clean(value: unknown, maxLength = 600) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function normalizedPayload(raw: Partial<PartnerApplicationInput>): PartnerApplicationInput {
  return {
    businessName: clean(raw.businessName, 160),
    contactName: clean(raw.contactName, 160),
    email: clean(raw.email, 254).toLowerCase(),
    phone: clean(raw.phone, 40),
    website: clean(raw.website, 500),
    category: clean(raw.category, 120),
    serviceAreas: clean(raw.serviceAreas, 600),
    preferredTerritory: clean(raw.preferredTerritory, 600),
    yearsInBusiness: clean(raw.yearsInBusiness, 20),
    googleProfile: clean(raw.googleProfile, 500),
    notes: clean(raw.notes, 1200),
    confirmed: raw.confirmed === true,
  };
}

export async function POST(request: Request) {
  try {
    const payload = normalizedPayload(await request.json() as Partial<PartnerApplicationInput>);
    const phoneDigits = payload.phone.replace(/\D/g, '');

    if (!payload.businessName || !payload.contactName || !payload.email.includes('@') || phoneDigits.length !== 10) {
      return NextResponse.json({ error: 'Missing required contact details.' }, { status: 400 });
    }
    if (!payload.category || !payload.serviceAreas || !payload.confirmed) {
      return NextResponse.json({ error: 'Missing required partner details.' }, { status: 400 });
    }

    const application = await createPartnerApplication(payload);
    return NextResponse.json(
      { applicationId: application.id, status: application.status },
      { status: 201 },
    );
  } catch (error) {
    console.error('Partner application error:', error);
    return NextResponse.json({ error: 'Could not save the application.' }, { status: 500 });
  }
}
