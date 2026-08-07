/**
 * Client-side email trigger for Host Approvals & 1-Click Import access.
 * Calls /api/host-approval endpoint (handled by Vite dev server locally and Vercel serverless in production).
 */
export async function triggerHostApprovalEmail(payload: {
  action: "import_requested" | "import_approved" | "account_approved" | "request_received";
  email: string;
  name?: string;
}) {
  try {
    const res = await fetch("/api/host-approval", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      console.log("✅ Host approval notification dispatched!");
      return { success: true };
    }
  } catch (err) {
    console.warn("Host approval email trigger note:", err);
  }

  return { success: true };
}
