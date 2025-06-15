import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import TestApp from './TestApp.tsx'
import './index.css'

// Switch back to main app
createRoot(document.getElementById("root")!).render(<App />);
