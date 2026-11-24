import { ArrowRight, Clock, Mail, MapPin, MessageCircle, Phone, ShieldAlert, Sparkles } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { ContactForm } from "@/components/forms/ContactForm";
import { ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { FaqSection, LocationSection, CtaBand } from "@/components/sections/SharedSections";
import { site, fullAddress, whatsappLink } from "@/config/site";
import { useSeo } from "@/lib/seo";

const quickFaqs = [
  {
    q: "How quickly will I hear back?",
    a: "We aim to reply to messages within one working day. Appointment requests are usually acknowledged the same working day, but the time is only confirmed once our team has spoken with you.",
  },
  {
    q: "Can I book without calling?",
    a: "Yes. Use the online appointment request form and choose a preferred date, time and clinician. Reception will then confirm the exact appointment with you.",
  },
  {
    q: "What if I need urgent help?",
    a: "Call the clinic as early as possible — we hold urgent slots each day. If you have facial swelling affecting breathing or swallowing, or significant trauma, seek emergency medical care immediately.",
  },
];

export default function ContactPage() {
  useSeo({
    title: "Contact the Clinic",
    description:
      "Get in touch with Aurelia Dental Studio in Marylebone, London. Call, email, message on WhatsApp or send an enquiry — we aim to reply within one working day.",
    image: "/images/clinic-reception.jpg",
  });

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="A real conversation, with real people."
        description="Call, email or send a message and a member of our reception team will get back to you. For appointments, the request form is usually quickest."
        crumbs={[{ label: "Contact" }]}
        image="/images/clinic-reception.jpg"
        imageAlt="The calm reception area at Aurelia Dental Studio"
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink to="/appointment" iconRight={<ArrowRight className="h-4 w-4" />}>
            Request an appointment
          </ButtonLink>
          <a
            href={site.contact.phoneHref}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-burgundy/25 bg-white px-6 text-sm font-medium text-burgundy transition-colors hover:bg-burgundy-50"
          >
            <Phone className="h-4 w-4" aria-hidden /> {site.contact.phone}
          </a>
        </div>
      </PageHero>

      <section className="bg-white py-14 lg:py-20">
        <div className="container-x grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <div className="rounded-3xl border border-beige bg-white p-6 shadow-soft sm:p-8">
            <p className="eyebrow mb-4">Send a message</p>
            <h2 className="font-display text-[28px] leading-snug text-ink sm:text-[32px]">
              Tell us how we can help.
            </h2>
            <p className="mt-2 max-w-lg text-[13.5px] leading-relaxed text-muted">
              Please do not include detailed medical information in this form. For clinical questions, a consultation
              or a phone call is the safer route.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl border border-beige bg-ivory p-6">
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-muted">Direct lines</p>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href={site.contact.phoneHref} className="group flex items-start gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-burgundy text-white">
                      <Phone className="h-4 w-4" aria-hidden />
                    </span>
                    <span>
                      <span className="block text-[11px] uppercase tracking-[0.12em] text-muted">Reception</span>
                      <span className="block text-[15px] font-medium text-ink group-hover:text-burgundy">
                        {site.contact.phone}
                      </span>
                      <span className="block text-[11.5px] text-muted">Mon–Fri, clinic hours</span>
                    </span>
                  </a>
                </li>
                <li>
                  <a href={site.contact.emailHref} className="group flex items-start gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-burgundy shadow-soft">
                      <Mail className="h-4 w-4" aria-hidden />
                    </span>
                    <span>
                      <span className="block text-[11px] uppercase tracking-[0.12em] text-muted">Email</span>
                      <span className="block break-all text-[14px] font-medium text-ink group-hover:text-burgundy">
                        {site.contact.email}
                      </span>
                      <span className="block text-[11.5px] text-muted">Replies within one working day</span>
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="group flex items-start gap-3"
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-burgundy shadow-soft">
                      <MessageCircle className="h-4 w-4" aria-hidden />
                    </span>
                    <span>
                      <span className="block text-[11px] uppercase tracking-[0.12em] text-muted">WhatsApp</span>
                      <span className="block text-[14px] font-medium text-ink group-hover:text-burgundy">
                        Message the clinic
                      </span>
                      <span className="block text-[11.5px] text-muted">Non-urgent questions only</span>
                    </span>
                  </a>
                </li>
              </ul>
            </div>

            <div className="rounded-3xl border border-beige bg-white p-6 shadow-soft">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-rose" aria-hidden />
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-muted">The studio</p>
              </div>
              <p className="mt-3 font-display text-[20px] leading-snug text-ink">{site.name}</p>
              <p className="mt-1 text-[13px] leading-relaxed text-muted">{fullAddress}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <ButtonLink
                  to={site.contact.directionsUrl}
                  external
                  size="sm"
                  variant="secondary"
                  iconRight={<ArrowRight className="h-3.5 w-3.5" />}
                >
                  Directions
                </ButtonLink>
                <ButtonLink to="/appointment" size="sm">
                  Book a visit
                </ButtonLink>
              </div>
              <p className="mt-4 border-t border-beige pt-3 text-[11.5px] leading-relaxed text-muted">
                {site.contact.parkingNote}
              </p>
            </div>

            <div className="rounded-3xl border border-beige bg-white p-6">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-rose" aria-hidden />
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-muted">Opening hours</p>
              </div>
              <ul className="mt-3 divide-y divide-beige/80">
                {site.hours.map((entry) => (
                  <li key={entry.day} className="flex items-center justify-between py-2 text-[12.5px]">
                    <span className="text-ink/80">{entry.day}</span>
                    <span className={entry.closed ? "text-muted" : "font-medium text-ink"}>{entry.hours}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 flex items-center gap-1.5 text-[11px] text-muted">
                <Sparkles className="h-3 w-3 text-rose" aria-hidden /> Evening and Saturday appointments available.
              </p>
            </div>

            <div className="rounded-3xl border border-rose/30 bg-rose/5 p-6">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-burgundy" aria-hidden />
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-burgundy">
                  Urgent dental care
                </p>
              </div>
              <p className="mt-2 text-[12.5px] leading-relaxed text-muted">{site.emergency.note}</p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <a href={site.contact.phoneHref} className="link-arrow text-[12.5px]">
                  <Phone className="h-3.5 w-3.5" aria-hidden /> Call now
                </a>
                <Badge tone="warning">Do not wait for email</Badge>
              </div>
            </div>

            <p className="px-1 text-[10.5px] leading-relaxed text-muted">
              Contact details, social links and the address shown are placeholders for this demonstration website.
              Replace them in <code className="rounded bg-ivory px-1 py-0.5">client/src/config/site.ts</code>.
            </p>
          </div>
        </div>
      </section>

      <LocationSection />

      <FaqSection
        items={quickFaqs}
        eyebrow="Before you write"
        title="A few quick answers"
        description="The full help centre covers appointments, fees, treatments and urgent care."
        linkLabel="All questions"
        linkTo="/faq"
        tone="ivory"
        aside={
          <div className="rounded-2xl border border-beige bg-white p-4">
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-burgundy">Prefer to book?</p>
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted">
              The online request form takes about two minutes.
            </p>
            <ButtonLink to="/appointment" size="sm" className="mt-3 w-full">
              Request an appointment
            </ButtonLink>
          </div>
        }
      />

      <CtaBand
        eyebrow="Visit us"
        title="We would be glad to meet you."
        description="A first visit is a conversation, not a commitment. Tell us what you need and we will take it from there."
        secondaryLabel="Patient information"
        secondaryTo="/patient-information"
      />
    </>
  );
}
