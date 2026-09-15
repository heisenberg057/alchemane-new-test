'use client';

import React from 'react';

/* ─────────────────────────────────────────────────────────────
   PRIVACY POLICY PAGE
───────────────────────────────────────────────────────────── */

const bodyStyle: React.CSSProperties = {
  fontFamily: "'ProximaNova-Medium', 'Proxima Nova', sans-serif",
  fontSize: '18px',
  fontWeight: 500,
  color: '#444444',
  lineHeight: '1.8',
  margin: 0,
};

const subheadingStyle: React.CSSProperties = {
  fontFamily: "'ProximaNova-Medium', 'Proxima Nova', sans-serif",
  fontSize: '20px',
  fontWeight: 600,
  color: '#121212',
  lineHeight: '1.4',
  margin: '0 0 14px 0',
};

const boldStyle: React.CSSProperties = {
  fontWeight: 600,
  color: '#121212',
};

function BulletItem({ children }: { children: React.ReactNode }) {
  return (
    <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '12px', listStyle: 'none' }}>
      <span style={{ color: '#1769FF', fontSize: '20px', lineHeight: 1.6, flexShrink: 0 }}>•</span>
      <p style={bodyStyle}>{children}</p>
    </li>
  );
}

function Bold({ children }: { children: React.ReactNode }) {
  return <strong style={boldStyle}>{children}</strong>;
}

