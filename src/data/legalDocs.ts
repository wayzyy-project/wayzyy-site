// Ported from mobile/src/data/legalDocs.ts — keep both in sync. These back the
// dynamic /policies/:docId pages. Privacy Policy, Payment & Refund Policy, Host
// Terms, and Guest Terms already have dedicated static pages/routes and are not
// duplicated here.
export interface LegalSection {
  heading?: string;
  paragraphs: string[];
}

export interface LegalDoc {
  id: string;
  title: string;
  subtitle: string;
  sections: LegalSection[];
}

export const EFFECTIVE_DATE = '25 June 2026';

export const LEGAL_DOCS: Record<string, LegalDoc> = {
  'cancellation': {
    id: 'cancellation',
    title: 'Cancellation Policy',
    subtitle: 'Governed by Indian law · Consumer Protection (E-Commerce) Rules, 2020 · Indian Contract Act, 1872 · IT Act, 2000 · BNS, 2023',
    sections: [
      {
        paragraphs: [
          'This Cancellation Policy ("Policy") establishes the comprehensive frameworks, refund percentages, and administrative timelines governing booking cancellations executed by guests or hosts on the Wayzyy platform.',
          'As an e-commerce intermediary, Wayzyy provides this automated framework to balance traveller flexibility with host payout security. By publishing a listing or confirming a reservation on the Platform, you explicitly agree to be bound by the parameters of this Policy. This Policy forms an inseparable element of Wayzyy\'s master Terms of Service and must be read in conjunction with the Guest Terms of Service, Host Terms of Service, and Damage & Security Policy.',
        ],
      },
      {
        heading: '1. The Global 24-Hour Free Cancellation Window',
        paragraphs: [
          'Wayzyy enforces a mandatory, platform-wide grace period across every property listing:',
          '• The Rule: A guest is entitled to receive a 100% full refund of the nightly base rate and the 7% platform service fee if the cancellation is executed within 24 hours of the initial booking confirmation timestamp.',
          '• The Statutory Condition: This 24-hour grace period is active only if the confirmed check-in date is at least 7 full days (168 hours) away at the moment of cancellation.',
          '• Host Exemption Bar: Property hosts cannot opt out, alter, or override this 24-hour window on any listing. After the expiration of this window, the host\'s selected cancellation tier applies automatically.',
        ],
      },
      {
        heading: '2. Standardised Accommodation Cancellation Tiers',
        paragraphs: [
          'Property hosts select one of three cancellation tiers when configuring their listing. The chosen tier is locked and presented before a traveller authorises payment.',
          'Tier 1 — Flexible Plan (best suited for high-demand tourist centres and high-turnover inventory):',
          '• Cancellation ≥ 24 hours prior to check-in: 100% refund of nightly base rate. Host receives no payout.',
          '• Cancellation < 24 hours prior to check-in or No-Show: 100% refund for subsequent nights. Host is paid the full first night\'s base rate.',
          '• The 7% platform service fee is non-refundable after the 24-hour window.',
          'Tier 2 — Balanced Plan (platform recommended — symmetric protection for travellers and hosts):',
          '• Cancellation ≥ 7 days prior to check-in: 100% refund. Host receives no payout.',
          '• Cancellation 3 to 7 days prior to check-in: 50% refund. Host receives 50% payout.',
          '• Cancellation < 72 hours prior to check-in or No-Show: 0% refund. Host receives 100% payout.',
          'Tier 3 — Firm Plan (engineered for premium luxury villas, peak-season holiday rentals, and high-maintenance properties):',
          '• Cancellation ≥ 14 days prior to check-in: 100% refund. Host receives no payout.',
          '• Cancellation 7 to 14 days prior to check-in: 50% refund. Host receives 50% payout.',
          '• Cancellation < 7 days prior to check-in or No-Show: 0% refund. Host receives 100% payout.',
        ],
      },
      {
        heading: '3. Long-Term Stay Cancellation Architecture (28+ Nights)',
        paragraphs: [
          'Reservations extending for 28 consecutive nights or longer automatically bypass standard tiers to protect hosts from structural monthly vacancy losses.',
          '• Available Tiers: Only Tier 2 (Balanced) and Tier 3 (Firm) can be linked to long-term listings. Tier 1 (Flexible) is structurally unavailable.',
          '• Pre-Arrival Cancellation: After the global 24-hour window, the host retains the full first 30 days of the nightly base rate as a non-refundable retainer. The remaining balance of the long stay is refunded to the guest.',
          '• Mid-Stay Cancellation: If a guest cancels mid-reservation, the host is paid 100% for all nights already spent, plus an additional 14-day non-refundable termination payout to cover the operational disruption. The remaining balance is returned to the guest.',
        ],
      },
      {
        heading: '4. Host-Initiated Cancellation Sanctions',
        paragraphs: [
          'Host-initiated cancellations break traveller security and damage marketplace reliability. Wayzyy enforces a strict disciplinary framework:',
          '• Immediate Guest Protection: Instant 100% source refund, including all platform fees.',
          '• Inconvenience Credit: Wayzyy adds ₹500 marketplace credit to the impacted guest\'s wallet; the cost is billed directly to the host\'s ledger.',
          '• Public Profile Log: A permanent text marker — "Host canceled this reservation [X] days before arrival" — is appended to the host\'s public profile.',
          '• Search Suppression: The property listing experiences an automatic 30-day organic search placement drop within the Platform\'s recommendation algorithm.',
          '• Account Recurrence Audit: Multiple host-initiated cancellations within a 6-month cycle trigger an immediate compliance audit, resulting in temporary account suspension or permanent deactivation.',
        ],
      },
      {
        heading: '5. Statutory Extenuating Circumstances (Force Majeure)',
        paragraphs: [
          'Under a verified Force Majeure event, Wayzyy will override standard host tiers, issue a 100% full refund to the guest (including platform fees), and waive all host penalties.',
          'Events must be formally reported to support@wayzyy.com within 48 hours of the event occurrence, backed by verified government, medical, or administrative documentation.',
          'Valid Qualifying Events:',
          '• Government-mandated lockouts, curfews, or sudden travel bans restricting entry into the destination.',
          '• Documented natural disasters, active landslides, floods, or cyclones rendering the property physically inaccessible or structurally hazardous.',
          '• Sudden, life-threatening medical emergencies or the unexpected demise of the primary booking guest, the property host, or an immediate first-degree family member (requires official medical certificate or death summary).',
          '• Property rendered completely uninhabitable due to severe, non-negligent critical infrastructure failure (e.g., localised grid failure, main water line burst).',
          'Explicitly Excluded Events (remain bound by standard host tiers):',
          '• Personal schedule conflicts, workplace changes, or shifts in personal holiday dates.',
          '• Standard seasonal weather disruptions (e.g., standard monsoon rain in Goa, standard winter cold snaps).',
          '• Common airline delays, public transportation strikes, or missed train connections — unless directly caused by an overarching natural disaster.',
          '• Inability to obtain a personal vehicle or localised driver options.',
        ],
      },
      {
        heading: '6. Refund Processing Timelines',
        paragraphs: [
          'Wayzyy uses automated APIs integrated with our RBI-compliant payment gateway partner (Razorpay). Once a cancellation is finalised, funds are processed as follows:',
          '• UPI Reversals: Processed via instant network rails within 24 to 48 hours.',
          '• Net Banking & Debit Card Switches: Processed via standard clearing houses within 3 to 5 business days.',
          '• Credit Card Networks: Reversals initiated within 24 hours, reflecting on the card statement within 5 to 7 business days.',
        ],
      },
      {
        heading: '7. Structural Immutability Rule',
        paragraphs: [
          'The specific cancellation tier active on the database at the exact millisecond the guest clears payment is cryptographically locked as the definitive reference for that reservation. Hosts cannot retroactively alter cancellation guidelines for existing bookings by changing their dashboard parameters later.',
        ],
      },
      {
        heading: '8. Policy Amendments',
        paragraphs: [
          `Wayzyy reserves the right to modify this Policy to ensure ongoing alignment with Indian consumer protection rules and technology updates. Material modifications will be accompanied by a 14-day advance notification displayed on the Platform or pushed directly to your registered email. Effective Date: ${EFFECTIVE_DATE}.`,
        ],
      },
    ],
  },

  'community-guidelines': {
    id: 'community-guidelines',
    title: 'Community Guidelines',
    subtitle: 'Governed by Indian law · IT Act, 2000 · IT Intermediary Rules, 2021 · Consumer Protection (E-Commerce) Rules, 2020 · DPDP Act, 2023 · BNS, 2023',
    sections: [
      {
        paragraphs: [
          'Wayzyy is built entirely on a foundation of structural trust. Every host who lists a property, every guest who books a stay, and every organiser who coordinates a social gathering is an integral member of a shared ecosystem. These Community Guidelines ("Guidelines") establish the mandatory standards of conduct we require from every participant.',
          'These Guidelines govern all users of the Wayzyy platform — hosts, guests, and event organisers — across all interactions, both digital and physical, that arise from or relate to a Platform listing or reservation. These Guidelines form an inseparable element of Wayzyy\'s master Terms of Service and must be read alongside the Guest Terms of Service, Host Terms of Service, Cancellation Policy, and Damage & Security Policy.',
          'Material breach of these Guidelines will result in targeted administrative sanctions, including instant listing deactivation, temporary profile suspension, or permanent, irreversible removal from the Platform.',
        ],
      },
      {
        heading: '1. Our Core Marketplace Principles',
        paragraphs: [
          'Every transaction, communication, and interaction on Wayzyy is anchored to five non-negotiable pillars:',
          '• Safety First: Prioritising the uncompromised physical, psychological, and emotional safety of all community members.',
          '• Absolute Honesty: Mandating verifiable accuracy across all listings, user profiles, transactional communications, and review systems.',
          '• Unconditional Respect: Guaranteeing equal dignity to every individual, completely free from discrimination, bias, or harassment.',
          '• Traceable Accountability: Anchoring user actions directly to verified government-grade identity tokens to eliminate anonymous bad actors.',
          '• Transaction Transparency: Routing 100% of booking queries, escrow collections, and payouts through the Platform\'s encrypted infrastructure.',
        ],
      },
      {
        heading: '2. General Behavioral Codes for All Users',
        paragraphs: [
          '2.1 Verifiable Honesty — All profile bio entries, identity inputs, listing details, and messaging logs must be fully accurate and free of deceptive spin. Users are strictly prohibited from misrepresenting property boundaries, utility specifications, pricing models, or booking intents. Wayzyy enforces a zero-tolerance policy against paid, manufactured, or retaliatory review manipulation.',
          '2.2 Civil Interpersonal Conduct — Users must treat all hosts, guests, neighbours, and Wayzyy team members with absolute courtesy. The use of defamatory, profane, abusive, or explicitly discriminatory language within the in-app chat system is strictly prohibited. Wayzyy prohibits any form of stalking, digital tracking, targeted intimidation, or extra-platform harassment connected to a booking.',
          '2.3 Strict Intermediary Infrastructure Adherence — All financial liabilities and clearances must be executed exclusively through the Platform\'s checkout. Users must never suggest, request, or accept direct off-platform transfers — such as cash handovers, direct bank deposits, or personal UPI transactions. Off-platform transaction leakage directly removes your booking from Wayzyy\'s mediation buffers, cancellation protections, and damage recovery frameworks.',
          '2.4 Privacy & Data Protection — Users must treat all personal information obtained via a booking as confidential. Sharing, exporting, or publishing another user\'s identity details, contact coordinates, or property locations to third parties without explicit written consent is a direct violation of platform guidelines. Capturing secret, unapproved photographic or video records of other users or private property zones without clear, affirmative consent is completely barred.',
          '2.5 Compliance with the Rule of Law — All active operations, listings, and guest behaviours linked to a Platform booking must remain fully compliant with the central and state laws of India. The Platform must never be utilised to host, store, advertise, or execute illegal or prohibited activities.',
        ],
      },
      {
        heading: '3. Dedicated Operational Codes for Property Hosts',
        paragraphs: [
          '3.1 Listing Integrity and Calendar Hygiene — Every listing must provide an honest mirror of the underlying asset. Structural photos, amenities, location pins, and house rules must accurately reflect reality. Hosts must never publish a unit without clear, verified property ownership or formal leasing authorisation allowing short-term rentals. Creating duplicate listings to game the Platform\'s search algorithms is strictly prohibited. Availability calendars must be maintained with absolute precision to eliminate double-booking rejections.',
          '3.2 Inclusive Guest Relations — Hosts must extend equal hospitality to all travellers. Wayzyy strictly prohibits any refusal of service, explicit cancellation, or conditional booking based on a guest\'s religion, caste, gender, marital configuration, dietary choices, or physical disabilities. Property walkthroughs or host entries during an active guest reservation are completely barred unless explicit advance notice is delivered and consent is granted, or in the case of a verified life-threatening emergency.',
          '3.3 Strict Surveillance Constraints — The presence, orientation, and data logging capacity of all outdoor security cameras or ambient decibel tracking devices must be clearly declared in the listing description before a guest completes checkout. Surveillance equipment, recording devices, or smart monitors are completely prohibited inside any indoor boundary of the property, including bedrooms, living areas, hallways, kitchens, or bathrooms.',
          '3.4 Operational Cancellation Mandates — Hosts are structurally barred from cancelling confirmed reservations except under verified, documented force majeure events. Speculative or revenue-gaming host cancellations disrupt traveller security and harm platform integrity. See the Cancellation Policy for applicable sanctions.',
        ],
      },
      {
        heading: '4. Dedicated Operational Codes for Guests',
        paragraphs: [
          '4.1 Preservation of Property Assets — Guests must maintain the property and its underlying fixtures with appropriate care, returning the unit in the exact state of utility in which it was received. Guests are strictly bound by the host\'s documented house rules, maximum occupancy limitations, and pet allowance configurations.',
          '4.2 Neighbourhood Integration and Noise Curfews — Guests must behave as considerate temporary residents, keeping noise levels low. The use of external amplifiers or professional sound systems is strictly prohibited. A non-negotiable noise curfew is enforced across all residential zones past 10:00 PM. Outdoor music playback past this hour is structurally barred. Guests are prohibited from organising unapproved parties or crowd gatherings unless the listing is explicitly designated as a compliant event venue.',
          '4.3 Contractual Accountability — Booking metrics — including total guest headcounts, check-in dates, and intent of occupancy — must be reported with complete accuracy. By completing identity verification, the guest establishes an un-deniable identity reference under the Information Technology Act, 2000, accepting direct civil liability for any property damage or contractual defaults during the stay.',
        ],
      },
      {
        heading: '5. Zero-Tolerance Infractions & Immediate Platform Sanctions',
        paragraphs: [
          'Verification of any behavioural infraction under this category triggers immediate, permanent account termination without administrative warning or right of appeal. Serious breaches are routed directly to central and state enforcement authorities:',
          '• Physical violence, assault, or explicit threats directed at any user → Permanent Ban + Police Report under BNS, 2023.',
          '• Sexual harassment, non-consensual tracking, or physical battery → Permanent Ban + Police Report under BNS, 2023.',
          '• Undisclosed or hidden surveillance cameras inside private indoor property zones → Permanent Ban + Prosecution under IT Act, 2000.',
          '• Explicit discrimination based on caste, religion, or community metrics → Permanent Ban + Permanent Marketplace Deactivation.',
          '• Identity fraud, manufacturing duplicate profiles, or publishing fake listings → Permanent Ban + Legal Action under BNS, 2023 and IT Act, 2000.',
          '• Facilitating or fulfilling unlawful commercial operations on premises → Permanent Ban + Direct Police Report under applicable state laws.',
          '• Child exploitation, endangerment, or mandatory protection breaches → Permanent Ban + Mandatory Report under central child protection frameworks.',
        ],
      },
      {
        heading: '6. Behavioural Monitoring, Data Tracking & Enforcement',
        paragraphs: [
          '6.1 Consent-Led Compliance Analytics — In compliance with the DPDP Act, 2023, the user explicitly acknowledges and grants affirmative consent for Wayzyy to log, track, process, and evaluate their behavioural history, platform interaction logs, community reports, and default metrics to identify risk profiles and execute enforcement protocols.',
          '6.2 Escalation Matrix for Infractions:',
          '• Written Warning: A formal compliance notice pinned to the user\'s registry, serving as a tracking marker for recurring defaults.',
          '• Listing Suppression: Temporary removal of a host\'s properties from the live search recommendation indexes during an active trust audit.',
          '• Profile Suspension: Temporary block on a user\'s ability to book or host while an internal investigation is actively pursued.',
          '• Permanent Marketplace Ban: Complete, irreversible termination of all user profiles and active credentials across the Wayzyy network.',
          '6.3 Administrative Review Processes — If a user maintains that an administrative sanction was executed due to a data error or mistaken profiling, they hold the right to file an appeal within 14 days by submitting comprehensive evidentiary logs directly to support@wayzyy.com. Wayzyy will evaluate the appeal within 7 business days. This review path is strictly unavailable for confirmed Zero-Tolerance infractions under Section 5.',
        ],
      },
      {
        heading: '7. Centralized Reporting Protocols',
        paragraphs: [
          'Community members can flag active violations via the following channels:',
          '• Click the built-in "Report" button directly within the chat logs, property cards, or user profile views.',
          '• Route comprehensive evidentiary photos, screenshots, and logs to: support@wayzyy.com.',
          'All reports are managed under strict parameters of privacy and data silo segregation. Wayzyy will never reveal the identity of a reporting user to the target of the investigation.',
          `For situations involving active physical danger, personal medical issues, or fire hazards, users must connect with statutory public emergency frameworks immediately (Police: 100, Fire: 101, Ambulance: 108) before reporting the event to the Platform. Effective Date: ${EFFECTIVE_DATE}.`,
        ],
      },
    ],
  },

  'damage-security': {
    id: 'damage-security',
    title: 'Damage & Security Policy',
    subtitle: 'Governed by Indian law · Indian Contract Act, 1872 · Consumer Protection (E-Commerce) Rules, 2020 · DPDP Act, 2023 · Code of Civil Procedure, 1908 (Order XXXVII)',
    sections: [
      {
        paragraphs: [
          'This Damage & Security Policy ("Policy") sets out the rights, obligations, and liabilities of hosts and guests on the Wayzyy platform in relation to property damage, safety protocols, and security interventions during a stay.',
          'By executing a booking transaction or publishing a listing on the Platform, you explicitly agree to be bound by this Policy. This Policy forms an integral part of Wayzyy\'s overall Terms of Service and must be read alongside the Guest Terms of Service, Host Terms of Service, Cancellation Policy, and Community Guidelines.',
          'Wayzyy operates strictly as an online marketplace intermediary. We do not own, manage, lease, or physically operate any property listed on the Platform, nor do we function as an insurance provider.',
        ],
      },
      {
        heading: '1. Wayzyy\'s Approach to Damage and Security',
        paragraphs: [
          'Our role in managing property damage and security incidents is defined by the following parameters:',
          '• Evidence-Based Frameworks: Providing a structured, highly transparent, and neutral damage evaluation architecture for hosts.',
          '• Traceable Accountability: Ensuring that every user profile is backed by robust government-grade identity verification, anchoring all civil liabilities to verified individuals.',
          '• Depreciated Valuation Mediation: Mediating disputes between hosts and guests using objective photographic timelines and statutory depreciation models.',
          '• Safe Community Maintenance: Enforcing zero-tolerance protocols for safety and surveillance violations to preserve ecosystem integrity.',
        ],
      },
      {
        heading: '2. Guest Liability for Damage',
        paragraphs: [
          '2.1 General Liability — Guests are required to maintain and leave the booked property and its contents in the exact state of cleanliness and utility in which it was delivered at check-in. By completing identity verification, the guest acknowledges and accepts absolute civil and legal liability for any material damage, operational loss, unapproved structural alteration, or permanent destruction caused to the property during the booking hours — whether caused directly by the guest, members of their invited party, or any third party they permit onto the premises.',
          '2.2 What Counts as Material Damage:',
          '• Physical cracks, breaks, or structural damage to furniture, doors, walls, glass fixtures, or built-in appliances.',
          '• Permanent staining, cigarette burns, tearing, or deep soiling of carpets, curtains, mattresses, cushions, and linen.',
          '• Mechanical or electronic failure of appliances (TV, AC, refrigerator, water heaters) caused by improper usage, negligence, or physical impact.',
          '• Unauthorised removal or theft of any inventory item belonging to the host.',
          '• Deep-cleaning or specialised restoration costs required due to violations of platform house rules (such as unauthorised indoor smoking or unapproved pets).',
          '2.3 Explicitly Excluded from Damage Claims:',
          '• Normal Wear and Tear: Gradual, expected degradation from reasonable day-to-day use (e.g., minor scuffs on floor mats, standard light bulb expiration).',
          '• Pre-existing Damage: Structural anomalies or cosmetic flaws present at the property prior to the guest\'s check-in timestamp.',
          '• Uninventoried Assets: Items not logged or documented in the host\'s active property inventory prior to the stay.',
        ],
      },
      {
        heading: '3. Host Responsibilities Before and After Stays',
        paragraphs: [
          'To qualify for damage mediation, hosts must satisfy the following guidelines:',
          '• Pre-Stay Documentation: Conduct a thorough walkthrough inspection immediately prior to guest arrival and take high-resolution, dated photographs establishing the baseline condition of all assets.',
          '• Inventory Readiness: Maintain an up-to-date, itemised internal inventory of all high-value assets, backed by digital scans of original purchase invoices.',
          '• Immediate Post-Stay Walkthrough: Complete a detailed walkthrough inspection immediately upon guest checkout.',
          '• Checkout Photographic Evidence: Capture clear, high-resolution, timestamped photographs of any discovered damage at the exact hour of checkout before any cleaning or repairs begin.',
        ],
      },
      {
        heading: '4. The Evidence-Led Damage Claim Process',
        paragraphs: [
          '4.1 Strict 24-Hour Reporting Window — Hosts must formally log a damage claim on the Wayzyy dashboard within 24 hours of the guest\'s confirmed checkout time. Claims initiated after the expiration of this window are structurally barred and will not be reviewed.',
          '4.2 Mandatory Evidence Required — A damage claim will be instantly dismissed unless the host uploads all three of the following components together within the reporting window:',
          '• Proof of Value: The original purchase invoice showing the item name, exact purchase cost, and date of purchase. If unavailable, a verified bank or credit card statement coupled with an official market replacement quotation from a licensed supplier.',
          '• Photographic Timeline: Clear, high-resolution, timestamped photographs of the damaged item captured within 24 hours of checkout.',
          '• Itemised Assessment: A detailed written statement for each claimed item, specifying the nature of the destruction and an estimated repair or replacement cost.',
          '4.3 The Legal Depreciation Framework — Wayzyy applies automated depreciation models based on standard Indian Income Tax Act guidelines:',
          '• Electronics & Smart Appliances (TV, AC, Washing Machines, Fridges): 15% per annum.',
          '• Core Furniture Pieces (Beds, Sofas, Dining Tables, Wardrobes): 10% per annum.',
          '• Structural Fixtures (Doors, Windows, Flooring Tiles, Sanitary Fittings): 5% per annum.',
          '• Linen, Curtains, Soft Furnishings (Bedding, Drapes, Mattresses): 20% per annum.',
          '• Consumable Crockery & Glassware: 0% — evaluated at current market replacement cost.',
          '• Assets Under 3 Months Old: 0% — calculated at 100% of the verified invoice price.',
          '4.4 Guest Counter-Evidence and Response Loop — Upon the formal logging of a compliant claim, the Platform issues an immediate notification to the guest, opening a strict 12-hour response window. The guest possesses the legal right to accept the depreciated calculation, dispute the claim by uploading check-in photographs proving pre-existing damage, or dispute the valuation by providing market quotes proving the host\'s replacement cost is artificially inflated. If the guest fails to engage within the 12-hour window, Wayzyy will conclude its review using the host\'s verified evidence alone.',
          '4.5 Neutral Platform Mediation Review — Wayzyy will review the combined evidence pool and issue a final, binding platform decision within 48 hours of the guest response window closing. Our role is strictly limited to fair, documented mediation based on verified data.',
          '4.6 Formal Mediation Claim Outcomes:',
          '• Claim Fully Approved: Guest is officially invoiced for the depreciated value. Clearance is required within 7 days.',
          '• Claim Partially Approved: Invoice is generated only for the verified, depreciated portions supported by evidence.',
          '• Claim Dismissed (Insufficient Evidence): Dismissed due to missing invoices, unverified timestamps, or lack of structural proof.',
          '• Claim Dismissed (Pre-existing Flaw): Guest\'s check-in photos conclusively prove the flaw existed prior to their check-in.',
        ],
      },
      {
        heading: '5. Invoice Issuance, Collection & Legal Assistance Protocols',
        paragraphs: [
          '5.1 Damage Invoice Transparency — Where a damage claim is approved, Wayzyy generates an official digital damage invoice to the guest itemising the original asset cost, the depreciation percentage applied, and the net payable amount. This invoice must be cleared via the platform checkout within 7 days of generation.',
          '5.2 Escalation Matrix for Non-Payment — If a valid damage invoice remains unpaid past 7 days:',
          '• Stage 1 — Platform Sanctions (Days 1–7): Immediate suspension of the guest\'s account across the entire marketplace ecosystem. All future reservations are blocked. Daily automated recovery alerts are activated. A permanent non-payment default marker is embedded into the user\'s internal platform trust profile.',
          '• Stage 2 — Automated Pre-Litigation Warning (Days 8–15): Wayzyy issues a final structural warning notice to the defaulting guest via registered email and SMS, detailing that continued non-compliance will result in immediate forfeiture of contract privacy protections.',
          '• Stage 3 — Host Legal Assistance & Evidentiary Transfer (Day 16+): Wayzyy compiles and delivers a certified "Wayzyy Evidentiary Dossier" to the host or their designated legal counsel, containing the contract-breach audit trail, timestamped photographic logs, automated depreciation receipts, and the necessary verified identity reference markers required to file an accelerated Civil Summary Suit under Order XXXVII of the Code of Civil Procedure, 1908, or issue a formal legal demand notice under the Indian Contract Act, 1872.',
        ],
      },
      {
        heading: '6. Independent Property Insurance Mandate',
        paragraphs: [
          'The damage mediation and legal data compilation provided by Wayzyy is a trust facilitation service and does not substitute for, mimic, or provide property insurance. Hosts are strictly mandated to secure and maintain independent, valid commercial property and fire insurance policies that explicitly permit short-term vacation rental operations.',
        ],
      },
      {
        heading: '7. Safety, Surveillance & Security Standards',
        paragraphs: [
          '7.1 Mandatory Host Safety Thresholds — Hosts must equip and maintain every listed property with the following baseline safety gear:',
          '• Operational, battery-tested smoke detectors across all primary sleeping zones.',
          '• Minimum of one functional, unexpired fire extinguisher in an accessible common area.',
          '• A fully stocked, unexpired medical first aid kit.',
          '• Heavy-duty, secure door locks and window latches on all entry and perimeter points.',
          '• A clearly visible emergency contact card displaying the host\'s number, caretaker details, and local emergency response codes.',
          '7.2 Strict Surveillance Restrictions & Privacy Zones — Hosts must explicitly disclose the presence and exact placement of all outdoor security cameras or decibel monitoring devices prior to a guest booking. Cameras, recording devices, or surveillance equipment of any kind are strictly prohibited inside any indoor zone of the property, including living rooms, kitchens, bedrooms, corridors, and bathrooms. Any discovery of an undisclosed or indoor surveillance device will result in immediate, permanent termination of the host\'s account, forfeiture of all pending payouts, and immediate referral to law enforcement under applicable sections of the IT Act, 2000.',
        ],
      },
      {
        heading: '8. Limitation of Wayzyy\'s Liability',
        paragraphs: [
          'Wayzyy functions strictly as an e-commerce intermediary platform. To the maximum extent permitted under applicable Indian law, Wayzyy\'s total cumulative liability for any property damage, financial loss, or personal injury occurring at a listed property is strictly capped at the net platform service fees collected by Wayzyy for that specific booking transaction.',
          `For all data inputs, evidence uploads, and structural policy inquiries, connect with our centralised team directly: support@wayzyy.com. Effective Date: ${EFFECTIVE_DATE}.`,
        ],
      },
    ],
  },

  'discrimination-inclusion': {
    id: 'discrimination-inclusion',
    title: 'Discrimination & Inclusion Policy',
    subtitle: 'Governed by Indian law · Constitution of India (Arts. 14, 15, 17) · Protection of Civil Rights Act, 1955 · SC/ST (Prevention of Atrocities) Act, 1989 · DPDP Act, 2023 · BNS, 2023',
    sections: [
      {
        paragraphs: [
          'Wayzyy believes that every individual deserves to feel completely welcome, respected, and safe — regardless of their background, identity, or community profile. This Discrimination & Inclusion Policy ("Policy") establishes our absolute commitment to building a transparent, progressive, and genuinely inclusive accommodation marketplace across the Republic of India.',
          'This Policy applies universally to all users of the Wayzyy platform — including guests, property hosts, and event organisers — and governs 100% of interactions across the Platform, including booking requests, listing configurations, instant messaging, user reviews, and profile metadata. This Policy forms an inseparable element of Wayzyy\'s master Terms of Service and Community Guidelines.',
          'Discrimination of any kind constitutes a material breach of your platform contract. Wayzyy implements zero-tolerance monitoring for identity-based exclusion, and verified violations will result in the immediate, permanent termination of platform access.',
        ],
      },
      {
        heading: '1. Our Commitment',
        paragraphs: [
          'Wayzyy explicitly commits to:',
          '• Enforcing this Policy consistently, uniformly, and without exception across all states and booking categories.',
          '• Investigating every formal discrimination complaint with absolute priority, neutrality, and diligence.',
          '• Executing immediate, permanent platform exclusions against any user validated to have engaged in discriminatory conduct.',
          '• Auditing our search recommendation algorithms, profile displays, and user interfaces to identify and neutralise any implicit or structural barriers to inclusion.',
        ],
      },
      {
        heading: '2. Protected Characteristics Under Indian Law',
        paragraphs: [
          'Direct or indirect discrimination based on any of the following personal traits is strictly prohibited on Wayzyy. These categories are protected under this Policy and align with the fundamental guarantees of the Constitution of India:',
          '• Religion: Hindu, Muslim, Christian, Sikh, Buddhist, Jain, Jewish, Parsi, any other community faith, or a complete lack of faith.',
          '• Caste: Scheduled Caste (SC), Scheduled Tribe (ST), Other Backward Classes (OBC), or any localised caste or sub-caste alignment.',
          '• Gender & Identity: Male, female, transgender, non-binary, or any legally recognised gender identity expression.',
          '• Sexual Orientation: Heterosexual, homosexual, bisexual, or any personal orientation.',
          '• Geographic & Linguistic Origin: Indian state of origin, regional identity, permanent address, native dialect, or language group.',
          '• Disability: Physical, mental, neurodivergent, sensory, or intellectual impairment under central disability laws.',
          '• Marital & Relationship Status: Single individuals, married couples, divorced persons, widowed individuals, or unmarried cohabiting couples.',
          '• Age: Subject strictly to Wayzyy\'s mandatory platform safety threshold of 18 years or older for account registration.',
          '• Dietary Choices: Vegetarian, non-vegetarian, vegan, Jain dietary restrictions, or any personal consumption preference.',
          '• Political or Ideological Affiliation: Party alignment, political views, or shared ideological frameworks.',
        ],
      },
      {
        heading: '3. Defining Direct and Indirect Discrimination',
        paragraphs: [
          '3.1 By Property Hosts — A host violates this Policy if they execute any of the following actions based on a protected characteristic:',
          '• Refusing, ignoring, or declining a guest\'s booking request.',
          '• Aborting or cancelling a confirmed reservation after discovering a guest\'s religious background, caste, relationship status, or state of origin.',
          '• Inserting exclusionary restrictions into listing titles, descriptions, house rules, or messaging logs (e.g., stating that specific communities, dietary profiles, or unmarried couples are not permitted).',
          '• Providing an inferior standard of utility, cleanliness, service, or hospitality to an onboarded guest.',
          '• Utilising derogatory, profane, or biased language within the Platform\'s messaging interface.',
          '3.2 By Guests — A guest violates this Policy if they:',
          '• Deploy biased, derogatory, or discriminatory language toward a host or their property staff within chat channels.',
          '• Submit platform reviews containing explicit slurs, defamatory community stereotypes, or identity-focused insults.',
          '• Harass, threaten, or target a host or property caretaker on or off the Platform.',
          '3.3 Indirect and Structural Discrimination — Discrimination does not require explicit text to constitute a violation. Indirect discrimination occurs when an operational rule, house policy, or platform practice disproportionately disadvantages a protected class without a compelling legal or physical safety justification. Any house rule configured to systematically filter out specific demographics under the guise of general preference will be treated as a direct violation of this Policy.',
        ],
      },
      {
        heading: '4. Legitimate Operational Preferences (Non-Discrimination)',
        paragraphs: [
          'The following actions represent valid property management parameters and do not constitute discrimination under this Policy, provided they are applied uniformly to all users:',
          '• Enforcing Wayzyy\'s mandatory platform limit requiring all booking principals to be 18 years of age or older.',
          '• Enforcing guest capacity boundaries based strictly on the property\'s registered occupancy licence from the local tourism department.',
          '• Implementing blanket prohibitions against smoking, loud events, commercial parties, or pets inside the property.',
          '• Declining a reservation request based strictly on a user\'s verified negative platform review history or documented history of property damage.',
          '• Configuring house rules focused on actual structural maintenance, electrical thresholds, or fire safety rules.',
        ],
      },
      {
        heading: '5. Essential India-Specific Operational Safeguards',
        paragraphs: [
          '5.1 Zero-Tolerance Caste Discrimination — Caste-based exclusion is a structural violation of human dignity and a severe criminal offense under the Protection of Civil Rights Act, 1955 and the Scheduled Castes and Scheduled Tribes (Prevention of Atrocities) Act, 1989. Any verified instance of a host refusing service, using caste-focused slurs, or providing inferior utility based on caste will result in an immediate, permanent platform ban on the first offense, and the verified data trail will be routed directly to law enforcement under the Bharatiya Nyaya Sanhita (BNS), 2023.',
          '5.2 Equal Freedom of Religion — No guest may be denied accommodation based on their faith. House rules, host messaging, or pre-booking queries must never use religious background as a filter for acceptance.',
          '5.3 Categorical Protection for Unmarried Couples — Wayzyy explicitly prohibits hosts from refusing a booking request or cancelling an active reservation based on the marital status of the guests. Consenting adult guests holding valid, verified identity profiles are legally entitled to equal access across all listings.',
          '5.4 Clear Dietary Separation Boundaries — Hosts cannot deny an accommodation request based on a guest\'s dietary track (vegetarian, non-vegetarian, or vegan). Hosts retain the valid right to structure clear house rules regarding food preparation operations inside their kitchen — such as prohibiting the cooking of non-vegetarian food on the premises — but cannot use the guest\'s personal consumption choices as a basis to reject their stay.',
          '5.5 Protection Against Regional or Linguistic Profiling — Wayzyy strictly outlaws any discrimination based on a guest\'s state of origin, hometown, native dialect, or language profile. Hosts must provide equal access to travellers from all regions of India.',
        ],
      },
      {
        heading: '6. Monitoring, Investigation Protocols & Enforcement',
        paragraphs: [
          '6.1 DPDP-Compliant Investigation Audits — In accordance with the Digital Personal Data Protection (DPDP) Act, 2023, users acknowledge that when a discrimination complaint is filed, Wayzyy\'s compliance desk is legally authorised to process, audit, and evaluate chat records, listing text history, profile identities, and historical metrics to fulfil our intermediary due diligence mandates and enforce platform safety rules.',
          '6.2 The Enforcement Matrix:',
          '• Caste, Religious, or Core Identity Discrimination: Immediate, permanent termination of the user profile across our entire marketplace on the first offense, followed by an immediate referral to law enforcement where mandated by law.',
          '• Other Behavioural Bias or Infractions: A high-level operational audit triggering immediate temporary suspension of the host\'s listings. Any repeat or un-remedied behaviour will result in a permanent platform ban.',
          '• Impacted Guest Remedy: Where a guest has been subjected to a verified discriminatory cancellation or refusal, Wayzyy will process an immediate 100% refund of all booking balances and guest fees, bypassing standard host cancellation timelines. Our support desk will prioritise assisting the guest in finding an equivalent, safe alternative listing.',
        ],
      },
      {
        heading: '7. Centralized Confidential Reporting Channels',
        paragraphs: [
          'If you encounter or witness discriminatory behaviour, report it instantly via:',
          '• Activating the built-in "Report" indicator directly within the property interface, chat logs, or user dashboard views.',
          '• Submitting a comprehensive log — including relevant screenshots, booking numbers, and chat exports — directly to: support@wayzyy.com.',
          'Wayzyy manages all discrimination investigations under strict parameters of data segregation. The identity of the reporting user will never be revealed to the target of the investigation.',
          `For situations involving active physical danger, users must immediately contact emergency services (Police: 100, Fire: 101, Ambulance: 108) before reporting to the Platform. Effective Date: ${EFFECTIVE_DATE}.`,
        ],
      },
    ],
  },

  'grievance-redressal': {
    id: 'grievance-redressal',
    title: 'Grievance Redressal Policy',
    subtitle: 'Governed by Indian law · IT Act, 2000 · IT (Intermediary Guidelines & Digital Media Ethics Code) Rules, 2021 · Consumer Protection (E-Commerce) Rules, 2020 · DPDP Act, 2023',
    sections: [
      {
        paragraphs: [
          'Wayzyy Technologies Private Limited ("Wayzyy", "we", "us", or "our") is committed to operating an open, transparent, and highly accountable e-commerce marketplace. We recognise that our platform users — including guests, property hosts, and event organisers — must have a clear, reliable, and legally secure channel to voice grievances regarding service deficiencies, transaction disputes, safety infractions, or data privacy concerns.',
          'This Grievance Redressal Policy ("Policy") establishes our formal statutory consumer protection framework, designated officer details, and automated dispute timelines. This Policy forms an integral part of Wayzyy\'s master Terms of Service and must be read alongside the Guest Terms of Service, Host Terms of Service, and Cancellation Policy.',
        ],
      },
      {
        heading: '1. Purpose & Legal Compliance Mandate',
        paragraphs: [
          'This Policy is published in strict conformity with the central regulatory codes of the Republic of India:',
          '• Consumer Protection (E-Commerce) Rules, 2020 (Rule 5(9)): Mandating that every e-commerce marketplace explicitly acknowledge, track, and resolve consumer grievances within defined statutory limits.',
          '• Information Technology (Intermediary Guidelines) Rules, 2021 (Rule 3(2)): Requiring the appointment of a resident Grievance Officer in India to address user-generated content defaults, privacy claims, and account sanctions, preserving our Platform Intermediary Safe Harbor under Section 79 of the IT Act, 2000.',
          '• Digital Personal Data Protection (DPDP) Act, 2023 (Section 13): Securing the right of Data Principals to access an effective grievance redressal mechanism managed by the Data Fiduciary.',
        ],
      },
      {
        heading: '2. Designated Redressal & Data Protection Infrastructure',
        paragraphs: [
          'Wayzyy has consolidated its legal compliance, user support, and data privacy escalation streams into a centralised, singular point of intake to prevent administrative delays.',
          'Wayzyy\'s officially designated Data Protection Officer (DPO) & Grievance Officer under Indian law:',
          '• Name & Title: Anant, Director & Data Protection Officer',
          '• Centralized Compliance Inbox: support@wayzyy.com (communications transmitted to specialised internal aliases like grievance@wayzyy.com or privacy@wayzyy.com route instantly into this primary operational queue)',
          '• Corporate Jurisdiction Address: Wayzyy Technologies Private Limited, Ghaziabad, Uttar Pradesh, India',
          '• Core Corporate Portal: wayzyy.com',
        ],
      },
      {
        heading: '3. Structural Grievance Classification',
        paragraphs: [
          'Users may approach the Grievance Officer to file formal appeals or escalations touching upon the following compliance domains:',
          '• E-Commerce Service Deficiencies: Unresolved payment failures, systemic payout holds, incorrect credit pack billing deductions, or un-executed cancellation refunds.',
          '• Un-remedied Property Disputes: Material listing misrepresentations, un-vetted property safety issues, or unresolved asset damage mediation claims under Level 3 Review rules.',
          '• Interpersonal & Guideline Breaches: Direct reports concerning discriminatory treatment, host or guest harassment, unapproved indoor surveillance gear, or localised curfew violations.',
          '• Digital Personal Data Grievances: Requests to exercise Data Principal rights under the DPDP Act, including summaries of held records, correction of data points, or complete account erasure commands.',
          '• Technology & Account Sanctions: Appeals against automated keyword flags, content moderation actions, or permanent marketplace account deactivations.',
        ],
      },
      {
        heading: '4. Mandatory Statutory Timelines (SLAs)',
        paragraphs: [
          '4.1 Automated Acknowledgment Window — Within 48 Hours. Upon receiving a grievance email at support@wayzyy.com, our system registers a secure compliance ticket and sends an immediate automated response containing a unique Ticket Reference Code, the name and contact coordinates of the Grievance Officer, and an itemised summary of the logged text and a list of requested evidence markers (if any are missing).',
          '4.2 Comprehensive Statutory Disposal Window — Within 15 Days. The Grievance Officer will personally review the documentation, audit the app transaction logs, verify cross-platform communications, and issue a definitive, written resolution response to the complainant within 15 days of the initial intake timestamp.',
          'Exception for Severe Dignity/Privacy Violations: In compliance with Rule 3(2)(b) of the IT Intermediary Guidelines, any grievance alleging the non-consensual publication of intimate imagery, artificial intelligence manipulation (deepfakes), or severe personal privacy breaches will be evaluated immediately, with initial containment actions executed within 24 hours.',
        ],
      },
      {
        heading: '5. Step-by-Step Redressal Filing Procedure',
        paragraphs: [
          'To log a formal grievance requiring review by the compliance officer, users must fulfil the following filing protocols:',
          '1. Exhaust Core Support Tracks First: A grievance represents an escalation. Users must first attempt to resolve issues via standard point-to-point communication (Level 1) or baseline support helpdesks (Level 2) as outlined in the Dispute Resolution Policy.',
          '2. Draft the Formal Escalation: Send an email from your registered Wayzyy user account to support@wayzyy.com with the subject line formatted as: "Formal Grievance Escalation — [Your Booking Reference or Unique Account ID]".',
          '3. Provide Verifiable Metrics: The text body must itemise the exact nature of the unresolved issue or operational default, the complete baseline transaction history or ticket codes from previous Level 2 support logs, high-resolution timestamped photographic files or vendor receipts necessary to analyse the case, and a statement of the specific remedy sought (e.g., wallet credit, profile reinstatement, or data modification).',
        ],
      },
      {
        heading: '6. Neutral Mediation, Record Retention & Evidence Constraints',
        paragraphs: [
          'Evidence-Led Assessment: The Grievance Officer operates as a neutral fact-finder. Determinations are made strictly based on objective data trails, platform-encrypted messaging strings, and verified financial receipts. Subjective or un-evidenced claims will be dismissed.',
          'Secure Compliance Log Preservation: In absolute conformity with CERT-In data directives and intermediate e-commerce mandates, all records, evidence uploads, chat logs, identity reference keys, and final disposal texts linked to a formal grievance are stored securely in encrypted databases for a mandatory timeline of 5 years, irrespective of individual account deletions.',
          'The Identity Lock: To protect user privacy, grievance interactions are treated as confidential. Evidentiary records are never shared across the network, save for packaging the certified Wayzyy Evidentiary Dossier to assist hosts in filing accelerated civil summary recovery suits under our Damage & Security Policy guidelines.',
        ],
      },
      {
        heading: '7. Escalation to Statutory Authorities',
        paragraphs: [
          'Wayzyy\'s internal grievance resolution framework functions as an accelerated, low-cost platform mechanism to settle community friction. It does not function as a court of law or judicial arbitration. If a user is completely unsatisfied with the Grievance Officer\'s final 15-day resolution text, they retain the absolute right to escalate the matter to external statutory authorities:',
          '• Civil Recovery & Contract Claims: Filing an accelerated summary suit under Order XXXVII of the Code of Civil Procedure, 1908 before a civil court to recover outstanding property debts.',
          '• The Data Protection Board of India (DPBI): For complaints regarding personal data tracking, tokenisation compliance, or privacy updates under the DPDP Act, 2023.',
          '• The National Consumer Helpline (NCH): Registering complaints for consumer rights violations under the Consumer Protection Act, 2019 via dialing 1915.',
          '• Public Law Enforcement: For issues involving physical safety, threats, or explicit fraud, filed under relevant provisions of the Bharatiya Nyaya Sanhita (BNS), 2023.',
        ],
      },
      {
        heading: '8. Policy Amendments',
        paragraphs: [
          `Wayzyy reserves the right to modify this Policy to ensure ongoing alignment with judicial updates, Central Government regulations, and data guidelines across India. Material modifications will be accompanied by a 14-day advance notification pushed directly to your registered email handle or app dashboard. Effective Date: ${EFFECTIVE_DATE}.`,
        ],
      },
    ],
  },

  'dispute-resolution': {
    id: 'dispute-resolution',
    title: 'Dispute Resolution Policy',
    subtitle: 'Governed by Indian law · IT Act, 2000 · IT Intermediary Rules, 2021 · Consumer Protection (E-Commerce) Rules, 2020 · Indian Contract Act, 1872 · CPC, 1908 (Order XXXVII) · BNS, 2023',
    sections: [
      {
        paragraphs: [
          'This Dispute Resolution Policy ("Policy") establishes the structured frameworks, mandatory timelines, and administrative protocols through which Wayzyy handles user friction, booking disagreements, and property claims arising between hosts and guests on our Platform.',
          'Wayzyy functions strictly as an e-commerce intermediary. We are not a direct party to any rental contract, transaction, or hosting arrangement entered into between hosts and guests. However, to preserve marketplace safety and prevent fraudulent behaviour, we provide this data-led, neutral internal mediation framework.',
          'This Policy forms an inseparable element of Wayzyy\'s master Terms of Service and must be read alongside the Guest Terms of Service, Host Terms of Service, and Damage & Security Policy.',
        ],
      },
      {
        heading: '1. Categories of Managed Disputes',
        paragraphs: [
          'Wayzyy accepts, logs, and processes evidence for the following specific categories of user disputes:',
          '• Listing Misrepresentation: Claims that the physical accommodation materially deviates from the descriptive text, listed amenities, geotags, or photos displayed on the UI. (Raised by: Guest)',
          '• Property Damage: Claims regarding material destruction, theft, or asset degradation occurring during the reservation hours. (Raised by: Host)',
          '• Cancellation Disagreements: Disputes regarding the execution of host cancellation tiers or refund distributions. (Raised by: Host or Guest)',
          '• Payment & Payout Anomalies: Banking clearance delays, missing payout lines, or suspected transaction gateway discrepancies. (Raised by: Host or Guest)',
          '• Host Check-In Default (No-Show): Property inaccessibility, missing lockbox codes, or complete host unresponsiveness at the hour of check-in. (Raised by: Guest)',
          '• Ecosystem Conduct Violations: Harassment, safety issues, surveillance breaches, or discriminatory acts violating our Community Guidelines. (Raised by: Host or Guest)',
        ],
      },
      {
        heading: '2. The Three-Level Marketplace Escalation Framework',
        paragraphs: [
          'All platform disputes must follow this non-skip tiering sequence. Users must exhaust each level before the Platform authorises escalation to the next.',
          'Level 1 — Direct Peer-to-Point Resolution (0–24 Hours): The aggrieved party must detail their specific concern to the other party inside the in-app chat. Both users possess a maximum of 24 hours to respond and negotiate a mutual compromise. All discussions must remain on the Platform — any agreement or negotiation via off-platform channels (SMS, WhatsApp, voice calls) is completely barred from consideration in subsequent audits. If a compromise is met, both parties tap "Confirm Resolution" inside the dashboard. If the issue remains unresolved past 24 hours, either user may escalate to Level 2.',
          'Level 2 — Centralised Platform Support Mediation (24–72 Hours): Either party can initiate a formal platform intervention request by tapping "Escalate to Wayzyy" within the reservation card or routing an audit request to support@wayzyy.com with the master booking reference code. Stay-related Level 2 disputes must be logged within 72 hours of the checkout timestamp; claims filed after this window are structurally invalid. Wayzyy\'s compliance team will review in-app chat history, listing layout, timestamped photography, and platform history, then issue an administrative determination within 48 hours of compiling all mandatory evidence. If either party presents a valid objection to the Level 2 outcome, they can request a Level 3 review within 7 days.',
          'Level 3 — Final Internal Strategic Review (72 Hours – 7 Days): Level 3 is a definitive internal assessment overseen by a senior Wayzyy compliance lead who had no involvement in the Level 2 determination. Requests must be filed via email to support@wayzyy.com with the subject line: "Level 3 Review Request — [Booking Reference Code]". The appellant must provide clear grounds explaining why the Level 2 decision was factually flawed, accompanied by any un-submitted evidence. Wayzyy\'s Level 3 determination represents our absolute final administrative action regarding platform credentials, escrow allocations, wallet credits, or listing visibilities.',
        ],
      },
      {
        heading: '3. Categorised Dispute Resolution Workflows',
        paragraphs: [
          '3.1 Property Misrepresentation & Estoppel Clause — Guests must inspect the property and file any material misrepresentation claim via support@wayzyy.com within 2 hours of physical check-in, supported by high-resolution, geotagged photographs. If a guest continues to occupy the premises overnight or utilises the amenities past the 2-hour window, they are legally deemed to have accepted the property\'s condition, entirely estopping them from filing retroactive misrepresentation claims. If a violation is validated within the window and the host fails to remedy it immediately, the guest is issued a full refund and the listing is suspended pending mandatory corrections.',
          '3.2 Material Asset Damage & Recovery Assistance — Damage claims follow the automated parameters in the Damage & Security Policy. If a guest refuses to clear a validated damage invoice past 7 days, Wayzyy compiles and delivers an encrypted, certified "Wayzyy Evidentiary Dossier" to the host\'s legal counsel — containing the signed digital contract, tokenised identity verification markers, and checkout photos — allowing the host\'s counsel to launch a Civil Summary Suit under Order XXXVII of the Code of Civil Procedure, 1908.',
          '3.3 Host Checkout/Check-In Defaults — If a property is completely inaccessible or a host is unresponsive at the confirmed check-in hour, the guest must log an urgent alert via support@wayzyy.com. If the host remains entirely unreachable for 1 hour, the system automatically triggers a 100% guest refund (including platform fees), suspends the host\'s account, and adds a ₹500 marketplace credit to the traveller\'s profile.',
          '3.4 Cancellation & Payment Discrepancies — Cancellation disputes are mediated by cross-checking the exact timestamp of the cancellation action against the host\'s active cancellation tier at the time of booking. Retrospective or unilateral changes to house policies are rejected by the system. Payment gateway errors are audited alongside our payment partner (Razorpay) within 48 hours, with validated reversals initiated within 5 business days.',
          '3.5 Severe Guidelines & Conduct Violations — Disputes involving explicit harassment, surveillance breaches, or identity threats bypass standard Level 1 and Level 2 protocols entirely, filtering directly into our highest-priority monitoring queue with a 24-hour resolution SLA. Confirmed infractions result in an immediate permanent ban and direct reporting to state law enforcement under the BNS, 2023.',
        ],
      },
      {
        heading: '4. Strict Evidentiary Standards',
        paragraphs: [
          'Wayzyy operates an evidence-first mediation engine. Submissions must adhere to these compliance parameters:',
          '• Photographic Geotags: Photos must contain unedited, native metadata displaying the exact date, time, and GPS coordinates of the capture. Cropped files are discarded.',
          '• Complete Communication Threads: Chat logs must be submitted as complete, continuous screenshot layouts displaying unmodified context and timestamps.',
          '• Validated Financial Invoices: Damage valuation receipts must originate from a registered, GST-compliant vendor displaying a valid GSTIN or verified corporate identification.',
          '• Data Redirection Ban: All evidence must be funnelled directly into the app dashboard or transmitted via support@wayzyy.com. Evidence delivered via external platforms will be rejected.',
          '• Fabrication Penalty: Manufacturing, modifying, or uploading doctored evidence constitutes automated fraud and will result in an immediate, permanent marketplace ban.',
        ],
      },
      {
        heading: '5. Intermediary Status & Liability Caps',
        paragraphs: [
          'Wayzyy acts strictly as a neutral e-commerce intermediary facilitator. Our internal decisions are driven entirely by the objective evidence metrics submitted by users and the clear contractual guidelines established in our policies.',
          '• Wayzyy\'s internal dispute resolution framework is a technology optimisation asset; it does not substitute for your constitutional and statutory rights to pursue legal recourse before a court of law in India.',
          '• Wayzyy\'s administrative actions are restricted to platform-level variables (e.g., executing payment reversals, withholding settlements, or suspending user credentials).',
          '• To the maximum extent permitted by law, Wayzyy\'s cumulative liability for any dispute-related claim is strictly capped at the net platform service fees collected for that specific booking transaction.',
        ],
      },
      {
        heading: '6. External Legal Recourse Paths',
        paragraphs: [
          'If an issue extends entirely beyond the technical authority of an online marketplace, users retain the absolute independent right to seek external recourse:',
          '• Summary Suits & Civil Remedies: Filing an accelerated summary suit under Order XXXVII of the CPC, 1908 before a civil court to recover unpaid contract debts.',
          '• The RBI Ombudsman: For payment processing errors or gateway loop issues that remain unresolved by the underlying banks.',
          '• The Data Protection Board of India (DPBI): For statutory personal data tracking, storage, or privacy infractions under the DPDP Act, 2023.',
          `• Law Enforcement Authorities: For serious criminal infractions, assault, theft, or explicit fraud, filed under the relevant provisions of the BNS, 2023. Effective Date: ${EFFECTIVE_DATE}.`,
        ],
      },
    ],
  },

  'prohibited-content': {
    id: 'prohibited-content',
    title: 'Prohibited Content & Listings Policy',
    subtitle: 'Governed by Indian law · IT Act, 2000 · IT Intermediary Guidelines Rules, 2021 · Consumer Protection (E-Commerce) Rules, 2020 · DPDP Act, 2023 · BNS, 2023',
    sections: [
      {
        paragraphs: [
          'This Prohibited Content & Listings Policy ("Policy") establishes the mandatory parameters defining what content, property profiles, messaging items, and user actions are strictly prohibited on the Wayzyy platform.',
          'This Policy applies universally to all content submitted, hosted, uploaded, or transmitted across the Platform, including listing metadata, titles, descriptions, photography, customer ratings, instant messaging logs, profile fields, and event configurations. Material breach of this Policy will result in immediate content removal, structural search suppression, temporary account restriction, or a permanent marketplace ban depending on the severity of the infraction. This Policy forms an integral part of Wayzyy\'s master Terms of Service and Community Guidelines.',
        ],
      },
      {
        heading: '1. Prohibited Property Listings',
        paragraphs: [
          '1.1 Properties Devoid of Verified Legal Right — Accommodations published by individuals who do not possess clear, verifiable property title ownership, or formal, legally executed power of attorney/leasing agreements authorising short-term holiday rentals. Property units published without the explicit, documented consent of the underlying deed holders. Rental units bound by master tenancy agreements that explicitly restrict sub-leasing or short-term hospitality use without landlord authorisation.',
          '1.2 Unsafe, Substandard, or Uninhabitable Units — Property structures that fail to deliver basic human habitability standards, including secure structural foundations, functioning indoor plumbing, unexposed electrical circuitry, and potable water access. Accommodations featuring active, known structural or environmental safety hazards that have not been transparently declared to travellers before checkout. Property assets located within government-mandated evacuation thresholds or declared natural disaster sectors.',
          '1.3 Unlawful Operational Units — Properties designed or historically utilised to facilitate illicit operations, including unauthorised narcotics processing, illicit gambling rings, or any criminal activity barred under central or state statutes. Listings deployed with the intent to coordinate, mask, or execute prostitution, forced labour, or human trafficking operations. Accommodations utilised as commercial venues for unlicensed commercial operations or ticketed events violating local zoning laws.',
          '1.4 Materially Misrepresented Accommodations — Listings displaying altered, stock, or out-of-date photography that fails to mirror the actual physical status of the property. Descriptions listing premium utility assets or amenities (such as pool access, high-speed Wi-Fi, or private beach corridors) that do not exist or are completely inaccessible to guests. Listings providing false location coordinates or misrepresenting geographic positions. Duplicate listing assets created for an identical physical space to manipulate search recommendations or distort dynamic pricing tiers.',
        ],
      },
      {
        heading: '2. Prohibited Listing Content & Data Inputs',
        paragraphs: [
          '2.1 Extraneous Contact Information & Platform Evasion Material — Any attempt to insert direct contact coordinates is prohibited. This includes: mobile numbers, WhatsApp strings, or direct communication lines in plain text, hidden spacing, mathematical formulas, or alphabetic code formats; electronic mail strings, domain configurations, or vanity web URLs intended to divert consumer traffic away from Wayzyy; social media handles or messenger profile tags; personal UPI IDs, corporate bank account numbers, or direct financial collection links outside of Wayzyy\'s native integration.',
          '2.2 Offensive, Discriminatory, or Defamatory Material — Text, labels, or captions that manifest bias, discrimination, or systemic exclusion directed at any protected trait under Indian law, including caste profiling, religious background, gender, marital arrangement, or physical disability. Graphic assets or text components that are obscene, sexually explicit, or pornographic. Communications that encourage physical violence, domestic terror, or extremist activity. Text that defames, slanders, or issues malicious, unverified claims against any specific entity, brand, or individual.',
          '2.3 Intellectual Property & Copyright Violations — Imagery, trademark brand logos, or property designs belonging to another corporate entity used without clear, written licensing clearance. Generic stock photography, vendor catalog imagery, or AI-generated interior graphics presented as real, authentic photos of the property.',
        ],
      },
      {
        heading: '3. Prohibited Messaging Interface Conduct',
        paragraphs: [
          'The Platform messaging dashboard is engineered strictly for transaction tracking and secure coordination. The deployment of the following items within the chat interface constitutes a material contract breach:',
          '• Transaction bypass strings, including direct numbers, messaging handles, or hidden communication instructions intended to redirect bookings or payouts off-platform.',
          '• Personal financial coordinates, including point-to-point UPI handles, direct bank details, or external checkout links outside the authorised payment ecosystem.',
          '• Unsolicited promotional broadcasting, automated marketing loops, or system spamming.',
          '• Hostile, abusive, threatening, or explicit text strings directed toward any user or customer support agent.',
          '• Phishing links, malicious URLs, or external applications designed to compromise account security.',
          '• Any message component that violates statutory provisions under the Information Technology Act, 2000 and the Bharatiya Nyaya Sanhita (BNS), 2023.',
        ],
      },
      {
        heading: '4. Prohibited User Account Profile Content',
        paragraphs: [
          'The following data inputs are prohibited within both Host and Guest profile layouts:',
          '• Fabricated naming records or deceptive aliases. Your public profile metadata must align precisely with the tamper-proof identity token validated at account setup under the Information Technology Act, 2000.',
          '• Profile pictures deploying stock material, digital cartoon avatars, brand logos, or corporate imagery instead of an authentic portrait of the verified account holder.',
          '• Communication links or direct phone strings embedded within personal bio summaries.',
        ],
      },
      {
        heading: '5. Prohibited Review and Rating Content',
        paragraphs: [
          'To protect the integrity of our feedback loop, user reviews will be instantly deleted if they contain:',
          '• Feedback logs that do not derive from a genuine, verified, first-hand stay or transactional hosting event on Wayzyy.',
          '• Reviews manufactured or structured in direct exchange for fiscal incentives, off-platform discounts, or structural room upgrades.',
          '• Retaliatory logs deployed with the explicit intent to inflict commercial or reputation damage rather than provide objective information.',
          '• Logs publishing confidential user details, real-world work addresses, or private check-in communications.',
        ],
      },
      {
        heading: '6. Automated Detection, Content Moderation & Action Timelines',
        paragraphs: [
          'Wayzyy deploys real-time pattern-recognition filters integrated with human administrative audits to monitor listings, public fields, and chat streams.',
          'Action Matrix:',
          '• Low Severity (Minor policy mismatch, e.g., duplicate listing text or accidental stock images): Target item is deleted; user is issued a compliance reminder. Processed within 48 Hours.',
          '• Medium Severity (Repeated violations, intentional contact sharing, deliberate platform bypass): Content is removed; user profile is placed on temporary suspension pending audit. Processed within 24 Hours.',
          '• High Severity / Statutory Breach (Illegal activities, undisclosed indoor surveillance, deepfakes, non-consensual content, or hate speech): Content is purged; profile is banned; law enforcement is notified. Executed Immediately.',
          'When content is modified or deactivated, Wayzyy issues an electronic audit notification to the user detailing the grounds for removal. Wayzyy retains the structural right to execute unannounced content reviews to protect digital evidence from being altered or erased during fraud investigations.',
        ],
      },
      {
        heading: '7. Administrative Appeals Framework',
        paragraphs: [
          'If a user maintains that an item was deleted or an account sanction was triggered due to a systemic data error, they possess the structural right to initiate an administrative appeal within 14 days of the action timestamp by sending an evidentiary review request to support@wayzyy.com. Wayzyy will issue a final decision within 7 business days.',
          `This appeal framework is completely unavailable for confirmed High Severity / Statutory Breaches. Effective Date: ${EFFECTIVE_DATE}.`,
        ],
      },
    ],
  },

  'review-rating': {
    id: 'review-rating',
    title: 'Review & Rating Policy',
    subtitle: 'Governed by Indian law · Consumer Protection (E-Commerce) Rules, 2020 · IT Act, 2000 · IT (Intermediary Guidelines) Rules, 2021 · DPDP Act, 2023',
    sections: [
      {
        paragraphs: [
          'Reviews and ratings constitute the absolute foundation of organic trust on the Wayzyy platform. They allow guests to make highly informed booking decisions and empower hosts to build an uncompromised commercial reputation based on performance.',
          'Wayzyy is committed to keeping all community feedback transparent, authentic, and symmetric. In strict compliance with Indian e-commerce mandates, we never manipulate, manufacture, or arbitrarily suppress ratings, and we never remove a review simply because a user objects to its critical text. This Policy forms an integral part of Wayzyy\'s master Terms of Service and Community Guidelines.',
        ],
      },
      {
        heading: '1. Who Can Leave a Review',
        paragraphs: [
          'To prevent manufactured ratings and spam, all review options on Wayzyy are strictly gated by actual, verified completed transactions:',
          '• Guests: May leave an itemised review of a host and property only after a confirmed booking has cleared a successful check-in.',
          '• Hosts: May leave a behavioural review of a guest only after the booking has reached a completed checkout.',
          '• Cancelled Bookings: Neither party is permitted to leave a review or score for a reservation that was cancelled prior to physical check-in.',
          '• Symmetric Allocation: Each confirmed stay generates exactly one immutable review opportunity per side (one guest review and one host review per stay).',
        ],
      },
      {
        heading: '2. The Double-Blind Review Window',
        paragraphs: [
          'Both guests and hosts possess a strict 14-day window following checkout to submit their respective review and category scores. Upon the expiration of this 14-day timeline, the review option for that booking transaction closes permanently.',
          'Wayzyy operates an automated double-blind review system. Neither party can view the other\'s submitted review until both parties have completed their submissions, or until the 14-day window expires — whichever occurs first. This framework completely eliminates retaliatory review behaviours, ensuring that both hosts and guests can log honest, transparent feedback without fear of external influence or transactional pressure.',
        ],
      },
      {
        heading: '3. The Multi-Category Rating Architecture',
        paragraphs: [
          '3.1 Guest Rating of Host and Property — Guests evaluate their stay experience across six distinct operational parameters, each scored independently from 1 to 5 stars:',
          '• Cleanliness: The physical sanitisation, hygiene, and maintenance status of the property upon arrival.',
          '• Accuracy: The factual alignment between the physical property and the Platform listing description, photography, and stated amenities.',
          '• Check-in: The operational speed, accessibility, and ease of the check-in process.',
          '• Communication: The professional responsiveness and helpfulness of the host before and during the stay.',
          '• Location: The precise accuracy, safety profiling, and accessibility of the property\'s real-world location pin.',
          '• Value: Whether the overall utility, comfort, and hospitality matched the financial price paid at checkout.',
          'The property\'s master rating is automatically computed as an unweighted average of these six category scores and displayed prominently across all search indexes.',
          '3.2 Host Rating of Guest — Hosts evaluate guest behaviour across three specific compliance parameters scored from 1 to 5 stars: Cleanliness (how well the guest maintained basic hygiene and condition of the premises), Communication (responsiveness, clarity, and courtesy of the guest), and House Rules (the guest\'s adherence to the property\'s disclosed house guidelines, guest caps, and curfews).',
          '3.3 Rating Display Restrictions — Property Master Score is displayed publicly on listing cards, search results, and the property\'s primary details page. Guest Behavioural Score is displayed exclusively to hosts when reviewing an inbound, non-instant booking request. A minimum of 3 completed reviews is mandatory before a property\'s numerical rating is displayed; listings below this volume are marked transparently as "New".',
        ],
      },
      {
        heading: '4. Review Content Standards',
        paragraphs: [
          '4.1 Permitted Content — A constructive review must be based on first-hand experience, contain objective and specific factual details, remain ecosystem-relevant (focused on the hospitality, property, or hosting behaviour), and be drafted with appropriate decorum.',
          '4.2 Prohibited Review Content & Extortion Vectors — Wayzyy will instantly delete content that contains:',
          '• Review Extortion and Coercion: Any attempt to use the review system as a financial threat or tool for leverage, including a guest threatening a negative review to extract unapproved refunds, or a host withholding a positive review to coerce a waiver on a valid damage claim.',
          '• Commercial Manipulation: Reviews written in exchange for direct cash payments, future booking discounts, platform credits, or off-platform incentives.',
          '• Statutory Identity Violations: Text containing profane, derogatory, or biased slurs touching on caste, religion, gender, or state of origin.',
          '• Malicious Defamation: Knowingly false, inaccurate, or slanderous factual assertions targeting an individual or registered entity.',
          '• Privacy Breaches: The unauthorised publication of private phone strings, personal email addresses, or un-pixelated personal photography.',
        ],
      },
      {
        heading: '5. Wayzyy\'s Core Review Management Principles',
        paragraphs: [
          'In absolute compliance with the Consumer Protection (E-Commerce) Rules, 2020, Wayzyy guarantees complete neutrality over user reviews:',
          '• Zero Content Modification: Wayzyy entirely rejects editorial manipulation. We never rewrite, edit, or partially redact words within a review. An entry is either approved in its complete original form or entirely purged if it breaks policy guidelines.',
          '• Symmetric Neutrality: Wayzyy will never remove a critical review simply because a host objects to its contents or claims it is commercially damaging.',
          '• Anti-Bribery Frameworks: Wayzyy completely prohibits any commercial settlement, platform fee payment, or advertising adjustment in exchange for removing or inflating an authentic review.',
        ],
      },
      {
        heading: '6. Public Response Integration',
        paragraphs: [
          '6.1 Host Responses to Guest Reviews — Hosts retain the right to submit a public, single-level text response to any guest review within 14 days of its publication. The response renders directly below the traveller\'s feedback on the property page. Responses must comply strictly with the content standards of Section 4.2.',
          '6.2 Guest Responses to Host Reviews — Guests may post a public response to a host\'s behavioural review within 14 days of publication. This response renders on the guest\'s trust profile and is visible to future hosts evaluating their booking requests.',
        ],
      },
      {
        heading: '7. Review Disputes, Moderation & Removal Requests',
        paragraphs: [
          'Wayzyy will authorise the removal of a review only if definitive data proves that the entry did not derive from an authorised user who successfully executed a check-in at that property, directly violates the specific content prohibitions outlined in Section 4.2 (such as proven review extortion or containing private contact information), is verified by system logs to be part of a coordinated, inorganic, fake review campaign, or is subject to an explicit, valid enforcement order issued by a court of competent jurisdiction in India.',
          'To request a review audit, click the built-in "Report Review" asset or send an analysis request directly to support@wayzyy.com. In strict compliance with the IT (Intermediary Guidelines) Rules, 2021, any content report touching on defamation, safety, or privacy will be acknowledged within 48 hours and settled transparently within the statutory timelines.',
        ],
      },
      {
        heading: '8. Impact of Ratings on Search and Platform Access',
        paragraphs: [
          '8.1 Organic Search Placement Logic — Wayzyy\'s search recommendation engine uses property ratings as a primary metric for organic search ranking. Wayzyy completely prohibits the sale of search placement rankings; indexing metrics are driven strictly by rating health, review count volumes, host response times, and booking completion rates.',
          '8.2 System Sanctions for Low Ratings (minimum threshold: 5 reviews):',
          '• 4.0 Stars and Above: Flawless Standing; standard operational search performance.',
          '• 3.0 to 3.9 Stars: Automated System Warning issued to host; listing experiences an automatic drop in organic search placement.',
          '• Below 3.0 Stars: Immediate Listing Suspension. The property is deactivated from active search results pending a mandatory compliance review.',
          '• Persistent Low Default: Permanent deactivation and removal of the host listing from the Wayzyy marketplace network.',
        ],
      },
      {
        heading: '9. The Wayzyy Verified Badge',
        paragraphs: [
          'The Wayzyy Verified Badge is an exclusive, objective documentation and compliance mark awarded to property listings that successfully pass our regulatory screening framework. It confirms that Wayzyy\'s digital systems have successfully verified the host\'s identity, confirmed the property\'s state tourism board registration number, cross-checked listing metadata against automated geotags, and logged the host\'s safety data.',
          'Qualifying parameters to earn the badge: host identity verified via encrypted KYC channels, valid state tourism department registration confirmed, documented proof of property ownership or authorised leasing tenancy verified, listing photos matching automated location data, and host declaration confirming active deployment of baseline safety gear (smoke detectors, fire extinguishers, first aid kit).',
          `The badge will be instantly stripped if the underlying state tourism board registration number expires or is flagged as invalid, confirmed guest reviews establish that the property's physical features materially deviate from the listing description, or Wayzyy discovers any document submitted during onboarding was fraudulent or expired. Effective Date: ${EFFECTIVE_DATE}.`,
        ],
      },
    ],
  },

  'trust-safety': {
    id: 'trust-safety',
    title: 'Trust & Safety Policy',
    subtitle: 'Governed by Indian law · IT Act, 2000 · IT Intermediary Rules, 2021 · Consumer Protection (E-Commerce) Rules, 2020 · DPDP Act, 2023 · CERT-In Security Directives · BNS, 2023',
    sections: [
      {
        paragraphs: [
          'Trust, transparency, and physical safety are not isolated software features at Wayzyy — they constitute the core engineering foundation of our entire marketplace. This Trust & Safety Policy ("Policy") establishes the comprehensive structural mechanisms through which Wayzyy manages the verification, communication safety, fraud mitigation, and operational integrity of our community.',
          'This Policy applies universally to all users of the Platform — including guests, property hosts, and event coordinators — and forms an inseparable element of Wayzyy\'s master Terms of Service and Community Guidelines.',
        ],
      },
      {
        heading: '1. Our Structural Trust Architecture',
        paragraphs: [
          'Wayzyy\'s trust engine operates via four interconnected verification layers:',
          '• Secure Identity Verification: Validates that every user is a real, legally traceable individual prior to unlocking booking or listing creation rights. Mandatory, automated, and tamper-proof.',
          '• Property Compliance Verification: Validates that every uploaded rental unit holds active state tourism board registration credentials. Unlocks the "Wayzyy Verified" mark; no unverified listings permitted.',
          '• Communication Pattern Monitoring: Scans in-app chat systems to block transaction bypass attempts, off-platform payment leakage, and hostile content. Pattern-recognition technology fine-tuned to capture Indian alpha-numeric evasion and Hinglish variations.',
          '• Civil Accountability Frameworks: Anchors all platform contracts to verified identities, enabling accelerated legal recovery paths for property destruction or fraud via certified digital dossiers.',
        ],
      },
      {
        heading: '2. Comprehensive Identity Verification Protocols',
        paragraphs: [
          '2.1 Mandatory Residential Identity Check — Every resident user registering as a host or traveller on Wayzyy must successfully pass a digital identity check before they can publish an accommodation profile or checkout a booking request. This baseline security protocol is automated and cannot be bypassed. This framework achieves four structural safety milestones: conclusively validates the account belongs to a real individual, eliminating bots and duplicate ghost accounts; establishes a verified electronic footprint under the IT Act, 2000, rendering all booking obligations legally binding; cryptographically hashes identity tokens to prevent permanently banned users from registering under modified aliases; and enables clear, non-repudiable civil recovery assistance for property damage or financial fraud under the Indian Contract Act, 1872.',
          '2.2 Alternative Verification for Non-Resident Foreign Nationals — Foreign nationals must upload a valid, high-resolution scan of their international Passport, current Indian Visa page, or OCI credentials. These records are matched via image-processing verification prior to booking confirmation. Onboarded hosts are supplied with the verified passport data required to file mandatory Form C registrations with the FRRO within the statutory timelines.',
        ],
      },
      {
        heading: '3. Communication Safeguards & Evasion Interception',
        paragraphs: [
          '3.1 Algorithmic Chat Analysis — Wayzyy\'s messaging interface uses advanced pattern-recognition filters to analyse text blocks for platform bypass indicators. Our algorithms are fine-tuned to capture specific Indian communication evasion patterns, including:',
          '• Alpha-Numeric Digit Substitution: Disguising numbers via letter combinations or mixed word-digit typing (e.g., "thr33", "nine88").',
          '• Multi-Message Structural Splitting: Breaking contact handles or mobile strings across separate successive messages.',
          '• Direct Handle Infiltration: Embedding personal UPI addresses, private banking codes, or external payment links.',
          '• Social Redirection Handles: Pushing usernames for external messaging apps to pull the consumer off-platform.',
          '• Mixed Linguistic Scripting: Utilising Hinglish, Devanagari phrasings, or regional idioms to hide bypass intents.',
          '3.2 Tiered Action Thresholds via Confidence Scoring:',
          '• Score 0.0–0.4 (Verified Clean): Message delivers immediately; zero operational intervention.',
          '• Score 0.4–0.7 (Low-Level Suspicious): Message delivers normally; system logs metrics to internal compliance queue for passive review.',
          '• Score 0.7–0.9 (High-Risk Indicators): Message delivers, but the system injects a bold warning banner into the chat window for both users, explaining that bypassing the platform voids cancellation refunds, data protection, and damage mediation.',
          '• Score 0.9–1.0 (Confirmed Platform Leakage): Message is blocked and undelivered. Both users receive an immediate warning notice, and the account is routed to our compliance desk for a formal trust audit within 24 hours.',
          '3.3 Transparent Enforcement — Wayzyy rejects silent message suppression. When an item is blocked, the platform clearly explains why the content broke guidelines and outlines the explicit safety coverages the user loses by attempting off-platform transactions.',
        ],
      },
      {
        heading: '4. Marketplace Fraud Mitigation',
        paragraphs: [
          '4.1 Deactivation of Fake Listings — Wayzyy eliminates ghost properties by making local tourism registration numbers a mandatory onboarding field. These registration entries are cross-checked against official databases, and listing images are analysed for duplicate catalog matches or stock photography. Suspicious profiles are hidden from search indexes within 24 hours pending data proof from the host.',
          '4.2 Financial Fraud Infrastructure — All monetary flows move through an integrated, PCI-DSS compliant payment gateway switch. Wayzyy never records or stores raw card data or net banking codes on its internal servers. Our risk architecture flags erratic checkout movements, including high-frequency transaction failures, rapid multi-booking anomalies, or suspicious chargeback habits.',
          '4.3 Defences Against Account Takeovers — Account integrity is defended via mandatory OTP verification for all new device sessions or location updates, real-time notification flags for structural changes to banking details or profile passwords, and automated account locking if the interface registers sequential failed authentication inputs.',
        ],
      },
      {
        heading: '5. Guest Safety Protocols',
        paragraphs: [
          '5.1 Pre-Booking Due Diligence — The Platform empowers travellers by prominently rendering the orange "Wayzyy Verified" badge on listings that have cleared regulatory screening, displaying the host\'s verified account status and localised response rates, and presenting unaltered, double-blind guest reviews completely free from host manipulation.',
          '5.2 Emergency In-App Response — For events involving active fires, medical emergencies, or physical safety threats, users must dial local emergency networks immediately (Police: 100, Fire: 101, Ambulance: 108) before alerting the platform. For non-emergency safety concerns during a stay, guests can activate the priority support link inside the app. Validated safety crises will result in an immediate reservation cancellation, a full platform refund, and dedicated assistance in securing alternative lodging.',
          '5.3 Undisclosed Surveillance and Private Space Violations — Wayzyy maintains an absolute zero-tolerance policy regarding hidden cameras or recording equipment inside private indoor zones (bedrooms, living areas, or bathrooms). If a guest discovers an undisclosed camera, they must exit the property immediately and report it via support@wayzyy.com. Wayzyy will issue a 100% refund, enforce a permanent platform ban on the host on the first offense, and route the dossier to law enforcement under the BNS, 2023 and the IT Act, 2000.',
        ],
      },
      {
        heading: '6. Host Safety and Payout Insulation',
        paragraphs: [
          '6.1 Pre-Acceptance Risk Profiling — Wayzyy protects hosts before they open their doors by displaying the guest\'s verified account status, past behavioural reviews, and historical damage metrics on every inbound, non-instant reservation request.',
          '6.2 Financial and Damage Protection:',
          '• Escrow Payout Protection: Guest funds are successfully cleared and held within our secure banking partner\'s escrow framework before check-in is authorised, ensuring hosts are guaranteed payment for confirmed, compliant stays.',
          '• The Legal Assistance Dossier: If a guest causes property damage and refuses to clear the depreciated invoice past 7 days, Wayzyy packages a certified digital "Wayzyy Evidentiary Dossier" (contract trails, timestamped photos, and identity markers) and hands it to the host\'s counsel to launch an accelerated Civil Summary Suit under Order XXXVII of the CPC, 1908.',
        ],
      },
      {
        heading: '7. Statutory Law Enforcement Cooperation',
        paragraphs: [
          'Wayzyy operates in complete compliance with its legal intermediary obligations under Section 79 of the IT Act, 2000. We will respond to valid notices, data requests, or disclosure warrants issued by authorised law enforcement agencies or courts within the mandated timelines.',
          'In strict accordance with CERT-In directives and IT Intermediary Rules, Wayzyy maintains secure, encrypted logs of all user transactions, system connections, and account access points for a mandatory period of 5 years. Law enforcement communications must be delivered via an official channel to support@wayzyy.com.',
        ],
      },
      {
        heading: '8. Quarterly Optimisation & Transparency Commitment',
        paragraphs: [
          'Wayzyy treats safety as an evolving engineering discipline. We formally commit to reviewing and updating our text-detection filters and fraud risk models quarterly to stay ahead of new evasion tactics, publishing an annual corporate Transparency Report detailing data enforcement actions, block rates, and platform safety statistics, and training our customer support team members on advanced dispute management and Indian privacy guidelines.',
          `Effective Date: ${EFFECTIVE_DATE}.`,
        ],
      },
    ],
  },
  'property-import': {
    id: 'property-import',
    title: 'Property Listing & Import Verification Policy',
    subtitle: 'Governed by Indian Law · Digital Personal Data Protection Act, 2023 · IT Intermediary Rules, 2021 · Consumer Protection Rules, 2020',
    sections: [
      {
        paragraphs: [
          'This Property Listing & Import Verification Policy ("Policy") details the regulatory, technological, and procedural standards enforced by Wayzyy regarding property listing imports, identity verification, direct host pricing, and review integrity.',
          'To ensure absolute transparency and guest trust, Wayzyy provides automated listing import tools for hosts transitioning from third-party platforms (e.g. Airbnb, Booking.com). By using our listing import features or maintaining an active property listing on Wayzyy, hosts agree to adhere strictly to the terms of this Policy.',
        ],
      },
      {
        heading: '1. Prohibition of Third-Party Review & Rating Scraping',
        paragraphs: [
          '• Zero External Scraping: Wayzyy explicitly prohibits importing, scraping, or transferring guest reviews, star ratings, or host badges from third-party travel platforms.',
          '• Platform Authenticity: Every guest review published on Wayzyy represents an authentic, verified stay completed through our platform.',
          '• Trust Assurance: Guests booking on Wayzyy can rest assured that all displayed reviews reflect real experience on our network, uninfluenced by external platform algorithms or transferred testimonials.',
        ],
      },
      {
        heading: '2. Exclusion of Third-Party Dynamic Pricing & Direct Host Pricing',
        paragraphs: [
          '• Elimination of External Dynamic Pricing: Third-party platform dynamic pricing matrices, algorithmic surge multipliers, and hidden service fee inflations are completely excluded upon import.',
          '• Direct Host Pricing Mandate: Hosts are required to explicitly enter their own competitive nightly base rate and weekend rate during property review.',
          '• Transparency Guarantee: Prices displayed on Wayzyy represent the host\'s true direct rate without non-transparent third-party markups.',
        ],
      },
      {
        heading: '3. Host Authorization & Listing Ownership Declaration',
        paragraphs: [
          '• Host Consent Requirement: Property listing imports may only be initiated by the authorized property owner, manager, or designated representative.',
          '• Ownership Representation: Initiating an import constitutes a legal declaration that the host holds full legal rights to list, lease, and represent the property images and information.',
          '• Fraud Prevention: Any unauthorized attempt to import listings without host approval will result in immediate listing deactivation and permanent account blacklisting.',
        ],
      },
      {
        heading: '4. Mandatory Manual Verification & Approval Workflow',
        paragraphs: [
          '• Pending Review Status: All imported or newly created listings are initially flagged with a "Pending Review" status.',
          '• Human Quality Audit: Wayzyy\'s operations team performs a manual review of property photos, geo-location accuracy, amenity accuracy, and host identity verification.',
          '• Approval Timeline: Listings undergo verification within 2 to 24 hours. Once verified, the listing transitions to "Active" status and becomes discoverable by travellers.',
        ],
      },
      {
        heading: '5. Host Identity Verification Options',
        paragraphs: [
          '• Manual ID Verification: Hosts can complete manual verification by submitting official government-issued ID (Aadhaar, PAN, or Passport) alongside a live selfie.',
          '• Encrypted Data Protection: Submitted identity verification documents are encrypted and stored securely in compliance with the Digital Personal Data Protection Act, 2023.',
          '• Verification Badge: Successfully verified hosts receive a public "Verified Host" trust badge on their listings.',
        ],
      },
    ],
  },
};

