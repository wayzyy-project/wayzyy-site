const fs = require('fs');

const token = "PHtE6r0IEOvs2GEo90JV4KexFZSjN4gmqb42JQMSt4ZHA/MHTk1cr4wqlzXhqhgjVfVCEP+Tz48847ybterXLGfkPG1NWmqyqK3sx/VYSPOZsbq6x00asFUZfkHaVITne9Jo0SXRvtrcNA==";

async function testWithoutBounceAddress() {
  console.log("=== ZEPTOMAIL DISPATCH TEST (WITHOUT BOUNCE_ADDRESS) ===");

  try {
    const res = await fetch("https://api.zeptomail.in/v1.1/email", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Zoho-enczapikey ${token}`,
      },
      body: JSON.stringify({
        from: { address: "hello@wayzyy.com", name: "Wayzyy Platform Support" },
        to: [{ email_address: { address: "hello@wayzyy.com" } }],
        subject: "🚨 [LIVE TEST] Host 1-Click Import Access Request Notification",
        htmlbody: `
          <div style="font-family: sans-serif; padding: 24px; border: 2px solid #ff6b00; border-radius: 12px; max-width: 550px;">
            <h2 style="color: #ff6b00; margin-top: 0;">Wayzyy 1-Click Import Access Request</h2>
            <p>A host has requested 1-Click Airbnb Import Access on the Wayzyy Host Portal.</p>
            <hr style="border: 0.5px solid #eee; margin: 16px 0;" />
            <p><strong>Host Email:</strong> host.test@wayzyy.com</p>
            <p><strong>Requested At:</strong> ${new Date().toLocaleString('en-IN')}</p>
            <p style="font-size: 12px; color: #777; margin-bottom: 0;">Automated notification via Zoho ZeptoMail.</p>
          </div>
        `,
      }),
    });

    console.log("HTTP Status Code:", res.status);
    const text = await res.text();
    console.log("ZeptoMail Server Response:", text);

    if (res.ok) {
      console.log("\n🎉🎉🎉 BOOM! SUCCESSFUL DISPATCH TO hello@wayzyy.com! 🎉🎉🎉");
    }
  } catch (err) {
    console.error("Error:", err);
  }
}

testWithoutBounceAddress();
