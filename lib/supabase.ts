export const SUPABASE_URL = 'https://hocipkeeikriqyojiboj.supabase.co';
export const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvY2lwa2VlaWtyaXF5b2ppYm9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExOTE2NDYsImV4cCI6MjA4Njc2NzY0Nn0.4WmlnsXdcUfTC0znL04CC254HKnVwfHqnWLeplXtBwA';

export const DIRECT_CONTACT_ENABLED = process.env.NEXT_PUBLIC_DIRECT_CONTACT_ENABLED === 'true';

export function supabaseHeaders() {
  return {
    apikey: SUPABASE_ANON,
    Authorization: `Bearer ${SUPABASE_ANON}`,
  };
}
