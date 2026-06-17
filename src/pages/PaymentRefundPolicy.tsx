import { PolicyLayout } from "@/components/PolicyLayout";

export default function PaymentRefundPolicy() {
  return (
    <PolicyLayout
      title="Payment & Refund Policy"
      subtitle="Compliant with Payment and Settlement Systems Act 2007 · RBI Guidelines · Consumer Protection Act 2019"
      effectiveDate="Version 1.0"
    >
      <p>
        This Payment & Refund Policy ("Policy") governs all financial transactions on the Wayzyy platform, operated by Wayzyy Technologies Private Limited ("Wayzyy", "we", "us", or "our"). By making or receiving a payment through the Platform, you agree to the terms of this Policy.
      </p>

      <h2>1. How Payments Work on Wayzyy</h2>
      <p>
        Wayzyy operates as a marketplace that facilitates payments between guests and hosts. When a guest confirms a booking, the total booking amount is collected by Wayzyy on behalf of the host. Wayzyy holds this amount and releases it to the host after check-in, as described in Section 5.
      </p>
      <p>
        All payment processing is handled by our authorised payment gateway partner in compliance with Reserve Bank of India (RBI) guidelines and the Payment and Settlement Systems Act, 2007.
      </p>

      <h2>2. Accepted Payment Methods</h2>
      <ul>
        <li>UPI — all UPI-enabled apps including GPay, PhonePe, Paytm, and BHIM</li>
        <li>Debit cards — Visa, Mastercard, and RuPay</li>
        <li>Credit cards — Visa, Mastercard, and American Express</li>
        <li>Net banking — all major Indian banks</li>
        <li>Wayzyy wallet credits — for refunds, promotional credits, and referral rewards</li>
      </ul>

      <h2>3. What Guests Pay</h2>
      <h3>3.1 Total Price Breakdown</h3>
      <p>The total amount charged to a guest at checkout consists of:</p>
      <ul>
        <li><strong>Nightly rate</strong> — set entirely by the host. Wayzyy never alters or suppresses host pricing</li>
        <li><strong>Guest service fee</strong> — charged by Wayzyy at 7% of the total nightly rate for the booking</li>
        <li><strong>GST</strong> — applicable taxes displayed at checkout as required by law</li>
      </ul>
      <h3>3.2 How Wayzyy Compares</h3>
      <p>Wayzyy charges guests significantly less than other platforms. At a nightly rate of ₹5,000:</p>
      <ul>
        <li>Other platforms (~14% fee): Guest pays ₹5,700</li>
        <li>Wayzyy (7% fee): Guest pays ₹5,350 — saving ₹350 per night</li>
      </ul>
      <h3>3.3 No Hidden Fees</h3>
      <p>The price you see at checkout is the total price you pay. Wayzyy does not add surprise fees after booking confirmation.</p>

      <h2>4. What Hosts Pay — The Prepaid Credit Model</h2>
      <h3>4.1 No Per-Booking Commission</h3>
      <p>
        Unlike other platforms that deduct a commission from every booking payout, Wayzyy operates a prepaid credit model. Hosts purchase a credit pack upfront that unlocks a certain value of bookings on the platform. There are no deductions from your payout — you receive the full nightly rate you set.
      </p>
      <h3>4.2 Credit Tier Structure</h3>
      <ul>
        <li><strong>₹600 pack</strong> — unlocks bookings worth ₹20,000 (effective rate: 3.0%)</li>
        <li><strong>₹1,200 pack</strong> — unlocks bookings worth ₹50,000 (effective rate: 2.4%, save 20%)</li>
        <li><strong>₹2,200 pack</strong> — unlocks bookings worth ₹1,00,000 (effective rate: 2.2%, save 27%)</li>
        <li><strong>₹5,000 pack</strong> — unlocks bookings worth ₹2,50,000 (effective rate: 2.0%, save 33%)</li>
      </ul>
      <h3>4.3 Credit Pack Terms</h3>
      <ul>
        <li>Credits are non-transferable and non-refundable once purchased except as described in Section 4.4</li>
        <li>Credits do not expire as long as your Host account remains active</li>
        <li>Credits are consumed as bookings are confirmed against your listing</li>
        <li>If a booking is cancelled by a guest and a refund is issued, the corresponding credit value is restored to your account</li>
        <li>Wayzyy will give 30 days written notice before making any changes to credit tier pricing</li>
      </ul>
      <h3>4.4 Non-Refundability of Credits</h3>
      <p>
        Prepaid credits are non-refundable once purchased. The only exception is if Wayzyy terminates your Host account without cause on Wayzyy's part, in which case the proportionate unused credit value will be refunded to your original payment method within 7 working days.
      </p>

      <h2>5. Host Payout Process</h2>
      <h3>5.1 Payout Timeline</h3>
      <p>Wayzyy releases your payout within 24 hours of the guest's confirmed check-in, provided no active dispute or damage claim has been raised.</p>
      <h3>5.2 Payout Amount</h3>
      <p>You receive 100% of the nightly rate you set. Wayzyy does not deduct any amount from your payout. The guest service fee is collected separately from the guest and is Wayzyy's revenue.</p>
      <h3>5.3 Payout Method</h3>
      <p>Payouts are transferred directly to your registered Indian bank account via NEFT or IMPS.</p>
      <h3>5.4 Payout Hold Conditions</h3>
      <p>Wayzyy may place a temporary hold on your payout if an active dispute has been raised by the guest, a damage claim is under review, your account is under review for suspected policy violation, or additional KYC verification is required.</p>

      <h2>6. Refunds to Guests</h2>
      <h3>6.1 Refund Eligibility</h3>
      <p>Refunds are determined by the cancellation tier selected by the host at the time of listing. The applicable policy is displayed on every listing before booking.</p>
      <h3>6.2 Refund Processing Time</h3>
      <ul>
        <li><strong>UPI:</strong> Within 24–48 hours</li>
        <li><strong>Debit Card:</strong> 3–5 working days</li>
        <li><strong>Credit Card:</strong> 5–7 working days</li>
        <li><strong>Net Banking:</strong> 3–5 working days</li>
        <li><strong>Wayzyy Wallet Credits:</strong> Instant</li>
      </ul>
      <h3>6.3 Refund to Original Payment Method</h3>
      <p>All refunds are returned to the original payment method used at the time of booking. If the original payment method is no longer available, Wayzyy will issue the refund as Wayzyy wallet credits.</p>
      <h3>6.4 Guest Service Fee Refund</h3>
      <p>The guest service fee is refunded only if the host cancels the confirmed booking, the cancellation is made within the 24-hour free cancellation window, or Wayzyy determines a full refund is warranted. In all other cases the guest service fee is non-refundable.</p>

      <h2>7. No Off-Platform Payments</h2>
      <p>
        All payments for Wayzyy bookings must be made exclusively through the Platform. Off-platform payments are not protected by Wayzyy's cancellation, refund, or dispute policies and violate both Guest and Host Terms of Service. If a host requests payment outside the Platform, please report it immediately to <a href="mailto:hello@wayzyy.com">hello@wayzyy.com</a>.
      </p>

      <h2>8. Failed and Disputed Transactions</h2>
      <h3>8.1 Failed Payments</h3>
      <p>If your payment fails at checkout, your booking will not be confirmed. No amount will be deducted. If an amount is deducted despite a failed booking confirmation, it will be automatically refunded within 5–7 working days. Contact <a href="mailto:hello@wayzyy.com">hello@wayzyy.com</a> if you do not receive the refund.</p>
      <h3>8.2 Chargebacks</h3>
      <p>If you initiate a chargeback with your bank or card issuer for a legitimate Wayzyy booking, your account may be suspended pending investigation. Fraudulent chargebacks may result in permanent account termination and recovery of funds through legal means.</p>

      <h2>9. Taxes</h2>
      <h3>9.1 Guest-Side Taxes</h3>
      <p>GST and any other applicable taxes are included in the total price displayed at checkout. Wayzyy collects and remits these taxes as required by applicable Indian tax law.</p>
      <h3>9.2 Host-Side Taxes</h3>
      <p>Hosts are solely responsible for declaring and paying all applicable taxes on income earned through Wayzyy. Wayzyy will provide booking summaries and transaction records to assist with your tax filings but does not provide tax advice.</p>

      <h2>10. Currency</h2>
      <p>All transactions on Wayzyy are in Indian Rupees (INR) only. Wayzyy does not currently support foreign currency transactions.</p>

      <h2>11. Changes to This Policy</h2>
      <p>Wayzyy may update this Policy from time to time. We will notify you of material changes by email and via the Platform at least 14 days before they take effect.</p>

      <h2>12. Contact Us</h2>
      <ul>
        <li><strong>Payment & refund queries:</strong> <a href="mailto:hello@wayzyy.com">hello@wayzyy.com</a></li>
        <li><strong>Website:</strong> wayzyy.com</li>
        <li><strong>Address:</strong> 3 E 32, Nehru Nagar, Ghaziabad</li>
      </ul>
    </PolicyLayout>
  );
}
