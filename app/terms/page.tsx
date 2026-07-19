import Link from "next/link";
import "./Terms.css";

export const metadata = {
  title: "Terms of Service & Disclaimer | Eicto Download Manager",
  description: "Terms of Service, Legal Disclaimer, and Usage Policy for Eicto Download Manager.",
};

export default function TermsPage() {
  return (
    <main className="terms-page">
      <div className="terms-container glass-panel">
        <h1 className="terms-title">Terms of Service & Legal Disclaimer</h1>
        <p className="terms-last-updated">Last Updated: July 19, 2026</p>

        <section className="terms-section">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using Eicto Download Manager ("Eicto", "the Software"), you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use the Software.
          </p>
        </section>

        <section className="terms-section">
          <h2>2. Intended Use and Copyright Policy</h2>
          <p>
            Eicto Download Manager is developed and provided strictly as a general network utility for personal use. The Software is designed to download publicly accessible files, non-copyrighted material, public domain content, and videos to which you own the rights.
          </p>
          <div className="warning-box">
            <strong>Important Disclaimer:</strong> Eicto Download Manager does not endorse, encourage, or support copyright infringement or the unauthorized downloading of protected media. The user assumes full responsibility for ensuring they have the legal right to download any file using our Software.
          </div>
        </section>

        <section className="terms-section">
          <h2>3. Prohibited Activities</h2>
          <p>When using Eicto Download Manager, you agree not to:</p>
          <ul>
            <li>Download any copyrighted material without explicit permission from the copyright owner.</li>
            <li>Use the Software for any commercial purpose involving the redistribution of downloaded media.</li>
            <li>Attempt to bypass Digital Rights Management (DRM) or other access control technologies.</li>
            <li>Use the Software in a manner that violates local, national, or international laws.</li>
          </ul>
        </section>

        <section className="terms-section">
          <h2>4. No Warranties</h2>
          <p>
            The Software is provided "AS IS" and without warranties of any kind. We do not guarantee that the Software will function uninterrupted, be error-free, or be able to download media from every website, as third-party platform policies and technologies change frequently.
          </p>
        </section>

        <section className="terms-section">
          <h2>5. Limitation of Liability</h2>
          <p>
            In no event shall the developers, contributors, or owners of Eicto Download Manager be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use the Software, including legal consequences resulting from unauthorized downloads.
          </p>
        </section>

        <section className="terms-section">
          <h2>6. Third-Party Platforms & Technologies</h2>
          <p>
            Eicto Download Manager acts purely as a data-fetching utility. We do not host, store, or stream any third-party content on our servers. When you use Eicto to download files (including but not limited to DRM-protected content or encrypted media), the connection is made directly between your local machine and the third-party server. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services.
          </p>
        </section>

        <section className="terms-section">
          <h2>7. Licensing & Premium Features</h2>
          <p>
            While Eicto Download Manager may currently be offered for free, the developers reserve the right to introduce commercial licensing, premium tiers, or paid subscriptions in the future. Your continued use of the Software implies acceptance of the licensing terms in effect at the time of use.
          </p>
        </section>

        <div className="terms-footer">
          <Link href="/" className="btn btn-primary">Return to Home</Link>
        </div>
      </div>
    </main>
  );
}
