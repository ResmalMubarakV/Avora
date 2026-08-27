// ==========================================
// APPLICATION ENTRY POINT
// ==========================================
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "sonner";

// Fonts
import "@fontsource/outfit/300.css";
import "@fontsource/outfit/400.css";
import "@fontsource/outfit/500.css";
import "@fontsource/outfit/600.css";
import "@fontsource/outfit/700.css";

// Global Styles & Root Component
import "./index.css";
import App from "./App.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";

// Initialize and render the React application
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <ThemeProvider>
        <BrowserRouter>
          <App />

        
        {/* Global Universal Below-Navbar, Larger High-End Toast Provider */}
        <Toaster 
          position="top-center" 
          offset="80px" 
          richColors 
          closeButton 
          expand={true}
          toastOptions={{
            style: {
              background: "#ffffff",
              border: "1px solid rgba(226, 232, 240, 0.9)",
              borderRadius: "24px",
              padding: "18px 24px",
              minWidth: "360px",
              boxShadow: "0 25px 50px -12px rgba(30, 58, 138, 0.18)",
              fontFamily: "'Outfit', sans-serif",
              fontSize: "15px",
              fontWeight: "600",
              color: "#0f172a",
            },
            className: "vora-toast-custom",
          }}
        />
      </BrowserRouter>
    </ThemeProvider>
  </GoogleOAuthProvider>
</StrictMode>
);