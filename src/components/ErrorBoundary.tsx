import { Component, ReactNode } from "react";

interface State { error: Error | null }

/**
 * Last-resort net around the whole app. Without it, any render error unmounts
 * everything and the visitor sees a blank page. This shows a plain message
 * with a reload button, and keeps the real error on screen (small print) so a
 * screenshot from a visitor tells us what actually broke.
 */
export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: { componentStack?: string }) {
    console.error("App crashed:", error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div style={{
        minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", gap: 12, padding: 24, textAlign: "center",
        background: "#fff", color: "#111827", fontFamily: "system-ui, sans-serif",
      }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Something went wrong</h1>
        <p style={{ margin: 0, maxWidth: 360, fontSize: 14, color: "#4b5563" }}>
          This page didn't load properly. Reloading usually fixes it.
        </p>
        <button
          onClick={() => window.location.reload()}
          style={{ background: "#ff6b00", color: "#fff", border: 0, borderRadius: 999, padding: "10px 22px", fontWeight: 600, cursor: "pointer" }}
        >
          Reload page
        </button>
        <a href="/" style={{ fontSize: 13, color: "#6b7280" }}>Go to home</a>
        <code style={{ marginTop: 12, maxWidth: 420, fontSize: 11, color: "#9ca3af", wordBreak: "break-word" }}>
          {this.state.error.message}
        </code>
      </div>
    );
  }
}
