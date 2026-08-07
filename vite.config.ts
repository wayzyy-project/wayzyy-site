import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";

function localApiPlugin(): Plugin {
  return {
    name: "local-api-handler",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === "/api/host-approval" && req.method === "POST") {
          let bodyStr = "";
          req.on("data", (chunk) => {
            bodyStr += chunk;
          });
          req.on("end", async () => {
            try {
              const body = JSON.parse(bodyStr || "{}");
              const { action, email, name } = body;

              // Read .env file for ZeptoMail key
              let apiKey = process.env.ZEPTOMAIL_API_KEY || process.env.VITE_ZEPTOMAIL_API_KEY;
              if (!apiKey && fs.existsSync(".env")) {
                const envContent = fs.readFileSync(".env", "utf-8");
                envContent.split("\n").forEach((line) => {
                  const [k, v] = line.split("=");
                  if (k && v && (k.trim() === "ZEPTOMAIL_API_KEY" || k.trim() === "VITE_ZEPTOMAIL_API_KEY")) {
                    apiKey = v.trim();
                  }
                });
              }

              if (apiKey) {
                const authHeader = apiKey.startsWith("Zoho-enczapikey")
                  ? apiKey.trim()
                  : `Zoho-enczapikey ${apiKey.trim()}`;

                const hostName = name || "Host User";
                const hostEmail = email || "hello@wayzyy.com";

                // Send Email A: Admin Notification to hello@wayzyy.com
                const zeptoResAdmin = await fetch("https://api.zeptomail.in/v1.1/email", {
                  method: "POST",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: authHeader,
                  },
                  body: JSON.stringify({
                    from: { address: "hello@wayzyy.com", name: "Wayzyy Platform Support" },
                    to: [{ email_address: { address: "hello@wayzyy.com" } }],
                    subject: `🚨 New Import Listing Feature Request from ${hostName}`,
                    htmlbody: `
                      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; background-color: #ffffff; color: #1e293b; border-radius: 16px; border: 1px solid #e2e8f0;">
                        <h2 style="font-size: 18px; font-weight: 800; color: #ff6b00; margin: 0 0 12px 0;">🚨 New 1-Click Import Access Request</h2>
                        <p style="font-size: 14px; color: #334155; line-height: 1.5;">
                          Host <strong>${hostName}</strong> (<a href="mailto:${hostEmail}" style="color: #ff6b00;">${hostEmail}</a>) has requested access to the <strong>1-Click Airbnb & Booking Listing Import</strong> feature.
                        </p>
                        <div style="background-color: #fff7ed; padding: 16px; border-radius: 12px; border-left: 4px solid #ff6b00; margin: 16px 0;">
                          <p style="font-size: 13px; font-weight: 600; color: #9a3412; margin: 0;">Host Email: ${hostEmail}</p>
                          <p style="font-size: 13px; color: #431407; margin-top: 4px; margin-bottom: 0;">Requested: ${new Date().toLocaleString("en-IN")}</p>
                        </div>
                        <p style="font-size: 13px; color: #64748b;">Log into <a href="http://localhost:8081/host" style="color: #ff6b00; font-weight: 700;">Wayzyy Host Portal</a> to approve this import request.</p>
                      </div>
                    `,
                  }),
                });

                const adminResData = await zeptoResAdmin.json().catch(() => ({}));
                console.log("🎉 [Admin Notification Sent] Status:", zeptoResAdmin.status, adminResData);

                // Send Email B: Confirmation to Host (if host email is different)
                if (email && email !== "hello@wayzyy.com") {
                  const zeptoResHost = await fetch("https://api.zeptomail.in/v1.1/email", {
                    method: "POST",
                    headers: {
                      Accept: "application/json",
                      "Content-Type": "application/json",
                      Authorization: authHeader,
                    },
                    body: JSON.stringify({
                      from: { address: "hello@wayzyy.com", name: "Wayzyy Host Support" },
                      to: [{ email_address: { address: email } }],
                      subject: "Airbnb Listing Import Access Request Received 🌴",
                      htmlbody: `
                        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; background-color: #ffffff; color: #1e293b; border-radius: 16px; border: 1px solid #e2e8f0;">
                          <h2 style="font-size: 18px; font-weight: 800; color: #ff6b00; margin: 0 0 12px 0;">Request Received! 🌴</h2>
                          <p style="font-size: 14px; color: #334155; line-height: 1.5;">
                            Hello <strong>${hostName}</strong>, we have received your request for 1-Click Airbnb & Booking Listing Import access.
                          </p>
                          <p style="font-size: 13px; color: #64748b;">Our team is reviewing your account. You will receive an automated notification the moment access is granted!</p>
                        </div>
                      `,
                    }),
                  });
                  console.log("🎉 [Host Confirmation Sent] Status:", zeptoResHost.status);
                }
              }

              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ success: true, message: "Emails delivered via ZeptoMail" }));
            } catch (err: any) {
              console.error("[Vite Dev Server Mailer Error]:", err);
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: err?.message || "Local mailer error" }));
            }
          });
          return;
        }
        next();
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), localApiPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["three"],
  },
}));
