import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// SEO-Optimierung: Verhindert "Duplicate Content" über die Firebase-Standard-Domains
if (
  window.location.hostname === 'restauration19-fde4f.web.app' || 
  window.location.hostname === 'restauration19-fde4f.firebaseapp.com'
) {
  window.location.replace(`https://restauration19.de${window.location.pathname}${window.location.search}`);
}

/** Eine Canonical-URL (sitemap + publicSeo) — www auf Apex zusammenführen. */
if (window.location.hostname === 'www.restauration19.de') {
  window.location.replace(`https://restauration19.de${window.location.pathname}${window.location.search}`);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);