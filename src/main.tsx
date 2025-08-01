import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import { ConvexProvider, ConvexReactClient } from "convex/react";

import { TempoDevtools } from "tempo-devtools";
TempoDevtools.init();

const basename = import.meta.env.BASE_URL;

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL!);
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider 
      publishableKey={clerkPubKey}
      appearance={{
        elements: {
          formButtonPrimary: "bg-amber-500 hover:bg-amber-600 text-white",
        }
      }}
    >
      <ConvexProvider client={convex}>
        <BrowserRouter basename={basename}>
          <App />
        </BrowserRouter>
      </ConvexProvider>
    </ClerkProvider>
  </React.StrictMode>,
);
