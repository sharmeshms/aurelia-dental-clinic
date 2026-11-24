import { useState } from "react";
import {
  Accessibility,
  ArrowRight,
  CalendarCheck,
  Check,
  ClipboardList,
  CreditCard,
  FileText,
  HeartHandshake,
  Info,
  Phone,
  Printer,
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { Accordion } from "@/components/ui/Accordion";
import { CtaBand } from "@/components/sections/SharedSections";
import { site } from "@/config/site";
import { useSeo } from "@/lib/seo";

const navItems = [
  ["Before your visit", "before"],
  ["Your first appointment", "first-visit"],
  ["Fees", "fees"],
  ["Insurance & payment", "insurance"],
  ["Nervous patients", "nervous"],
  ["Accessibility", "accessibility"],
  ["After your visit", "aftercare"],
  ["Registration form", "registration"],
];

const fees = [
  ["New patient consultation & examination", "from £95"],
  ["Routine hygiene appointment", "from £85"],
  ["Composite filling", "from £165"],
  ["Root canal treatment (anterior)", "from £450"],
  ["Crown (porcelain/ceramic)", "from £750"],
  ["Dental implant (single, excluding crown)", "from £2,400"],
  ["Professional whitening (upper and lower)", "from £350"],
  ["Clear aligner treatment", "from £3,200"],
  ["Ceramic veneer (per tooth)", "from £650"],
  ["Emergency assessment", "from £95"],
];

const firstVisit = [
  {
    title: "A conversation first",
    text: "We ask what brought you in, what you have had done before and what you would like to change. No treatment happens at this stage.",
  },
  {
    title: "A full examination",
    text: "Teeth, gums, bite, soft tissues and any existing restorations are checked. Radiographs or photographs are taken only where they add information.",
  },
  {
    title: "Findings explained",
    text: "We show you what we can see and explain it in plain language, including the option to monitor rather than treat.",
  },
  {
    title: "A written plan",
    text: "You leave with options, priorities, timescales and an itemised estimate. You can take time to decide.",
  },
];

const nervousFaqs = [
  {
    q: "I have not been to a dentist in over ten years. Will I be judged?",
    a: "No. Avoidance is extremely common and usually has a reason. We start gently, explain everything and agree a pace that feels manageable. You can stop at any point.",
  },
  {
    q: "Can I bring someone with me?",
    a: "Yes. A friend, family member or support worker is welcome in the waiting room and, where space allows, in the treatment room. Please tell us when booking.",
  },
  {
    q: "What if I need more than local anaesthetic?",
    a: "For appropriate cases we can discuss referral for sedation. This is arranged individually and is not suitable for everyone. We will explain the options honestly.",
  },
  {
    q: "Can we agree a stop signal?",
    a: "Absolutely. We agree a raised hand or another signal before treatment begins, and we stop immediately when you use it.",
  },
];

export default function PatientInformationPage() {
  useSeo({
    title: "Patient Information",
    description:
      "What to expect at your first visit, how fees and insurance work, support for nervous patients, accessibility information and a printable registration form.",
    image: "/images/clinic-chair.jpg",
  });

  const [formOpen, setFormOpen] = useState(false);

  return (
    <>
      <PageHero
        eyebrow="Patient information"
        title="Everything you need to know before you arrive."
        description="Practical details about first visits, fees, insurance, accessibility and aftercare — written to be read before you book, not discovered afterwards."
        crumbs={[{ label: "Patient information" }]}
        image="/images/clinic-chair.jpg"
        imageAlt="A prepared treatment room at Aurelia Dental Studio"
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink to="/appointment" iconRight={<ArrowRight className="h-4 w-4" />}>
            Request an appointment
          </ButtonLink>
          <a
            href={site.contact.phoneHref}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-burgundy/25 bg-white px-6 text-sm font-medium text-burgundy transition-colors hover:bg-burgundy-50"
          >
            <Phone className="h-4 w-4" aria-hidden /> Ask a question
          </a>
        </div>
      </PageHero>

      <section className="bg-white py-12 lg:py-16">
        <div className="container-x grid gap-10 lg:grid-cols-[230px_1fr] lg:gap-16">
          <aside className="lg:sticky lg:top-24 lg:self-start print:hidden">
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-muted">On this page</p>
            <nav aria-label="Patient information sections" className="mt-3 space-y-1 border-l border-beige pl-4">
              {navItems.map(([label, id]) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className="block py-0.5 text-[12.5px] leading-snug text-muted transition-colors hover:text-burgundy"
                >
                  {label}
                </a>
              ))}
            </nav>
            <div className="mt-6 rounded-2xl border border-beige bg-ivory p-4">
              <FileText className="h-4 w-4 text-burgundy" aria-hidden />
              <p className="mt-2 text-[12px] font-medium text-ink">Registration form</p>
              <p className="mt-1 text-[11px] leading-relaxed text-muted">
                Save time by completing it before you arrive.
              </p>
              <Button size="sm" variant="secondary" className="mt-3 w-full" onClick={() => setFormOpen(true)}>
                Open form
              </Button>
            </div>
          </aside>

          <div className="min-w-0">
            {/* Before */}
            <section id="before" className="scroll-mt-28">
              <p className="eyebrow mb-4">Before your visit</p>
              <h2 className="font-display text-[28px] leading-snug text-ink sm:text-[34px]">
                A little preparation makes the appointment easier.
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  "Bring a list of medications, including anything bought over the counter.",
                  "Tell us about relevant medical conditions, pregnancy or recent surgery.",
                  "Bring details of previous dental treatment or insurance, if you have them.",
                  "Arrive about ten minutes early to complete registration calmly.",
                  "Eat and drink normally unless we have asked you not to.",
                  "Tell us if you would like a chaperone or extra time.",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2.5 rounded-xl border border-beige bg-ivory/60 p-3.5">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-burgundy" aria-hidden />
                    <span className="text-[12.5px] leading-relaxed text-ink/75">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* First visit */}
            <section id="first-visit" className="mt-14 scroll-mt-28">
              <p className="eyebrow mb-4">Your first appointment</p>
              <h2 className="font-display text-[28px] leading-snug text-ink sm:text-[34px]">
                Four stages, usually around 45 minutes.
              </h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {firstVisit.map((step, index) => (
                  <Reveal key={step.title} delay={index * 0.04}>
                    <div className="h-full rounded-2xl border border-beige bg-white p-5 shadow-soft">
                      <span className="grid h-8 w-8 place-items-center rounded-full bg-burgundy-50 text-[11px] font-semibold text-burgundy">
                        {index + 1}
                      </span>
                      <h3 className="mt-3 font-display text-[19px] text-ink">{step.title}</h3>
                      <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted">{step.text}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Badge tone="ivory">
                  <ClipboardList className="h-3 w-3" aria-hidden /> Written plan included
                </Badge>
                <Badge tone="ivory">
                  <CalendarCheck className="h-3 w-3" aria-hidden /> No treatment on the day unless agreed
                </Badge>
              </div>
            </section>

            {/* Fees */}
            <section id="fees" className="mt-14 scroll-mt-28">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="eyebrow mb-4">Fees</p>
                  <h2 className="font-display text-[28px] leading-snug text-ink sm:text-[34px]">
                    Indicative fees, confirmed in writing.
                  </h2>
                </div>
                <Badge tone="muted">Illustrative pricing</Badge>
              </div>
              <p className="mt-3 max-w-2xl text-[13.5px] leading-relaxed text-muted">
                The figures below demonstrate how a fee schedule would be presented. They are not a quote and must be
                replaced with the practice's current price list. Every plan is itemised before treatment begins.
              </p>
              <div className="mt-5 overflow-hidden rounded-2xl border border-beige">
                <table className="w-full text-left text-[12.5px]">
                  <caption className="sr-only">Indicative treatment fees</caption>
                  <thead className="bg-ivory text-[10px] uppercase tracking-[0.14em] text-muted">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold sm:px-5">
                        Treatment
                      </th>
                      <th scope="col" className="px-4 py-3 text-right font-semibold sm:px-5">
                        Indicative fee
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-beige/80">
                    {fees.map(([label, price]) => (
                      <tr key={label} className="hover:bg-ivory/50">
                        <td className="px-4 py-3 text-ink/80 sm:px-5">{label}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-right font-medium text-ink sm:px-5">{price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-3 flex items-start gap-2 rounded-xl border border-amber-200/70 bg-amber-50/60 px-4 py-3">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" aria-hidden />
                <p className="text-[11.5px] leading-relaxed text-amber-900/80">
                  Demonstration prices only. Complex cases, additional visits, laboratory work and materials may change
                  the estimate. You will always see the full cost before consenting.
                </p>
              </div>
            </section>

            {/* Insurance */}
            <section id="insurance" className="mt-14 scroll-mt-28">
              <p className="eyebrow mb-4">Insurance & payment</p>
              <h2 className="font-display text-[28px] leading-snug text-ink sm:text-[34px]">
                Simple, transparent arrangements.
              </h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {site.payments.map((payment, index) => (
                  <div
                    key={payment.title}
                    className={index === 0 ? "rounded-2xl bg-burgundy p-5 text-white" : "rounded-2xl border border-beige bg-ivory/60 p-5"}
                  >
                    <p className={index === 0 ? "font-display text-[18px] text-white" : "font-display text-[18px] text-ink"}>
                      {payment.title}
                    </p>
                    <p className={index === 0 ? "mt-1.5 text-[12px] leading-relaxed text-white/65" : "mt-1.5 text-[12px] leading-relaxed text-muted"}>
                      {payment.detail}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-2xl border border-beige bg-white p-5">
                <p className="flex items-start gap-3 text-[12.5px] leading-relaxed text-muted">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-burgundy" aria-hidden />
                  We can provide itemised invoices and treatment codes to support insurance reimbursement. Cover varies
                  by policy — please confirm eligibility and pre-authorisation with your insurer. Finance is subject to
                  status and provider approval.
                </p>
              </div>
            </section>

            {/* Nervous */}
            <section id="nervous" className="mt-14 scroll-mt-28">
              <p className="eyebrow mb-4">Nervous patients</p>
              <h2 className="font-display text-[28px] leading-snug text-ink sm:text-[34px]">
                You are in control of the pace.
              </h2>
              <p className="mt-3 max-w-2xl text-[13.5px] leading-relaxed text-muted">
                Dental anxiety is common and entirely understandable. We plan longer appointments, agree stop signals
                and explain each step before it happens. Nothing is done without your consent.
              </p>
              <div className="mt-4">
                <Accordion items={nervousFaqs} defaultOpen={0} />
              </div>
            </section>

            {/* Accessibility */}
            <section id="accessibility" className="mt-14 scroll-mt-28">
              <p className="eyebrow mb-4">Accessibility</p>
              <h2 className="font-display text-[28px] leading-snug text-ink sm:text-[34px]">
                Practical access, without fuss.
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  { icon: Accessibility, text: "Step-free entrance and ground-floor treatment suite." },
                  { icon: Stethoscope, text: "Wheelchair-accessible facilities and transfer support." },
                  { icon: HeartHandshake, text: "Chaperones, support workers and interpreters by arrangement." },
                  { icon: Sparkles, text: "Quiet waiting area, headphones and agreed breaks." },
                ].map((item) => (
                  <div key={item.text} className="flex items-start gap-3 rounded-xl border border-beige p-4">
                    <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-burgundy" aria-hidden />
                    <span className="text-[12.5px] leading-relaxed text-ink/75">{item.text}</span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[11.5px] leading-relaxed text-muted">
                Tell us what would help when you book. We will do our best to arrange it, and we will be honest if we
                cannot.
              </p>
            </section>

            {/* Aftercare */}
            <section id="aftercare" className="mt-14 scroll-mt-28">
              <p className="eyebrow mb-4">After your visit</p>
              <h2 className="font-display text-[28px] leading-snug text-ink sm:text-[34px]">
                Clear instructions, and someone to call.
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {[
                  {
                    title: "Written aftercare",
                    text: "Procedure-specific instructions are given verbally and in writing before you leave.",
                  },
                  {
                    title: "Normal reactions",
                    text: "Mild tenderness or sensitivity can occur. We explain what is expected and what is not.",
                  },
                  {
                    title: "If something worries you",
                    text: "Call the clinic. For swelling affecting breathing or swallowing, seek emergency care.",
                  },
                ].map((item) => (
                  <div key={item.title} className="rounded-2xl bg-ivory p-4">
                    <p className="font-display text-[17px] text-ink">{item.title}</p>
                    <p className="mt-1.5 text-[12px] leading-relaxed text-muted">{item.text}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Registration form */}
            <section id="registration" className="mt-14 scroll-mt-28">
              <p className="eyebrow mb-4">Registration form</p>
              <h2 className="font-display text-[28px] leading-snug text-ink sm:text-[34px]">
                Complete it before you arrive.
              </h2>
              <p className="mt-3 max-w-2xl text-[13.5px] leading-relaxed text-muted">
                This printable form is a demonstration of the information a practice would collect. It is not submitted
                online — print it, complete it at home and bring it with you. Do not email sensitive medical details.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 print:hidden">
                <Button onClick={() => setFormOpen(true)} variant="secondary" iconLeft={<ClipboardList className="h-4 w-4" />}>
                  View printable form
                </Button>
                <Button onClick={() => window.print()} variant="ghost" iconLeft={<Printer className="h-4 w-4" />}>
                  Print this page
                </Button>
              </div>

              {formOpen && <RegistrationForm />}
            </section>
          </div>
        </div>
      </section>

      <CtaBand
        eyebrow="Ready?"
        title="If you have read this far, you are probably ready for a proper conversation."
        description="Request an appointment and we will confirm a time. No obligation to proceed with any treatment."
        secondaryLabel="Read the FAQs"
        secondaryTo="/faq"
      />
    </>
  );
}

function RegistrationForm() {
  const fields = [
    "Full name",
    "Preferred name",
    "Date of birth",
    "Address",
    "Postcode",
    "Telephone",
    "Email",
    "Occupation",
    "GP surgery",
    "Medical conditions",
    "Medications",
    "Allergies",
    "Previous dentist",
    "Insurance provider / policy number",
  ];

  return (
    <div className="mt-5 overflow-hidden rounded-2xl border border-beige bg-white shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-beige bg-ivory px-5 py-4 print:hidden">
        <div>
          <p className="font-display text-[19px] text-ink">New patient registration</p>
          <p className="mt-0.5 text-[11.5px] text-muted">Demonstration form — print and complete by hand.</p>
        </div>
        <Button size="sm" variant="secondary" onClick={() => window.print()} iconLeft={<Printer className="h-3.5 w-3.5" />}>
          Print form
        </Button>
      </div>

      <div className="p-5 sm:p-7">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="font-display text-[22px] text-ink">{site.name}</p>
            <p className="text-[11px] text-muted">
              {site.contact.address.line1}, {site.contact.address.line2}, {site.contact.address.city}{" "}
              {site.contact.address.postcode}
            </p>
          </div>
          <span className="hidden rounded-full border border-beige px-3 py-1 text-[10px] uppercase tracking-[0.12em] text-muted sm:block">
            Confidential
          </span>
        </div>

        <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
          {fields.map((field) => (
            <div key={field} className={field === "Address" || field === "Medical conditions" || field === "Medications" || field === "Allergies" ? "sm:col-span-2" : ""}>
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-ink/60">{field}</p>
              <div className="mt-1.5 h-8 rounded border-b border-beige/90" />
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-4 border-t border-beige pt-5 sm:grid-cols-2">
          <div>
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-ink/60">Signature</p>
            <div className="mt-1.5 h-10 rounded border-b border-beige/90" />
          </div>
          <div>
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-ink/60">Date</p>
            <div className="mt-1.5 h-10 rounded border-b border-beige/90" />
          </div>
        </div>

        <p className="mt-5 text-[10px] leading-relaxed text-muted">
          Information is used to provide dental care and is handled in line with the privacy policy. In this
          demonstration build the form is not collected or stored.
        </p>

        <div className="mt-4 flex items-center gap-2 text-[10.5px] text-muted">
          <CreditCard className="h-3.5 w-3.5 text-rose" aria-hidden />
          Please do not write payment details on this form.
        </div>
      </div>
    </div>
  );
}
