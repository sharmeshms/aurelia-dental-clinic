import { FileText, Info, Printer, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { CtaBand } from "@/components/sections/SharedSections";
import { site } from "@/config/site";
import { useSeo } from "@/lib/seo";

type Section = { id: string; title: string; paragraphs: string[]; list?: string[] };

const privacy: Section[] = [
  {
    id: "who-we-are",
    title: "Who we are",
    paragraphs: [
      `${site.legalName} operates this website and is the data controller for the personal information collected through it. Our registered practice address is ${site.contact.address.line1}, ${site.contact.address.line2}, ${site.contact.address.city} ${site.contact.address.postcode}.`,
      "This is a demonstration website. The practice details, email address and telephone number shown are placeholders and must be replaced with the real controller details before publication.",
    ],
  },
  {
    id: "information-we-collect",
    title: "Information we collect",
    paragraphs: [
      "We collect the information you choose to give us through the appointment request, contact and newsletter forms. That may include your name, email address, telephone number, preferred treatment, preferred clinician and any notes you add.",
      "We also receive limited technical information automatically, such as your browser type and pages visited, where analytics are enabled. We do not use this website to collect special category health data beyond what you volunteer in a free-text message.",
    ],
    list: [
      "Appointment requests: name, contact details, treatment and clinician preference, preferred date and time, optional notes.",
      "Contact enquiries: name, email, optional telephone number, subject and message.",
      "Newsletter: email address and subscription date.",
      "Technical data: server logs and, if enabled, aggregated analytics.",
    ],
  },
  {
    id: "how-we-use-it",
    title: "How we use your information",
    paragraphs: [
      "We use your information to respond to your enquiry, arrange and confirm appointments, provide dental care, keep appropriate clinical records, and send the newsletter where you have asked for it.",
      "Our lawful bases are typically: taking steps at your request before entering a contract (appointments), performance of a contract (treatment), legitimate interests (service administration and improving the website), and consent (marketing emails).",
    ],
  },
  {
    id: "sharing",
    title: "Sharing and retention",
    paragraphs: [
      "We do not sell your personal information. We share it only with service providers who help us operate the practice and website — for example hosting, email and practice-management providers — under appropriate agreements, or where required by law or a regulator.",
      "Enquiry and appointment request data is kept only as long as needed for the purpose it was collected. Clinical records are retained in line with professional and legal requirements. Newsletter data is kept until you unsubscribe.",
    ],
  },
  {
    id: "your-rights",
    title: "Your rights",
    paragraphs: [
      "Subject to applicable law, you may request access to your personal information, ask us to correct or delete it, object to or restrict certain processing, or withdraw consent for marketing at any time.",
      "To exercise a right, contact us using the details on the contact page. You also have the right to complain to the relevant supervisory authority — in the UK, the Information Commissioner's Office.",
    ],
  },
  {
    id: "cookies",
    title: "Cookies and this demo",
    paragraphs: [
      "This website uses only essential browser storage in the demonstration build — for example, remembering that you dismissed the announcement bar and keeping an admin session cookie for authorised staff. No advertising cookies are set by this template.",
      "If you add analytics or marketing tools, update this section and provide an appropriate consent mechanism before going live.",
    ],
  },
];

const terms: Section[] = [
  {
    id: "website-use",
    title: "Use of this website",
    paragraphs: [
      "This website is provided for general information about our practice and treatments. By using it, you agree to these terms. If you do not agree, please do not use the site.",
      "We try to keep the information accurate and current, but it is not a substitute for an individual clinical assessment. Treatment suitability, risks, costs and outcomes can only be confirmed after a consultation.",
    ],
  },
  {
    id: "appointments",
    title: "Appointment requests",
    paragraphs: [
      "Submitting the online form creates a request, not a confirmed appointment. Your request is recorded with a pending status and a reference number. Our team will contact you to confirm the date and time.",
      "We ask for at least 24 hours' notice to change or cancel an appointment. Late cancellations and missed appointments may incur a fee because the time has been reserved for you. Any fee will be explained before it is applied.",
    ],
  },
  {
    id: "fees",
    title: "Fees and estimates",
    paragraphs: [
      "Fees vary with the complexity of treatment. A written estimate is provided before treatment begins. If the clinical plan changes, we will discuss the revised options and costs with you before additional treatment is carried out.",
      "Payment terms, insurance arrangements and any finance options are confirmed in writing. Finance is subject to status and approval by the finance provider.",
    ],
  },
  {
    id: "clinical-information",
    title: "Clinical information and outcomes",
    paragraphs: [
      "Content on this website is general information, not personalised dental advice. All treatment carries risks, and no outcome is guaranteed. Photographs, testimonials and figures on this demonstration site are illustrative and must not be relied on as evidence of results.",
      "If you have a medical emergency, facial swelling affecting breathing or swallowing, or significant trauma, seek urgent medical care rather than waiting for an online response.",
    ],
  },
  {
    id: "intellectual-property",
    title: "Intellectual property",
    paragraphs: [
      "The design, text and branding of this website are protected by intellectual property law. You may view and print pages for personal, non-commercial use. You may not reproduce, republish or use the content commercially without written permission.",
      "Photography used in this demonstration is licensed stock imagery and does not depict real patients or clinicians of this practice.",
    ],
  },
  {
    id: "liability",
    title: "Liability and governing law",
    paragraphs: [
      "Nothing in these terms excludes liability that cannot lawfully be excluded. To the extent permitted by law, we are not liable for indirect or consequential loss arising from use of this website.",
      "These terms are governed by the laws of England and Wales. This demonstration template should be reviewed by a qualified solicitor before publication.",
    ],
  },
];

export default function LegalPage({ type }: { type: "privacy" | "terms" }) {
  const isPrivacy = type === "privacy";
  const sections = isPrivacy ? privacy : terms;
  const updated = isPrivacy ? site.legal.privacyUpdated : site.legal.termsUpdated;

  useSeo({
    title: isPrivacy ? "Privacy Policy" : "Terms & Conditions",
    description: isPrivacy
      ? "How Aurelia Dental Studio collects, uses and protects personal information submitted through this website."
      : "Terms and conditions for using the Aurelia Dental Studio website and requesting appointments online.",
    noIndex: false,
  });

  return (
    <>
      <PageHero
        eyebrow="Legal"
        title={isPrivacy ? "Privacy policy" : "Terms & conditions"}
        description={
          isPrivacy
            ? "A clear summary of what we collect, why we collect it and the choices you have. This is demonstration wording and should be reviewed before publication."
            : "The basis on which we provide this website and accept online appointment requests. This is demonstration wording and should be reviewed before publication."
        }
        crumbs={[{ label: isPrivacy ? "Privacy policy" : "Terms & conditions" }]}
        tone="white"
      >
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-beige bg-ivory px-3.5 py-1.5 text-[11.5px] text-muted">
            <FileText className="h-3.5 w-3.5 text-burgundy" aria-hidden /> Last updated {updated}
          </span>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-full border border-beige bg-white px-3.5 py-1.5 text-[11.5px] font-medium text-burgundy transition-colors hover:border-rose print:hidden"
          >
            <Printer className="h-3.5 w-3.5" aria-hidden /> Print this page
          </button>
        </div>
      </PageHero>

      <section className="bg-white py-14 lg:py-20 print:py-0">
        <div className="container-x grid gap-10 lg:grid-cols-[240px_1fr] lg:gap-16">
          <aside className="lg:sticky lg:top-24 lg:self-start print:hidden">
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-muted">On this page</p>
            <nav aria-label="Legal sections" className="mt-3 space-y-1.5 border-l border-beige pl-4">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="block text-[12.5px] leading-snug text-muted transition-colors hover:text-burgundy"
                >
                  {section.title}
                </a>
              ))}
            </nav>
            <div className="mt-6 rounded-2xl border border-beige bg-ivory p-4">
              <ShieldCheck className="h-4 w-4 text-burgundy" aria-hidden />
              <p className="mt-2 text-[11.5px] leading-relaxed text-muted">
                Questions about your data? Contact the practice and ask for the data protection lead.
              </p>
              <ButtonLink to="/contact" size="sm" variant="secondary" className="mt-3 w-full">
                Contact us
              </ButtonLink>
            </div>
          </aside>

          <article className="max-w-3xl">
            <div className="rounded-2xl border border-amber-200/70 bg-amber-50/60 p-4 print:hidden">
              <p className="flex items-start gap-2 text-[12px] leading-relaxed text-amber-900/80">
                <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                Demonstration content only. Replace this text with a policy reviewed for your practice, jurisdiction
                and the tools you actually use.
              </p>
            </div>

            <div className="mt-8 space-y-10">
              {sections.map((section) => (
                <section key={section.id} id={section.id} className="scroll-mt-28">
                  <h2 className="font-display text-[24px] leading-snug text-ink sm:text-[28px]">{section.title}</h2>
                  <div className="prose-luxe mt-3">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                    ))}
                  </div>
                  {section.list && (
                    <ul className="mt-4 space-y-2 rounded-2xl border border-beige bg-ivory/60 p-5">
                      {section.list.map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-[13px] leading-relaxed text-ink/75">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose" aria-hidden />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>

            <div className="mt-12 rounded-2xl border border-beige bg-ivory p-6">
              <h2 className="font-display text-xl text-ink">Contacting us about this policy</h2>
              <p className="mt-2 text-[13px] leading-relaxed text-muted">
                Write to {site.contact.email} or call {site.contact.phone}. Our postal address is {site.contact.address.line1},{" "}
                {site.contact.address.line2}, {site.contact.address.city} {site.contact.address.postcode}.
              </p>
            </div>
          </article>
        </div>
      </section>

      <div className="print:hidden">
        <CtaBand
          eyebrow="Questions?"
          title="If anything here is unclear, just ask."
          description="Our reception team can explain how your information is used or talk you through our appointment terms."
          primaryLabel="Contact the clinic"
          primaryTo="/contact"
          secondaryLabel="Read the FAQs"
          secondaryTo="/faq"
        />
      </div>
    </>
  );
}
