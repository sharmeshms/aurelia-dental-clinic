import { Link } from "react-router-dom";
import { Clock, Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { site } from "@/config/site";
import { services } from "@/data/content";

const socialIcons = { instagram: Instagram, facebook: Facebook, linkedin: Linkedin };

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-burgundy-deep text-white">
      <div className="container-x pt-14 lg:pt-20">
        <div className="grid gap-12 border-b border-white/10 pb-14 lg:grid-cols-[1.15fr_1fr]">
          <div className="max-w-md">
            <Logo light />
            <p className="mt-6 font-display text-2xl leading-snug text-white/90">
              Considered dentistry, delivered with warmth.
            </p>
            <p className="mt-4 text-[13.5px] leading-relaxed text-white/50">
              A private practice built around unhurried appointments, honest advice and care that protects your smile
              for the long term.
            </p>
            <div className="mt-7 flex items-center gap-2.5">
              {site.social.map((item) => {
                const Icon = socialIcons[item.icon as keyof typeof socialIcons] ?? Instagram;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-rose hover:text-rose"
                    aria-label={`${site.name} on ${item.label}`}
                  >
                    <Icon className="h-4 w-4" aria-hidden />
                  </a>
                );
              })}
            </div>
          </div>

          <div className="lg:pl-10">
            <p className="eyebrow eyebrow-light mb-4">The Aurelia letter</p>
            <h2 className="font-display text-2xl leading-snug text-white sm:text-[28px]">
              Practical oral health notes, occasionally.
            </h2>
            <p className="mt-2 max-w-sm text-[13px] leading-relaxed text-white/50">
              No daily emails, no sales. Just useful guidance from our clinical team.
            </p>
            <div className="mt-5 max-w-md">
              <NewsletterForm variant="footer" />
            </div>
          </div>
        </div>

        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-rose">Explore</h3>
            <ul className="mt-4 space-y-2.5 text-[13px] text-white/60">
              {[
                ["Our story", "/about"],
                ["All treatments", "/services"],
                ["Our dentists", "/doctors"],
                ["Smile gallery", "/gallery"],
                ["Journal", "/blog"],
                ["Patient stories", "/testimonials"],
              ].map(([label, to]) => (
                <li key={to}>
                  <Link to={to} className="transition-colors hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-rose">Patient care</h3>
            <ul className="mt-4 space-y-2.5 text-[13px] text-white/60">
              {[
                ["Book an appointment", "/appointment"],
                ["Your first visit", "/patient-information"],
                ["Frequently asked questions", "/faq"],
                ["Fees & insurance", "/patient-information#fees"],
                ["Contact the clinic", "/contact"],
                ["Emergency care", "/services/emergency-dental-care"],
              ].map(([label, to]) => (
                <li key={to}>
                  <Link to={to} className="transition-colors hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-rose">Popular treatments</h3>
            <ul className="mt-4 space-y-2.5 text-[13px] text-white/60">
              {services
                .filter((service) =>
                  [
                    "dental-implants",
                    "teeth-whitening",
                    "clear-aligners",
                    "root-canal-treatment",
                    "dental-veneers",
                    "emergency-dental-care",
                  ].includes(service.slug),
                )
                .map((service) => (
                  <li key={service.slug}>
                    <Link to={`/services/${service.slug}`} className="transition-colors hover:text-white">
                      {service.name}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-rose">Visit us</h3>
            <ul className="mt-4 space-y-3.5 text-[13px] text-white/60">
              <li className="flex gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-rose" aria-hidden />
                <span>
                  {site.contact.address.line1}
                  <br />
                  {site.contact.address.line2}, {site.contact.address.city}
                  <br />
                  {site.contact.address.postcode}
                </span>
              </li>
              <li>
                <a href={site.contact.phoneHref} className="flex items-center gap-2.5 transition-colors hover:text-white">
                  <Phone className="h-4 w-4 shrink-0 text-rose" aria-hidden />
                  {site.contact.phone}
                </a>
              </li>
              <li>
                <a href={site.contact.emailHref} className="flex items-center gap-2.5 transition-colors hover:text-white">
                  <Mail className="h-4 w-4 shrink-0 text-rose" aria-hidden />
                  {site.contact.email}
                </a>
              </li>
              <li className="flex gap-2.5">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-rose" aria-hidden />
                <span>
                  Mon–Fri: {site.hours[0].hours}
                  <br />
                  Sat: {site.hours[5].hours}
                  <br />
                  Sun: Closed
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 py-6 text-[11.5px] text-white/60 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {site.legalName}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link to="/privacy-policy" className="transition-colors hover:text-white">
              Privacy policy
            </Link>
            <Link to="/terms" className="transition-colors hover:text-white">
              Terms & conditions
            </Link>
            <Link to="/faq" className="transition-colors hover:text-white">
              FAQs
            </Link>
            <Link to="/admin/login" className="transition-colors hover:text-white">
              Staff login
            </Link>
          </div>
        </div>

        <p className="border-t border-white/5 py-5 text-[10.5px] leading-relaxed text-white/50">
          Demonstration website. Clinic details, clinician profiles, testimonials and imagery are illustrative
          placeholders and must be replaced with verified practice information before publication. This site does not
          claim accreditation or regulatory compliance. Dental treatment suitability and outcomes vary; nothing here is
          a guarantee of results.
        </p>
      </div>
    </footer>
  );
}
