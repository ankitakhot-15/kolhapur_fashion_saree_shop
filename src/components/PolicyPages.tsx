import React, { useEffect } from 'react';
import { STORE } from '../config/storeInfo.ts';

export type PolicyType = 'privacy' | 'shipping' | 'exchange';

interface PolicyPageProps {
  type: PolicyType;
  onNavigate: (view: string, param?: string) => void;
}

/* ---------- small building blocks ---------- */

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="space-y-3">
    <h2 className="text-lg font-serif font-bold text-[#641D32]">{title}</h2>
    <div className="text-sm text-[#3F3935] leading-relaxed space-y-3">{children}</div>
  </section>
);

const Bullets: React.FC<{ items: React.ReactNode[] }> = ({ items }) => (
  <ul className="list-disc pl-5 space-y-1.5">
    {items.map((item, i) => (
      <li key={i}>{item}</li>
    ))}
  </ul>
);

const Steps: React.FC<{ items: React.ReactNode[] }> = ({ items }) => (
  <ol className="list-decimal pl-5 space-y-1.5">
    {items.map((item, i) => (
      <li key={i}>{item}</li>
    ))}
  </ol>
);

const Table: React.FC<{ head: string[]; rows: React.ReactNode[][] }> = ({ head, rows }) => (
  <div className="overflow-x-auto rounded border border-[#E6E0D8]">
    <table className="min-w-full text-xs text-left">
      <thead className="bg-[#641D32] text-[#FAF7F0]">
        <tr>
          {head.map((h) => (
            <th key={h} className="px-3 py-2 font-semibold">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-[#E6E0D8] bg-white">
        {rows.map((row, i) => (
          <tr key={i} className="align-top">
            {row.map((cell, j) => (
              <td key={j} className="px-3 py-2">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Callout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="rounded border border-[#C7A66A]/60 bg-[#FAF7F0] px-4 py-3 text-sm text-[#3F3935]">
    {children}
  </div>
);

const ContactLines: React.FC = () => (
  <>
    Helpline:{' '}
    <a href={`tel:${STORE.phoneTel}`} className="text-[#641D32] font-medium hover:underline">
      {STORE.phoneDisplay}
    </a>
    {' | '}Email:{' '}
    <a href={`mailto:${STORE.email}`} className="text-[#641D32] font-medium hover:underline">
      {STORE.email}
    </a>
  </>
);

/* ---------- policy contents ---------- */

const ExchangeContent: React.FC = () => (
  <>
    <p className="text-sm text-[#3F3935] leading-relaxed">
      At {STORE.legalName}, every saree undergoes strict quality checks prior to dispatch. If you receive a
      product with genuine company damage or a manufacturing defect, our 7-day policy provides an exchange.{' '}
      <strong>Returns or exchanges are not accepted for change of mind or personal preference.</strong>
    </p>

    <Section title="1. 7-Day Exchange Window (Company Damage Only)">
      <p>
        Exchange requests must be submitted within 7 calendar days from the date your package was marked
        delivered by our delivery partner (DTDC Express / India Post), strictly for genuine company damage or
        manufacturing defects.
      </p>
    </Section>

    <Section title="2. Exchange Eligibility Criteria">
      <Bullets
        items={[
          <><strong>Company damage / defect:</strong> the product must have an inherent manufacturing flaw (such as fabric tear, significant weaving defect, or structural fault).</>,
          <><strong>Unworn & pristine:</strong> the saree must be unworn, unwashed, unaltered, and free of stains, deodorant, or perfume odors.</>,
          <><strong>Uncut blouse piece:</strong> for sarees with running blouse pieces, the blouse fabric must NOT have been cut, detached, or altered.</>,
          <><strong>Original tags & packaging:</strong> the product must be returned with all original tags, brand labels, fold boards, and outer packaging intact.</>,
        ]}
      />
    </Section>

    <Section title="3. Mandatory Package Unboxing Video">
      <p>
        To verify that damage occurred prior to receipt and is a genuine company defect, an unboxing video is
        mandatory for all claims.
      </p>
      <Callout>
        <strong>Video guidelines:</strong> record a clear, continuous, unedited video from start to finish,
        beginning with the sealed outer parcel showing the shipping label, then opening the package to
        highlight the defective area.
      </Callout>
    </Section>

    <Section title="4. How to Return (Customer Self-Ship by Post)">
      <Steps
        items={[
          <><strong>Report within 7 days:</strong> send your Order Number along with the unboxing video to <a href={`mailto:${STORE.email}`} className="text-[#641D32] hover:underline">{STORE.email}</a> or call <a href={`tel:${STORE.phoneTel}`} className="text-[#641D32] hover:underline">{STORE.phoneDisplay}</a>.</>,
          <><strong>Claim verification:</strong> our team will review the unboxing video and verify the manufacturing defect.</>,
          <><strong>Self-return via post:</strong> send the defective saree by India Post / Registered Post / Speed Post / courier to: <br /><strong>{STORE.legalName}</strong>, {STORE.address}. Helpline: {STORE.phoneDisplay}.</>,
          <><strong>Replacement dispatch:</strong> once the defective saree reaches our store and is inspected, a fresh replacement piece will be dispatched via DTDC Express or India Post.</>,
        ]}
      />
      <Callout>
        <strong>Note:</strong> reverse courier pickup is not provided. Customers must dispatch the parcel by
        post themselves.
      </Callout>
    </Section>

    <Section title="5. Replacement & Out-of-Stock Policy">
      <Bullets
        items={[
          <><strong>Direct replacement:</strong> we replace the damaged item with an identical fresh piece.</>,
          <><strong>Out of stock:</strong> if the exact saree is no longer available, you may choose an alternative saree of equal value or receive a 100% refund to your original payment mode within 5 to 7 business days.</>,
        ]}
      />
    </Section>

    <Section title="6. Non-Returnable / Non-Exchangeable Scenarios">
      <Bullets
        items={[
          'Any product without verified company damage or manufacturing defect.',
          'Claims submitted without a mandatory continuous unboxing video.',
          'Sarees with cut blouse pieces, or sarees that have been worn, washed, or altered.',
          'Damage caused by customer handling, improper washing, or post-delivery accidents.',
        ]}
      />
    </Section>

    <Callout>
      <strong>Exchange & Defect Support Desk</strong>
      <br />
      <ContactLines />
    </Callout>
  </>
);

const ShippingContent: React.FC = () => (
  <>
    <p className="text-sm text-[#3F3935] leading-relaxed">
      At {STORE.legalName}, every saree is packed with care and handled by India's leading courier partners
      so your garments arrive in pristine, showroom condition.
    </p>

    <Section title="1. Pan-India Delivery Coverage">
      <p>
        We deliver to PIN codes across India through our official logistics partners: DTDC Express and India
        Post (Speed Post / भारतीय डाक).
      </p>
    </Section>

    <Section title="2. Processing & Dispatch Timelines">
      <Bullets
        items={[
          <><strong>Ready-to-ship sarees:</strong> dispatched within 24 to 48 business hours of order verification.</>,
          <><strong>Custom blouse stitching:</strong> dispatched within 5 to 7 business days after we receive your customized measurement chart.</>,
        ]}
      />
    </Section>

    <Section title="3. Estimated Delivery Times">
      <Table
        head={['Destination Zone', 'Estimated Delivery Time', 'Delivery Partner']}
        rows={[
          ['Maharashtra', '6 to 8 working days', 'DTDC Express / India Post'],
          ['Out of Maharashtra (rest of India)', '8 to 10 working days', 'DTDC Express / India Post (Speed Post)'],
        ]}
      />
      <p>
        All parcels are shipped in sealed, tamper-evident packaging. Please inspect the outer parcel on
        delivery and record an unboxing video before opening it.
      </p>
    </Section>

    <Section title="4. Shipping Charges & Delivery Partners">
      <p>
        All consignments are dispatched via DTDC Express and India Post. Nominal shipping charges are
        calculated at checkout based on delivery location (Maharashtra vs. outside Maharashtra) and parcel
        weight.
      </p>
    </Section>

    <Section title="5. Express Order Verification">
      <p>
        Our customer service team verifies order details and shares dispatch notifications via WhatsApp before
        the parcel leaves our facility.
      </p>
    </Section>

    <Section title="6. Tamper-Proof Packaging">
      <Bullets
        items={[
          'Each saree is encased in a moisture-resistant protective garment sleeve with butter-paper layering to protect delicate embroidery.',
          'Shipped inside rigid, tamper-evident outer cartons with security tape.',
        ]}
      />
      <Callout>
        <strong>Important:</strong> if the outer box or security tape appears torn, open, or damaged on
        delivery, please refuse the package and notify us immediately.
      </Callout>
    </Section>

    <Section title="7. Tracking Your Order">
      <p>
        As soon as your parcel is handed to the courier partner, an automated dispatch notification with a
        tracking link (AWB number) is sent to your registered WhatsApp number and email address.
      </p>
    </Section>

    <Callout>
      <strong>Questions about an active shipment?</strong> Contact our logistics desk with your Order ID.
      <br />
      <ContactLines />
    </Callout>
  </>
);

const PrivacyContent: React.FC = () => (
  <>
    <Callout>
      <strong>Notice to Data Principals (customers).</strong> This notice is provided by {STORE.legalName}{' '}
      (the Data Fiduciary) under the Digital Personal Data Protection Act, 2023 (DPDP Act) and the DPDP
      Rules, 2025. It explains what personal data we collect, why, your rights, how to withdraw consent, and
      how to contact our Grievance Officer. Version 2.4.
    </Callout>

    <Section title="1. Identity & Contact of the Data Fiduciary">
      <p>
        {STORE.legalName} is an Indian retail and e-commerce business offering authentic handloom sarees and
        designer festive collections.
      </p>
      <p>
        <strong>Address:</strong> {STORE.address}.
        <br />
        <ContactLines />
      </p>
    </Section>

    <Section title="2. Personal Data Collected & Purposes">
      <Table
        head={['Category', 'Data Elements', 'Purpose', 'Lawful Ground']}
        rows={[
          [
            'Identity & contact',
            'Full name, mobile number, WhatsApp number, email address',
            'Customer profile and login; order confirmation and dispatch notifications; styling assistance and customer care; responding to inquiries.',
            'Consent (Section 6)',
          ],
          [
            'Delivery & address',
            'Street address, flat/house no., landmark, city, state, PIN code',
            'Courier delivery across India via DTDC Express and India Post; defect-exchange claims; PIN-code serviceability checks.',
            'Performance of contract & consent',
          ],
          [
            'Order & tailoring',
            'Product SKUs, fabric, colours, sizes, quantity, custom blouse measurements, promo codes',
            'Fulfilling saree finishing and tailoring requests; packaging inspection and inventory; promo and loyalty calculation.',
            'Performance of contract',
          ],
          [
            'Billing & transactions',
            'Payment method, gateway transaction reference ID, amount paid, billing address, bank account / UPI ID (refunds only)',
            'Payment verification and fraud screening; GST tax invoices; processing refunds. We never store card numbers or UPI PINs.',
            'Legal obligation (GST & tax laws) & contract',
          ],
          [
            'Communication records',
            'WhatsApp chats, support emails, contact-form submissions, call notes',
            'Documenting custom requests and colour verification; resolving delivery delays and disputes; staff training and quality assurance.',
            'Consent & legitimate uses',
          ],
          [
            'Technical & browsing',
            'IP address, device model, OS, browser type, session cookies, access timestamps',
            'Website security and bot prevention; cart and login session persistence; performance optimization.',
            'Legitimate uses (Section 7) & security',
          ],
        ]}
      />
    </Section>

    <Section title="3. Security Safeguards">
      <Bullets
        items={[
          <><strong>Encryption in transit:</strong> data between your device and our servers is protected using TLS.</>,
          <><strong>Role-based access control:</strong> customer names, addresses, and phone numbers are accessible only to authenticated staff who need them for packing, dispatch, and support.</>,
          <><strong>Two-factor authentication:</strong> internal store management dashboards require multi-factor authentication.</>,
          <><strong>No data selling:</strong> we do not sell, rent, or trade your personal data with marketing brokers or advertisers.</>,
        ]}
      />
    </Section>

    <Section title="4. Consent">
      <p>
        We request your consent in a clear, specific, and unambiguous manner through an affirmative action,
        such as ticking an unchecked consent box at checkout, submitting the contact form, or starting a chat
        on our official WhatsApp business number. We do not bundle consent for unrelated marketing with
        essential order fulfilment.
      </p>
    </Section>

    <Section title="5. Withdrawing Consent">
      <p>You may withdraw consent at any time, as easily as it was given, by:</p>
      <Bullets
        items={[
          <>Emailing <a href={`mailto:${STORE.email}`} className="text-[#641D32] hover:underline">{STORE.email}</a> with the subject "Withdrawal of Consent - [Your Name/Mobile]"; or</>,
          <>Calling or messaging {STORE.phoneDisplay}; or</>,
          'Contacting our Grievance Officer listed in Section 10.',
        ]}
      />
      <p>
        We will stop processing your data within 7 business days, except where retention is legally required
        (for example, GST tax invoices). Withdrawal does not affect processing done before it.
      </p>
    </Section>

    <Section title="6. Your Rights as a Data Principal">
      <Bullets
        items={[
          <><strong>Right to access:</strong> request a summary of the personal data we process and the parties it is shared with.</>,
          <><strong>Right to correction & updating:</strong> request correction of inaccurate data, completion of incomplete data, or an updated address or phone number.</>,
          <><strong>Right to erasure:</strong> request deletion once the purpose (such as delivery and exchange period) has ended and retention is no longer legally required.</>,
          <><strong>Right to grievance redressal:</strong> contact our Grievance Officer about any concern regarding your data.</>,
          <><strong>Right to nominate:</strong> nominate another person to exercise your rights in the event of your death or incapacity.</>,
        ]}
      />
    </Section>

    <Section title="7. Data Retention Schedule">
      <Table
        head={['Data Category', 'Retention Period', 'Basis']}
        rows={[
          ['Tax invoices, bills & GST records', '6 years (72 months) from the due date of the relevant annual return', 'Section 36, CGST Act, 2017'],
          ['Customer account & shipping address', 'Until account closure or erasure request', 'Ongoing orders, loyalty points, faster re-ordering'],
          ['Support inquiries & WhatsApp chats', '180 days after resolution, then purged', 'After-sales claims and exchanges'],
          ['Cybersecurity & server logs', '180 days', 'CERT-In directions'],
        ]}
      />
    </Section>

    <Section title="8. Third-Party Service Providers (Data Processors)">
      <Bullets
        items={[
          <><strong>Logistics:</strong> DTDC Express and India Post (and other couriers where used) receive your name, address, and mobile number solely to deliver parcels and handle returns.</>,
          <><strong>Payments:</strong> RBI-authorized payment gateways process your digital payments in PCI-DSS compliant environments.</>,
          <><strong>Cloud & hosting:</strong> data is stored on secure servers following recognised information-security standards.</>,
          <><strong>Messaging:</strong> Meta Platforms / authorized WhatsApp Business providers transmit order receipts and tracking updates.</>,
        ]}
      />
    </Section>

    <Section title="9. Children">
      <p>
        In line with Section 9 of the DPDP Act, we do not knowingly collect personal data of anyone under 18
        without verifiable parental or guardian consent, and we do not run targeted advertising or profiling
        directed at minors.
      </p>
    </Section>

    <Section title="10. Grievance Officer & Escalation">
      <Callout>
        <strong>{STORE.dpoName}</strong>, Designated Data Protection & Grievance Officer
        <br />
        {STORE.legalName}, {STORE.address}
        <br />
        <ContactLines />
        <br />
        Support Hours: Monday to Saturday, 10:00 AM to 6:30 PM IST
      </Callout>
      <Bullets
        items={[
          <><strong>Acknowledgement:</strong> within 24 business hours of receiving your grievance.</>,
          <><strong>Resolution:</strong> within 7 to 14 business days.</>,
          <><strong>Escalation:</strong> if you are not satisfied, or receive no response in time, you may file a complaint with the Data Protection Board of India.</>,
        ]}
      />
    </Section>
  </>
);

/* ---------- page shell ---------- */

const META: Record<PolicyType, { title: string; subtitle: string; crumb: string }> = {
  privacy: {
    title: 'Privacy & Data Protection Notice',
    subtitle: 'Prepared with reference to the Digital Personal Data Protection Act, 2023 and DPDP Rules, 2025.',
    crumb: 'Privacy',
  },
  shipping: {
    title: 'Shipping Policy',
    subtitle: 'Delivery coverage, processing times, and order tracking.',
    crumb: 'Shipping',
  },
  exchange: {
    title: 'Exchange Policy',
    subtitle: 'Exchange eligibility and instructions.',
    crumb: 'Exchange',
  },
};

const PolicyPages: React.FC<PolicyPageProps> = ({ type, onNavigate }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [type]);

  const meta = META[type];
  const content =
    type === 'privacy' ? <PrivacyContent /> : type === 'shipping' ? <ShippingContent /> : <ExchangeContent />;

  return (
    <main className="mx-auto max-w-4xl space-y-6 px-4 py-8">
      <button
        type="button"
        onClick={() => onNavigate('home')}
        className="text-sm text-[#641D32] hover:underline"
      >
        ← Back to home
      </button>
      <header className="space-y-2">
        <p className="text-xs text-[#716860]">Home / {meta.crumb}</p>
        <h1 className="text-2xl font-serif font-bold text-[#641D32]">{meta.title}</h1>
        <p className="text-sm text-[#716860]">{meta.subtitle}</p>
      </header>
      <div className="space-y-6">{content}</div>
    </main>
  );
};

export default PolicyPages;