import { useState } from 'react';
import { Header } from './components/Header';
import { ChatFlow } from './components/ChatFlow';
import { Footer } from './components/Footer';

function HomePage() {
  const [step, setStep] = useState(0);

  return (
    <div className="min-h-screen flex flex-col">
      <Header step={step} totalSteps={4} />
      <main className="flex-grow flex flex-col max-w-3xl mx-auto w-full px-6 py-12">
        <ChatFlow onStepChange={setStep} />
      </main>
      <Footer />
    </div>
  );
}

export default HomePage;
