import React from 'react';

export default function PrivacyPage(): React.JSX.Element {
  return (
    <article className="shell v2-page" style={{ paddingBlock: 'clamp(48px, 8vw, 96px)', maxWidth: '960px' }}>
      <header style={{ marginBottom: 'clamp(36px, 6vw, 64px)', borderBottom: '1px solid rgba(23, 23, 23, 0.15)', paddingBottom: '32px' }}>
        <p className="eyebrow" style={{ letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: '12px', color: 'var(--stone, #78716c)', marginBottom: '16px' }}>
          DYNASTY WORKS STUDIO / TRUST &amp; DATA GOVERNANCE
        </p>
        <h1 style={{ fontFamily: 'Editorial New, Bodoni MT, Didot, "Times New Roman", serif', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 400, lineHeight: 1.1, margin: '0 0 20px' }}>
          Privacy Notice
        </h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', fontSize: '14px', color: 'var(--stone, #78716c)' }}>
          <span>Last updated: September 2026</span>
          <span>·</span>
          <span>Dynasty Works Studio LLC</span>
          <span>·</span>
          <span>Advisory &amp; Venture Creation</span>
        </div>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', fontSize: '16px', lineHeight: 1.7, color: 'var(--ink, #171717)' }}>
        <section>
          <h2 style={{ fontFamily: 'Editorial New, Bodoni MT, Didot, "Times New Roman", serif', fontSize: '1.75rem', fontWeight: 400, margin: '0 0 16px' }}>
            01 / Principles &amp; Scope
          </h2>
          <p style={{ margin: '0 0 16px' }}>
            Dynasty Works Studio LLC (&ldquo;Dynasty Works Studio,&rdquo; &ldquo;DWS,&rdquo; &ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) operates an independent company creation studio partnering with founders from initial concept to commercial market readiness.
          </p>
          <p style={{ margin: 0 }}>
            This Privacy Notice discloses how we collect, handle, store, and protect information submitted to us through <strong>dynastyworksstudio.com</strong>, including our interactive Company Builder diagnostic, Founder Blueprint intake, Contact Studio inquiry forms, and confidential founder asset uploads. We do not monetize, rent, broker, or sell founder information or intellectual property under any circumstance.
          </p>
        </section>

        <section>
          <h2 style={{ fontFamily: 'Editorial New, Bodoni MT, Didot, "Times New Roman", serif', fontSize: '1.75rem', fontWeight: 400, margin: '0 0 16px' }}>
            02 / Information We Collect
          </h2>
          <p style={{ margin: '0 0 16px' }}>
            When founders interact with our digital instruments or submit strategic briefs to the studio, we collect only the information voluntarily provided:
          </p>
          <ul style={{ margin: '0 0 16px', paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li>
              <strong>Founder Contact Credentials:</strong> Full name, primary email address, telephone number (optional), and corporate or portfolio reference URLs.
            </li>
            <li>
              <strong>Venture Classification &amp; Parameters:</strong> Company or project name, current venture stage (Concept, Formation, Pre-Seed, Seed, Growth), business archetype (Consumer Brand, Digital Platform, Physical Product, B2B Enterprise, Hospitality, etc.), target launch timelines, and high-level capital allocations.
            </li>
            <li>
              <strong>Strategic Diagnostic Responses:</strong> Selected architectural priorities, operating notes, commercial objectives, and custom brief parameters generated during Company Builder or Blueprint sessions.
            </li>
            <li>
              <strong>Confidential Founder Materials:</strong> Pitch decks, executive briefs, financial models, cap tables, brand identity guidelines, technical architecture sketches, schematics, and reference imagery uploaded via our intake interface.
            </li>
          </ul>
        </section>

        <section>
          <h2 style={{ fontFamily: 'Editorial New, Bodoni MT, Didot, "Times New Roman", serif', fontSize: '1.75rem', fontWeight: 400, margin: '0 0 16px' }}>
            03 / How Information Is Used
          </h2>
          <p style={{ margin: '0 0 16px' }}>
            Submitted information and assets are reviewed exclusively by Dynasty Works Studio principals and engagement leads for the following purposes:
          </p>
          <ul style={{ margin: 0, paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li>Evaluating venture viability, commercial scope, technical feasibility, and studio alignment.</li>
            <li>Formulating preliminary architectural roadmaps and strategic scoping proposals.</li>
            <li>Communicating directly with the founder regarding their inquiry or intake submission.</li>
            <li>Dispatching automated receipt confirmations and administrative notices to verify receipt.</li>
          </ul>
        </section>

        <section>
          <h2 style={{ fontFamily: 'Editorial New, Bodoni MT, Didot, "Times New Roman", serif', fontSize: '1.75rem', fontWeight: 400, margin: '0 0 16px' }}>
            04 / Storage, Isolation &amp; Infrastructure
          </h2>
          <p style={{ margin: '0 0 16px' }}>
            We maintain strict architectural separation between public web interfaces and intake data:
          </p>
          <ul style={{ margin: '0 0 16px', paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li>
              <strong>Private Relational Database:</strong> Structured inquiry submissions are recorded in private PostgreSQL database tables managed via Supabase with row-level access restricted to authenticated server-side service keys.
            </li>
            <li>
              <strong>Private Asset Storage Vault:</strong> Uploaded founder documents are stored in a dedicated private storage bucket (<code>founder-intake-assets</code>). Public, anonymous read access is strictly disabled. Files are organized in isolated directories keyed to unique inquiry identifiers with cryptographic UUID prefixes.
            </li>
            <li>
              <strong>Transactional Communication:</strong> System confirmation emails and internal studio notifications are dispatched using Resend over TLS-encrypted transport.
            </li>
          </ul>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--stone, #78716c)' }}>
            We describe our architecture truthfully without claiming unverified third-party certifications, military-grade encryption marketing terms, or commercial SLAs.
          </p>
        </section>

        <section style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '24px 28px' }}>
          <h2 style={{ fontFamily: 'Editorial New, Bodoni MT, Didot, "Times New Roman", serif', fontSize: '1.5rem', fontWeight: 400, margin: '0 0 12px', color: '#0f172a' }}>
            05 / Founder Responsibility &amp; Sensitive Data Warning
          </h2>
          <p style={{ margin: '0 0 12px' }}>
            Founders are responsible for ensuring they possess all necessary rights and authorizations to disclose any business documents, pitch materials, financial models, or cap tables submitted to the studio.
          </p>
          <p style={{ margin: 0, fontWeight: 500, color: '#b91c1c' }}>
            CRITICAL NOTICE: Do not submit passwords, API keys, private cryptographic keys, administrative access credentials, Social Security numbers, or unencrypted banking information. Dynasty Works Studio will never request administrative passwords or authentication secrets.
          </p>
        </section>

        <section>
          <h2 style={{ fontFamily: 'Editorial New, Bodoni MT, Didot, "Times New Roman", serif', fontSize: '1.75rem', fontWeight: 400, margin: '0 0 16px' }}>
            06 / Data Retention, Inspection &amp; Deletion Rights
          </h2>
          <p style={{ margin: '0 0 16px' }}>
            We retain founder inquiries and uploaded materials only as long as necessary to evaluate the venture, maintain administrative communication records, or fulfill active advisory contracts.
          </p>
          <p style={{ margin: '0 0 16px' }}>
            Founders maintain complete sovereignty over their submitted materials. You may request a verified copy of your submission record or request the permanent, irreversible deletion of your inquiry details and uploaded files from our database and storage buckets at any time.
          </p>
          <p style={{ margin: 0 }}>
            To exercise your data inspection or deletion rights, email our advisory team directly at{' '}
            <a href="mailto:advisory@dynastyworksstudio.com" style={{ textDecoration: 'underline', color: 'inherit' }}>
              advisory@dynastyworksstudio.com
            </a>{' '}
            with your Receipt ID or submission email address. Requests are fulfilled promptly by studio principals.
          </p>
        </section>

        <section>
          <h2 style={{ fontFamily: 'Editorial New, Bodoni MT, Didot, "Times New Roman", serif', fontSize: '1.75rem', fontWeight: 400, margin: '0 0 16px' }}>
            07 / Contact &amp; Governance Inquiries
          </h2>
          <p style={{ margin: '0 0 8px' }}>
            Dynasty Works Studio LLC
          </p>
          <p style={{ margin: '0 0 8px', color: 'var(--stone, #78716c)' }}>
            Attn: Advisory &amp; Privacy Governance
          </p>
          <p style={{ margin: '0 0 8px' }}>
            Email:{' '}
            <a href="mailto:advisory@dynastyworksstudio.com" style={{ textDecoration: 'underline', color: 'inherit' }}>
              advisory@dynastyworksstudio.com
            </a>
          </p>
          <p style={{ margin: 0 }}>
            Founder direct inquiries:{' '}
            <a href="mailto:ernestyearby@gmail.com" style={{ textDecoration: 'underline', color: 'inherit' }}>
              ernestyearby@gmail.com
            </a>
          </p>
        </section>
      </div>
    </article>
  );
}
