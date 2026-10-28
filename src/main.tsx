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

// After a deploy, a tab opened earlier still asks for the old build's page
// files. They're gone, and Vercel answers with index.html instead, so the page
// failed with "Something went wrong" until the visitor reloaded by hand.
// Reload once to pick up the new build; the timestamp stops a reload loop if
// the file is missing for some other reason.
window.addEventListener("vite:preloadError", (event) => {
  try {
    const last = Number(sessionStorage.getItem("wayzyy_chunk_reload") || 0);
    if (Date.now() - last < 30_000) return;
    sessionStorage.setItem("wayzyy_chunk_reload", String(Date.now()));
  } catch {
    return; // storage blocked: no way to stop a loop, so leave the reload button to the visitor
  }
  event.preventDefault();
  window.location.reload();
});

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
