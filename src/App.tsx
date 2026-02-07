import { useState } from 'react';
import { Header } from './components/Header';
import { ChatFlow } from './components/ChatFlow';
import { Footer } from './components/Footer';

function App() {
  const [step, setStep] = useState(0);

  return (
    <>
      <Header step={step} totalSteps={3} />
      <main className="flex-grow flex flex-col max-w-3xl mx-auto w-full px-6 py-12">
        <ChatFlow onStepChange={setStep} />
      </main>
      <Footer />
    </>
  );
}

export default App;
