import "@fontsource/outfit/300.css";
import "@fontsource/outfit/400.css";
import "@fontsource/outfit/500.css";
import "@fontsource/outfit/600.css";
import "@fontsource/outfit/700.css";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { Toaster } from "sonner";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
         <App />
         <Toaster
            position="top-right"
            richColors
            closeButton
        />
    </BrowserRouter>
  </StrictMode>,
)