// Table of contents for the /policies hub page, grouped like the mobile app's
// Terms of Service screen. Existing docs with dedicated static pages/routes
// point there; the rest resolve to /policies/:docId via LEGAL_DOCS above.
export interface PolicyLink {
  title: string;
  href: string;
}

export const POLICY_TOC: { heading: string; links: PolicyLink[] }[] = [
  {
    heading: 'Core Agreements',
    links: [
      { title: 'Guest Terms of Service', href: '/guest-terms' },
      { title: 'Host Terms of Service', href: '/host-terms' },
    ],
  },
  {
    heading: 'Bookings & Payments',
    links: [
      { title: 'Cancellation Policy', href: '/policies/cancellation' },
      { title: 'Payment & Refund Policy', href: '/payment-refund' },
    ],
  },
  {
    heading: 'Safety & Standards',
    links: [
      { title: 'Community Guidelines', href: '/policies/community-guidelines' },
      { title: 'Damage & Security Policy', href: '/policies/damage-security' },
      { title: 'Discrimination & Inclusion Policy', href: '/policies/discrimination-inclusion' },
      { title: 'Prohibited Content & Listings Policy', href: '/policies/prohibited-content' },
      { title: 'Property Listing & Import Policy', href: '/policies/property-import' },
      { title: 'Review & Rating Policy', href: '/policies/review-rating' },
      { title: 'Trust & Safety Policy', href: '/policies/trust-safety' },
    ],
  },
  {
    heading: 'Legal & Compliance',
    links: [
      { title: 'Dispute Resolution Policy', href: '/policies/dispute-resolution' },
      { title: 'Grievance Redressal Policy', href: '/policies/grievance-redressal' },
    ],
  },
];
