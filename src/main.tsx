import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { ErrorBoundary } from './components/ErrorBoundary'
import './index.css'

// One-time reset to the new light default: anyone who had "dark" or
// "system" saved from before starts in light; they can switch back from the
// profile menu and that choice sticks.
try {
  if (!localStorage.getItem("wayzyy_theme_reset_v1")) {
    localStorage.removeItem("theme");
    localStorage.setItem("wayzyy_theme_reset_v1", "1");
  }
} catch { /* storage blocked */ }

createRoot(document.getElementById("root")!).render(<ErrorBoundary><App /></ErrorBoundary>);

// Register Service Worker for PWA support
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => console.log("Service Worker registered successfully:", reg.scope))
      .catch((err) => console.warn("Service Worker registration failed:", err));
  });
}