function Section({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {title && <h2 style={subheadingStyle}>{title}</h2>}
      {children}
    </div>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <main style={{ background: '#fff', minHeight: '100vh' }}>

      {/* ── HERO BANNER ── */}
      <section
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '64px 16px 56px',
          textAlign: 'center',
          background: 'linear-gradient(135deg, #4686FE 0%, #1769FF 100%)',
        }}
      >
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, color: '#fff', lineHeight: 1.15, letterSpacing: '-0.5px', margin: '0 0 14px' }}>
          Privacy Policy
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '15px', fontWeight: 500, margin: 0 }}>
          Home / <span style={{ color: '#fff', fontWeight: 600 }}>Privacy Policy</span>
        </p>
      </section>

      {/* ── DOCUMENT CONTENT ── */}
      <section style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '80px 16px 100px' }}>
        <div style={{ width: '100%', maxWidth: '860px', display: 'flex', flexDirection: 'column', gap: '32px' }}>

          <p style={bodyStyle}>
            This Privacy Policy describes how American Hairline collects, uses and discloses your personal information when you visit American Hairline's website or make a purchase. We protect your privacy and strive to ensure that your personal information is handled securely. Please read our privacy policy carefully to understand our practices regarding your personal information.
          </p>

          <p style={bodyStyle}>
            Contact Information — if you have any questions, would like more information about our privacy practices, or would like to make a complaint, please feel free to contact us using the contact details below.
          </p>

          <p style={bodyStyle}>
            <Bold>Email:</Bold> americanhairline.info@gmail.com
          </p>

          <p style={bodyStyle}>
            <Bold>Postal address:</Bold> American Hairline Private, Saffron Building, 202, Linking Rd, Opposite Satgurus Store, Above Anushree Reddy Store, Khar, Khar West, Mumbai, Maharashtra 400052
          </p>

          <p style={bodyStyle}>
            When you visit our website, we collect certain information about your device, your interactions with the website, and information required to process your purchase. We also collect additional information when you contact our customer service. In this Privacy Policy, we refer to any information that can identify an individual as "Personal Information". The personal information we collect and why we collect it is as follows:
          </p>

          <Section title="Device Information">
            <ul style={{ margin: 0, padding: 0 }}>
              <BulletItem><Bold>Purpose of collection:</Bold> To ensure that the website loads correctly and to analyze website usage in order to improve our website.</BulletItem>
              <BulletItem><Bold>Source of collection:</Bold> Collected automatically when you visit our website using cookies, log files, web beacons, tags and pixels.</BulletItem>
              <BulletItem><Bold>Personal data collected:</Bold> Web browser version, IP address, time zone, cookie information, websites or products you visit, search terms and how you interact with the website.</BulletItem>
            </ul>
          </Section>

          <Section title="Order Information">
            <ul style={{ margin: 0, padding: 0 }}>
              <BulletItem><Bold>Purpose of collection:</Bold> To provide products or services, to perform contracts, to process payment information, to arrange shipments, to provide invoices and/or order confirmations, to communicate with you, to screen potential risk or fraud in orders, and to provide our services for information or advertising related to products or services according to your preferences.</BulletItem>
              <BulletItem><Bold>Source of collection:</Bold> Collected directly from you.</BulletItem>
              <BulletItem><Bold>Disclosure for business purposes:</Bold> Shared with our processor Shopify, shipping partners and payment gateways.</BulletItem>
              <BulletItem><Bold>Personal data collected:</Bold> Name, billing address, shipping address, payment information (including credit card number, NEFT details, PayPal), email address, phone number.</BulletItem>
            </ul>
          </Section>

          <Section title="Minors">
            <p style={bodyStyle}>
              This website is not intended for individuals under the age of 18. We do not collect personal information from children. If you are a parent or legal guardian and you believe your child has provided us with personal information, please contact us at the address above to request deletion.
            </p>
          </Section>

          <Section title="Behavioural Advertising">
            <p style={bodyStyle}>
              We employ your Personal Information to comprehend the needs and preferences of our customers, allowing us to provide targeted advertisements and marketing communications that we believe will be of interest to them. Here are the methods we use:
            </p>
            <ul style={{ margin: 0, padding: 0 }}>
              <BulletItem><Bold>Google Analytics:</Bold> We use Google Analytics to help us understand how our customers use our website. You may opt out via http://tools.google.com/dlpage/gaoptout.</BulletItem>
              <BulletItem><Bold>Advertising Partners:</Bold> We share information about your use of website, purchases and interactions with our advertisements on other websites with our advertising partners.</BulletItem>
              <BulletItem><Bold>Shopify Audience:</Bold> We use Shopify Audiences to display ads on other websites with our advertising partners to target shoppers who may be interested in our products.</BulletItem>
              <BulletItem><Bold>Meta Business:</Bold> We promote our products and services on platforms such as Facebook, Instagram and WhatsApp, utilising your personal information and behavioural preferences to present you with personalised products and services.</BulletItem>
            </ul>
            <p style={bodyStyle}>
              To opt out of targeted advertising, please visit:
            </p>
            <ul style={{ margin: 0, padding: 0 }}>
              <BulletItem><Bold>Facebook:</Bold> https://www.facebook.com/settings/?tab=ads</BulletItem>
              <BulletItem><Bold>Google:</Bold> https://www.google.com/settings/ads/anonymous</BulletItem>
            </ul>
          </Section>

          <Section title="Use of Personal Information">
            <p style={bodyStyle}>
              We use your personal information to provide services such as selling products, processing payments, shipping and fulfilling orders, and notifying you of new products, services and offers.
            </p>
          </Section>

          <Section title="Lawful Basis">
            <p style={bodyStyle}>
              If you are a resident of the European Economic Area (EEA), we process your personal information under the following lawful bases:
            </p>
            <ul style={{ margin: 0, padding: 0 }}>
              <BulletItem>Your consent</BulletItem>
              <BulletItem>The performance of the contract between you and the site</BulletItem>
              <BulletItem>Compliance with our legal obligations</BulletItem>
              <BulletItem>To protect your vital interests</BulletItem>
              <BulletItem>To perform a task carried out in the public interest</BulletItem>
              <BulletItem>For our legitimate interests, which do not override your fundamental rights and freedoms</BulletItem>
            </ul>
          </Section>

          <Section title="Retention">
            <p style={bodyStyle}>
              We will retain your Personal Information for our records when you place an order through the site unless you request its erasure. For more information on your right of erasure, please refer to the "Your Rights" section below.
            </p>
          </Section>

          <Section title="Automatic Decision-Making">
            <p style={bodyStyle}>
              We do not engage in fully automated decision-making that has a legal or otherwise significant effect using customer data. Our processor, Shopify, uses limited automated decision-making to prevent fraud, which does not have a legal or otherwise significant effect on you.
            </p>
          </Section>

          <Section title="Your Rights">
            <p style={bodyStyle}>
              If you are a resident of the EEA, you have the right to access, port, correct, update, or erase the Personal Information we hold about you. To exercise these rights, please contact us using the information provided above.
            </p>
          </Section>

          <Section title="Cookies">
            <p style={bodyStyle}>
              We use cookies to enhance your browsing experience and provide our services. Cookies are small amounts of information that are downloaded to your computer or device when you visit our site. They help us remember your actions and preferences, improving your experience on our site.
            </p>
          </Section>

          <Section title="Do Not Track">
            <p style={bodyStyle}>
              As there is no consistent industry understanding of how to respond to "Do Not Track" signals, we do not alter our data collection and usage practices when we detect such a signal from your browser.
            </p>
          </Section>

          <Section title="Changes to This Policy">
            <p style={bodyStyle}>
              We may update this Privacy Policy periodically to reflect changes in our practices or for operational, legal, or regulatory reasons.
            </p>
          </Section>

          <Section title="Complaints">
            <p style={bodyStyle}>
              If you have any complaints regarding our privacy practices, please contact us using the email or mailing address provided above. If you are not satisfied with our response, you have the right to lodge a complaint with the relevant data protection authority. Please note that the jurisdiction for legal complaints and appeals will be at Bombay High Court and District authorities in Mumbai.
            </p>
          </Section>

          <Section title="Consultation Fee">
            <p style={bodyStyle}>
              We offer consultation services for a fee of ₹500. This fee covers the time and expertise provided during the consultation session. Payment for the consultation must be made prior to the scheduled session. Please note that the consultation fee is non-refundable.
            </p>
          </Section>

          <p style={{ ...bodyStyle, color: '#121212', fontWeight: 600 }}>
            We appreciate your trust in American Hairline, and we are committed to protecting your privacy and providing transparency regarding the collection, use, and disclosure of your Personal Information.
          </p>

        </div>
      </section>

    </main>
  );
}