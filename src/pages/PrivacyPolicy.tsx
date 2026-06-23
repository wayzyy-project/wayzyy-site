import { PolicyLayout } from "@/components/PolicyLayout";

export default function PrivacyPolicy() {
  return (
    <PolicyLayout
      title="Privacy Policy"
      subtitle="Compliant with DPDP Act 2023 · DPDP Rules 2025 · IT Act 2000 · IT (SPDI) Rules 2011 · UIDAI Guidelines · Income Tax Act (Sec 194-O)"
      effectiveDate="Effective Date: June 24, 2026 · Version 1.0"
    >
      <p>
        Wayzyy Technologies Private Limited ("Wayzyy", "we", "us", or "our") is committed to protecting your personal data. This Privacy Policy explains how we collect, use, store, share, and protect your personal information when you use the Wayzyy platform, including our website and mobile application (collectively, the "Platform").
      </p>
      <p>
        This Privacy Policy is prepared in strict compliance with the Digital Personal Data Protection Act, 2023 ("DPDP Act") and the Digital Personal Data Protection Rules, 2025 ("DPDP Rules"), notified by the Ministry of Electronics and Information Technology on November 13, 2025. It also complies with the Information Technology Act, 2000, the IT (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011, and applicable UIDAI guidelines governing identity verification.
      </p>
      <p>
        The DPDP Act is being enforced in a phased manner: Phase 1 commenced on November 13, 2025 (Establishment of the Board); Phase 2 (Consent Manager framework) becomes effective November 13, 2026; Phase 3 (all remaining substantive obligations including penalties) becomes fully enforceable from May 13, 2027. Wayzyy has engineered its data architecture to be fully compliant ahead of the statutory enforcement timelines.
      </p>
      <p>
        By using the Platform, you provide your free, informed, specific, and unambiguous consent to the data practices described in this Privacy Policy as required under the DPDP Act. If you do not agree, please do not use the Platform.
      </p>

      <h2>1. Who We Are</h2>
      <p>
        Wayzyy Technologies Private Limited is the Data Fiduciary as defined under Section 2(i) of the DPDP Act, 2023. You are the Data Principal.
      </p>
      <ul>
        <li><strong>Registered Name:</strong> Wayzyy Technologies Private Limited</li>
        <li><strong>Registered Address:</strong> 32 E, Nehru Nagar, Ghaziabad, Uttar Pradesh, India</li>
        <li><strong>Data Protection &amp; Grievance Contact:</strong> <a href="mailto:grievance@wayzyy.com">grievance@wayzyy.com</a> / <a href="mailto:privacy@wayzyy.com">privacy@wayzyy.com</a></li>
      </ul>

      <h2>2. What Personal Data We Collect</h2>
      <h3>2.1 Data You Provide Directly</h3>
      <ul>
        <li>Full name, email address, and phone number at account registration.</li>
        <li>For Indian Residents: Identity verification records handled via a UIDAI-approved secure ecosystem as described in Section 4.</li>
        <li>For Foreign Nationals: Valid Passport data, visa details, and FRRO-compliant credentials necessary to fulfill statutory guest registration requirements.</li>
        <li>Profile photo, government-approved identification scans, and any additional identity documents submitted voluntarily for trust profiling.</li>
        <li>Property details, geotags, structural photos, local tourism registration numbers, and listing details provided by hosts.</li>
        <li>Bank account details, PAN card numbers, and GSTIN (where applicable) provided by hosts for financial payouts and mandatory Tax Deducted at Source (TDS) reporting.</li>
        <li>Messages, chat logs, reviews, and communications sent between users through the Platform's built-in messaging system.</li>
      </ul>
      <h3>2.2 Data Collected Automatically</h3>
      <ul>
        <li>Device information including device type, operating system, network provider, and unique device identifiers.</li>
        <li>IP address and precise/approximate location data to facilitate local search and compliance checks.</li>
        <li>Usage data including pages visited, search queries, booking history, interaction timelines, and session lengths.</li>
        <li>Cookies and similar tracking technologies as described in our Cookie Policy.</li>
      </ul>
      <h3>2.3 Data from Third Parties</h3>
      <ul>
        <li>Identity verification outcomes, validity checks, and tokenized reference IDs from our authorized KYC partners (including DigiLocker API connections).</li>
        <li>Payment transaction tokens, payment statuses, and transaction reference numbers from our authorized, RBI-compliant payment gateway partners.</li>
      </ul>

      <h2>3. How We Use Your Data</h2>
      <p>We use your personal data only for specified, lawful purposes for which you have explicitly granted consent:</p>
      <ul>
        <li>To create, verify, maintain, and manage your account on the Platform.</li>
        <li>To execute secure identity verification via secure KYC channels for guests and hosts.</li>
        <li>To facilitate bookings, secure escrow holdings, payouts, and financial clearances between guests and hosts.</li>
        <li>To execute statutory tax mandates, including the deduction and filing of 1% TDS under Section 194-O of the Income Tax Act, 1961 for host payouts.</li>
        <li>To provide customer support, mediate property damage assessments, and execute the Dispute Resolution Policy.</li>
        <li>To send transactional notifications, including OTPs, booking confirmations, fiscal receipts, and safety alerts via SMS, email, and WhatsApp.</li>
        <li>To send promotional communications and hyper-local travel experiences where you have granted separate, explicit opt-in consent.</li>
        <li>To detect, flag, analyze, and prevent fraud, communication bypass attempts, off-platform transaction leakage, and trust and safety incidents.</li>
        <li>To comply with applicable central and state legal obligations, including police investigations, local tourism rules (such as Form C and Form XI filings), court orders, and lawful government requests.</li>
      </ul>

      <h2>4. Secure Identity Verification &amp; Governance</h2>
      <p>Identity verification is conducted strictly in compliance with applicable statutory frameworks and guidelines. The following safeguards apply without exception:</p>
      <ul>
        <li>Identity verification is executed strictly through an authorized KYC User Agency (KUA) or Authentication User Agency (AUA) utilizing secure DigiLocker or eKYC pipelines. Wayzyy never directly views, accesses, or stores raw national identity digits.</li>
        <li>Only a secure, tokenized identity reference or a legally permitted masked version is retained in our databases to validate verification success.</li>
        <li>Your identity documentation is held under strict siloed conditions and is never shared with hosts, guests, or any third party, save for our authorized compliance tech partners.</li>
        <li>You retain the absolute right to withdraw consent for identity verification at any time by writing to <a href="mailto:privacy@wayzyy.com">privacy@wayzyy.com</a>. Because verification is a foundational platform requirement to maintain community safety, withdrawing verification consent will result in the immediate termination of your platform access and account deactivation.</li>
      </ul>

      <h2>5. Legal Basis for Processing — Consent Framework</h2>
      <p>
        Under the DPDP Act, 2023, consent is the primary legal basis for processing personal data. Wayzyy relies on clear, affirmative consent for all data processing activities. We explicitly reject the use of broad, unilateral clauses such as &lsquo;legitimate interests&rsquo; to bypass user consent.
      </p>
      <p>Your consent on Wayzyy is strictly:</p>
      <ul>
        <li><strong>Free</strong> — not bundled or made a condition for any basic service you are entitled to receive without it.</li>
        <li><strong>Informed</strong> — presented clearly via an upfront itemized data notice specifying exactly what data is collected and why before processing begins.</li>
        <li><strong>Specific</strong> — separately toggled for different operational features (e.g., standard hosting/booking vs. marketing opt-ins).</li>
        <li><strong>Unambiguous</strong> — attained strictly via a clear, affirmative digital action (e.g., explicit opt-in confirmations), never via pre-ticked check-boxes or inferred from user silence.</li>
      </ul>
      <p>
        You may withdraw consent for any processing purpose at any time by contacting <a href="mailto:privacy@wayzyy.com">privacy@wayzyy.com</a>. Withdrawal of consent does not impact the lawfulness of any data processing successfully completed before the timestamp of withdrawal.
      </p>
      <p>
        In complete alignment with Phase 2 of the DPDP Rules, starting November 13, 2026, you will possess the functional capability to review, manage, and withdraw your consent through central, government-registered Consent Managers natively linked to the Wayzyy infrastructure.
      </p>

      <h2>6. How We Share Your Data</h2>
      <p>We do not sell, rent, or trade your personal data. We share data only under the following strictly defined, mandatory operational scenarios:</p>
      <h3>6.1 Between Guests and Hosts</h3>
      <p>Upon confirmation of a booking, the platform automatically shares the guest's name, verified profile badge status, and contact number with the host, and the host's property address and contact details with the guest. Financial data, PAN cards, and sensitive identity details are completely hidden and never shared between users.</p>
      <h3>6.2 Data Processors and Service Providers</h3>
      <p>We partner with trusted Data Processors to handle specific platform microservices under strict written data-sharing contracts. These include our cloud hosting infrastructure (AWS), our RBI-compliant payment gateway (Razorpay), our authorized identity verification engine, and our communication routing APIs. All such processors are legally prohibited from retaining, using, or sharing your data for any independent secondary purpose.</p>
      <h3>6.3 Legal and Regulatory Compliance</h3>
      <p>We may disclose personal data to law enforcement, tax authorities (for TDS compliance), or tourism boards if mandated by an explicit statutory order, a valid court warrant, or a legal summons under Indian law. Where legally permissible, we will notify you immediately of any such data requests.</p>
      <h3>6.4 Corporate Adjustments</h3>
      <p>In the event of an asset sale, merger, restructuring, or strategic acquisition of Wayzyy Technologies Private Limited, user data will transfer to the succeeding entity as an active asset. You will be provided with an explicit 30-day notice via your registered email before any such transfer occurs, allowing you the right to delete your data prior to the transition.</p>

      <h2>7. Data Retention</h2>
      <p>Wayzyy retains personal data only for the absolute minimum timeline necessary to satisfy operational purposes and statutory record-keeping mandates:</p>
      <ul>
        <li><strong>Account Profile Data:</strong> Retained for the active lifecycle of your user account, and safely archived for a maximum of 3 years post account closure to protect against fraudulent re-registrations.</li>
        <li><strong>Fiscal and Booking Records:</strong> Retained for a mandatory period of 7 years to stay fully compliant with Indian tax laws, GST frameworks, and corporate financial audits.</li>
        <li><strong>Identity Audit Tokens:</strong> Tokenized verification keys are held securely; raw files uploaded during temporary onboarding are purged from live buffers immediately after verification validation.</li>
        <li><strong>Dispute and Damage Claim Logs:</strong> Retained for 1 year following the successful closure and resolution of the claim to protect against recurring legal issues.</li>
        <li><strong>Anonymized Analytics:</strong> Non-identifiable tracking logs are stripped of all personal markers within 12 months and held purely for performance benchmarking.</li>
      </ul>

      <h2>8. Data Security &amp; Encryption Standards</h2>
      <p>Wayzyy implements strict administrative, physical, and technical security controls in absolute compliance with the IT (SPDI) Rules, 2011, and the DPDP Rules, 2025:</p>
      <ul>
        <li>100% of data transmitted across the Platform is secured using industry-standard Transport Layer Security (TLS) encryption protocols.</li>
        <li>Financial details, tax inputs, and tokenized identity records are encrypted at rest using high-grade cryptographic algorithms.</li>
        <li>Data access inside Wayzyy is governed by the Principle of Least Privilege — only authorized core security personnel can access specific fields under audited conditions.</li>
        <li>Continuous security monitoring, automated vulnerability scanning, and routine platform patches are executed natively.</li>
        <li>In strict alignment with the DPDP Rules and CERT-In guidelines, in the event of a suspected or confirmed data breach that impacts user records, Wayzyy will report the incident to the Data Protection Board of India (DPBI) and CERT-In within the statutory hours of discovery and notify all impacted users via direct digital communication without delay.</li>
      </ul>

      <h2>9. Your Statutory Rights as a Data Principal</h2>
      <p>In accordance with the DPDP Act, 2023, you hold the following absolute rights which you can exercise by writing to <a href="mailto:privacy@wayzyy.com">privacy@wayzyy.com</a>:</p>
      <ul>
        <li><strong>Right to Summary:</strong> Request a clear itemized summary of all personal data Wayzyy holds about you, along with a log of which third-party Data Processors have accessed it.</li>
        <li><strong>Right to Correction and Erasure:</strong> Complete authority to update inaccurate fields, correct outdated records, or command the absolute deletion of your data when it is no longer bound by statutory retention laws.</li>
        <li><strong>Right to Revocation:</strong> Withdraw your consent for any active data vertical at any point, with processing ceasing immediately upon verification of your request.</li>
        <li><strong>Right to Grievance Redressal:</strong> Direct access to escalate unresolved service or data handling issues to our Grievance Officer, and subsequently to the Data Protection Board of India (DPBI).</li>
        <li><strong>Right to Nomination:</strong> Authorize and name a legal nominee who can step in to manage, review, or command the erasure of your personal data in the event of your death or physical/mental incapacity.</li>
      </ul>
      <p>All legitimate requests will be acknowledged within 48 hours and processed within a maximum turnaround time of 30 days.</p>

      <h2>10. Strict Data Localization</h2>
      <p>In complete compliance with Indian data sovereignty mandates, 100% of personal data collected from users residing in India is processed, managed, and stored on secure cloud servers located physically within the boundaries of the Republic of India.</p>

      <h2>11. Children's Privacy Governance</h2>
      <p>Wayzyy is engineered strictly for users who have attained the legal age of majority (18 years or older). We do not knowingly permit minors to access the platform. In absolute alignment with the DPDP Rules, any inadvertent collection of a minor's data without verifiable parental or guardian consent will be met with immediate, permanent data erasure upon discovery. Reports can be routed directly to <a href="mailto:privacy@wayzyy.com">privacy@wayzyy.com</a>.</p>

      <h2>12. Interactive Cookies &amp; Tracking</h2>
      <p>The platform deploys functional cookies to retain login states, preserve search filters, and optimize app screen rendering speeds. Full granular controls to opt out of tracking scripts are available natively within your device profile or by reviewing our dedicated Cookie Policy at wayzyy.com/cookies.</p>

      <h2>13. Structural Updates to This Policy</h2>
      <p>Wayzyy reserves the right to modify this Privacy Policy to mirror engineering updates, product pivots, or legal amendments across India. For all material changes, we will issue a direct push alert on the app and send a broadcast notification to your registered email at least 14 days before the updated policy takes effect, ensuring your continued use remains completely informed.</p>

      <h2>14. Named Data Protection &amp; Grievance Redressal Officer</h2>
      <p>In compliance with Section 11 of the IT Act, 2000, and the core frameworks of the DPDP Act, 2023, our designated Data Protection Officer (DPO) and Grievance Officer is:</p>
      <ul>
        <li><strong>Name:</strong> Akshay Sharma</li>
        <li><strong>Designation:</strong> Data Protection Officer &amp; Grievance Officer</li>
        <li><strong>Email:</strong> <a href="mailto:grievance@wayzyy.com">grievance@wayzyy.com</a> / <a href="mailto:support@wayzyy.com">support@wayzyy.com</a></li>
        <li><strong>Registered Address:</strong> Wayzyy Technologies Private Limited, 32 E, Nehru Nagar, Ghaziabad, Uttar Pradesh, India</li>
        <li><strong>Turnaround SLA:</strong> Acknowledged within 48 hours, fully resolved within 30 days.</li>
      </ul>
      <p>
        <strong>Escalation Path:</strong> If your data grievance remains unresolved or unsatisfied after our internal 30-day review timeline, you possess the clear legal right to file an official complaint and escalate the matter directly to the Data Protection Board of India (DPBI), the statutory central authority established under the DPDP Act, 2023.
      </p>

      <h2>15. Contact and Communications</h2>
      <p>For any systemic privacy requests, structural legal data queries, or clarification on your data rights, connect with our team directly:</p>
      <ul>
        <li><strong>Formal Data Queries:</strong> <a href="mailto:privacy@wayzyy.com">privacy@wayzyy.com</a></li>
        <li><strong>User Account Support:</strong> <a href="mailto:support@wayzyy.com">support@wayzyy.com</a></li>
        <li><strong>Corporate Core Portal:</strong> wayzyy.com/privacy</li>
      </ul>
    </PolicyLayout>
  );
}
