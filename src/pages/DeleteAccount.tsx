import { PolicyLayout } from "@/components/PolicyLayout";
import { SEO } from "@/components/SEO";

export default function DeleteAccount() {
  return (
    <SEO
      title="Delete Your Account - Wayzyy"
      description="How to request deletion of your Wayzyy account and associated data."
      path="/delete-account"
    >
      <PolicyLayout
        title="Delete Your Wayzyy Account"
        subtitle="Request account and data deletion"
        effectiveDate="Last updated: September 2026"
      >
        <h2>How to request deletion</h2>
        <p>
          To permanently delete your Wayzyy account, email{" "}
          <a href="mailto:support@wayzyy.com">support@wayzyy.com</a> from the
          email address associated with your account, with the subject line
          "Delete my account". Include your registered phone number so we can
          verify your identity before processing the request.
        </p>
        <p>
          We process deletion requests within 7 business days of verifying
          your identity.
        </p>

        <h2>What gets deleted</h2>
        <ul>
          <li>Your profile (name, email, phone, photos)</li>
          <li>Your account credentials and login access</li>
          <li>Your wishlists and saved properties</li>
          <li>Your messages and conversation threads</li>
        </ul>

        <h2>What we retain, and for how long</h2>
        <p>
          Some data cannot be deleted immediately even on request, for legal
          and financial-record-keeping reasons:
        </p>
        <ul>
          <li>
            <strong>Booking and payment records</strong> are retained for 8
            years as required under India's Income Tax Act and applicable
            financial regulations, even after account deletion.
          </li>
          <li>
            <strong>Identity verification records</strong> (where submitted)
            are retained as required under UIDAI/KYC guidelines for the
            statutory period, after which they are permanently erased.
          </li>
          <li>
            <strong>Reviews you've written</strong> remain visible
            (de-identified from your account) since they reflect a real stay
            and are relied on by other guests and hosts.
          </li>
        </ul>
        <p>
          If you are a host with upcoming or in-progress bookings, those must
          be completed or cancelled before your account and listings can be
          deleted.
        </p>

        <h2>Questions</h2>
        <p>
          Contact <a href="mailto:privacy@wayzyy.com">privacy@wayzyy.com</a>{" "}
          with any questions about this process.
        </p>
      </PolicyLayout>
    </SEO>
  );
}
