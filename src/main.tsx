import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import HomePage from './App.tsx'
import { PrivacyPolicy } from './pages/PrivacyPolicy.tsx'
import { Terms } from './pages/Terms.tsx'
import { ServiceLanding } from './pages/ServiceLanding.tsx'
import { Directory } from './pages/Directory.tsx'
import { ProviderProfile } from './pages/ProviderProfile.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/directory" element={<Directory />} />
        <Route path="/pro/:slug" element={<ProviderProfile />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/services/:vertical" element={<ServiceLanding />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
