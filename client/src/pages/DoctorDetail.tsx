import { Link, useParams } from "react-router-dom";
import {
  ArrowRight,
  Award,
  CalendarDays,
  Check,
  Clock,
  Globe2,
  GraduationCap,
  Info,
  Phone,
  Quote,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { DoctorCard } from "@/components/content/Cards";
import { CtaBand } from "@/components/sections/SharedSections";
import NotFoundPage from "@/pages/NotFound";
import { doctors as staticDoctors, type Doctor } from "@/data/content";
import { site } from "@/config/site";
import { useCollection } from "@/lib/useCollection";
import { useSeo } from "@/lib/seo";

export default function DoctorDetailPage() {
  const { slug } = useParams();
  const { data: doctors, loading } = useCollection<Doctor>("/doctors", staticDoctors);
  const doctor = doctors.find((item) => item.slug === slug) ?? staticDoctors.find((item) => item.slug === slug);

  useSeo({
    title: doctor ? doctor.name : "Clinician not found",
    description: doctor
      ? `${doctor.name} — ${doctor.designation} at Aurelia Dental Studio. Specialising in ${doctor.specialisation}.`
      : undefined,
    image: doctor?.image,
    jsonLd: doctor
      ? {
          "@context": "https://schema.org",
          "@type": "Physician",
          name: doctor.name,
          medicalSpecialty: doctor.specialisation,
          description: doctor.intro.join(" "),
        }
      : undefined,
  });

  if (!doctor) {
    if (loading) {
      return (
        <div className="container-x flex min-h-[50vh] items-center justify-center py-20">
          <p className="text-sm text-muted">Loading profile…</p>
        </div>
      );
    }
    return <NotFoundPage />;
  }

  const colleagues = doctors.filter((item) => item.slug !== doctor.slug).slice(0, 3);

  return (
    <>
      <section className="border-b border-beige/70 bg-ivory">
        <div className="container-x py-8 lg:py-12">
          <Breadcrumbs items={[{ label: "Our dentists", to: "/doctors" }, { label: doctor.name }]} className="mb-8" />
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
            <div className="relative mx-auto w-full max-w-[420px] lg:max-w-none">
              <div className="absolute -right-3 -top-3 h-full w-full rounded-[2rem] border border-rose/40" aria-hidden />
              <div className="relative overflow-hidden rounded-[2rem] bg-beige shadow-soft">
                <img
                  src={doctor.image}
                  alt={`${doctor.name}, ${doctor.designation}`}
                  className="img-grade aspect-[4/5] w-full object-cover object-top"
                  width={760}
                  height={950}
                />
                <div className="absolute left-4 top-4">
                  <Badge tone="ivory">{doctor.experience} experience</Badge>
                </div>
              </div>
            </div>

            <div className="lg:pt-4">
              <p className="eyebrow mb-3">{doctor.specialisation}</p>
              <h1 className="text-balance text-[36px] leading-[1.08] sm:text-[46px]">{doctor.name}</h1>
              <p className="mt-2 text-[15px] text-muted">{doctor.designation}</p>

              <div className="mt-5 flex flex-wrap gap-2">
                {doctor.qualifications.map((qualification) => (
                  <span
                    key={qualification}
                    className="rounded-full border border-beige bg-white px-3 py-1 text-[11.5px] font-medium text-ink/70"
                  >
                    {qualification}
                  </span>
                ))}
                {doctor.languages.map((language) => (
                  <span
                    key={language}
                    className="inline-flex items-center gap-1.5 rounded-full border border-beige bg-white px-3 py-1 text-[11.5px] text-ink/70"
                  >
                    <Globe2 className="h-3 w-3 text-rose" aria-hidden />
                    {language}
                  </span>
                ))}
              </div>

              <div className="prose-luxe mt-6">
                {doctor.intro.map((paragraph) => (
                  <p key={paragraph.slice(0, 30)}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <ButtonLink
                  to={`/appointment?doctor=${doctor.slug}`}
                  iconRight={<ArrowRight className="h-4 w-4" />}
                >
                  Book with {doctor.name.split(" ")[0]} {doctor.name.split(" ")[1]?.replace(/^[A-Z]\.$/, "") ?? ""}
                </ButtonLink>
                <a
                  href={site.contact.phoneHref}
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-burgundy/25 bg-white px-6 text-sm font-medium text-burgundy transition-colors hover:bg-burgundy-50"
                >
                  <Phone className="h-4 w-4" aria-hidden /> Call the clinic
                </a>
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                {[
                  { icon: GraduationCap, label: "Qualifications", value: doctor.qualifications.join(", ") },
                  { icon: Award, label: "Experience", value: doctor.experience },
                  { icon: Clock, label: "Availability", value: "Selected weekdays" },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl border border-beige bg-white p-3.5">
                    <item.icon className="h-4 w-4 text-rose" aria-hidden />
                    <p className="mt-2 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-muted">{item.label}</p>
                    <p className="mt-1 text-[11.5px] leading-snug text-ink">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-14 lg:py-20">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_340px] lg:gap-16">
          <div>
            <Reveal>
              <h2 className="font-display text-[28px] leading-snug sm:text-[32px]">Areas of expertise</h2>
              <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                {doctor.expertise.map((item) => (
                  <div key={item} className="flex items-start gap-2.5 rounded-xl border border-beige/80 bg-ivory/60 p-3.5">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-white text-burgundy shadow-sm">
                      <Check className="h-3 w-3" aria-hidden />
                    </span>
                    <span className="text-[12.5px] leading-relaxed text-ink/75">{item}</span>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal className="mt-10">
              <h2 className="font-display text-[28px] leading-snug sm:text-[32px]">How I work</h2>
              <div className="mt-4 rounded-2xl border border-beige bg-ivory p-6">
                <Quote className="h-5 w-5 text-rose" aria-hidden />
                <p className="mt-3 font-display text-[19px] leading-relaxed text-ink/85">
                  “My job is to make the options understandable enough that you can choose with confidence — including
                  the option to wait or do nothing. Good dentistry should feel like a decision you made, not one that
                  was made for you.”
                </p>
                <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                  {doctor.name} · {doctor.designation}
                </p>
              </div>
            </Reveal>

            <Reveal className="mt-10">
              <h2 className="font-display text-[28px] leading-snug sm:text-[32px]">Availability</h2>
              <p className="mt-2 text-[13px] leading-relaxed text-muted">
                Indicative clinic days. Online requests are confirmed by reception before they become appointments.
              </p>
              <div className="mt-4 overflow-hidden rounded-2xl border border-beige">
                <table className="w-full text-left text-[12.5px]">
                  <thead className="bg-ivory text-[10px] uppercase tracking-[0.14em] text-muted">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Days</th>
                      <th className="px-4 py-3 font-semibold">Usual slots</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-beige/80">
                    {doctor.availability.map((entry, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 align-top font-medium text-ink">{entry.days.join(", ")}</td>
                        <td className="px-4 py-3 text-muted">{entry.slots.join(" · ")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 flex items-start gap-2 text-[11px] leading-relaxed text-muted">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose" aria-hidden />
                Availability is sample data and may change. Please contact the clinic for current times.
              </p>
            </Reveal>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-3xl border border-beige bg-white p-6 shadow-soft">
              <p className="eyebrow mb-3">Appointments</p>
              <h2 className="font-display text-[24px] leading-snug">Request a visit</h2>
              <p className="mt-2 text-[12.5px] leading-relaxed text-muted">
                Choose {doctor.name} in the booking form and select a preferred time. We will confirm availability with
                you directly.
              </p>
              <ButtonLink
                to={`/appointment?doctor=${doctor.slug}`}
                className="mt-4 w-full"
                iconLeft={<CalendarDays className="h-4 w-4" />}
                iconRight={<ArrowRight className="h-4 w-4" />}
              >
                Book an appointment
              </ButtonLink>
              <a
                href={site.contact.phoneHref}
                className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-full border border-burgundy/20 text-sm font-medium text-burgundy transition-colors hover:bg-burgundy-50"
              >
                <Phone className="h-4 w-4" aria-hidden /> {site.contact.phone}
              </a>
            </div>

            <div className="mt-4 rounded-2xl border border-beige bg-ivory p-4">
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-burgundy">Languages</p>
              <p className="mt-2 text-[12.5px] text-ink/75">{doctor.languages.join(", ")}</p>
            </div>

            <div className="mt-4 rounded-2xl border border-beige bg-white p-5">
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-muted">Other clinicians</p>
              <ul className="mt-3 space-y-3">
                {colleagues.map((colleague) => (
                  <li key={colleague.slug}>
                    <Link to={`/doctors/${colleague.slug}`} className="group flex items-center gap-3">
                      <img
                        src={colleague.image}
                        alt=""
                        className="h-9 w-9 rounded-full object-cover object-top"
                        loading="lazy"
                      />
                      <span className="min-w-0">
                        <span className="block truncate text-[12.5px] font-medium text-ink group-hover:text-burgundy">
                          {colleague.name}
                        </span>
                        <span className="block truncate text-[10.5px] text-muted">{colleague.specialisation}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <section className="border-t border-beige/70 bg-ivory py-14 lg:py-20">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow mb-3">The team</p>
              <h2 className="font-display text-[30px] leading-snug sm:text-[36px]">More of our clinicians</h2>
            </div>
            <ButtonLink to="/doctors" variant="secondary" iconRight={<ArrowRight className="h-4 w-4" />}>
              View all
            </ButtonLink>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {colleagues.map((colleague) => (
              <DoctorCard key={colleague.slug} doctor={colleague} />
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        eyebrow="Your first visit"
        title="A consultation with a clinician who has time to listen."
        description="Tell us what you need and we will match you with the right person — or book directly with your preferred clinician."
        secondaryLabel="Patient information"
        secondaryTo="/patient-information"
      />
    </>
  );
}
