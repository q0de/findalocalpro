'use client';

import { useState } from 'react';
import { ChatFlow } from '@/components/ChatFlow';

export function ChatSection() {
  const [, setStep] = useState(0);

  return <ChatFlow onStepChange={setStep} />;
}
