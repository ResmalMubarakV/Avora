import "@fontsource/outfit/300.css";
import "@fontsource/outfit/400.css";
import "@fontsource/outfit/500.css";
import "@fontsource/outfit/600.css";
import "@fontsource/outfit/700.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { GoogleOAuthProvider } from "@react-oauth/google";

import "./index.css";
import App from "./App.jsx";

import { Toaster } from "sonner";

createRoot(document.getElementById("root")).render(
    <StrictMode>

        <GoogleOAuthProvider
            clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
        >

            <BrowserRouter>

                <App />

                <Toaster
                    position="top-right"
                    richColors
                    closeButton
                />

            </BrowserRouter>

        </GoogleOAuthProvider>

    </StrictMode>
);