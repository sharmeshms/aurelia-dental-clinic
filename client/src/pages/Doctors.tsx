import { useMemo, useState } from "react";
import { ArrowRight, Award, Globe2, Info, Stethoscope } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { DoctorCard } from "@/components/content/Cards";
import { ButtonLink } from "@/components/ui/Button";
import { CtaBand } from "@/components/sections/SharedSections";
import { Stagger, StaggerItem, Reveal } from "@/components/ui/Reveal";
import { doctors as staticDoctors, type Doctor } from "@/data/content";
import { useCollection } from "@/lib/useCollection";
import { useSeo } from "@/lib/seo";
import { cn } from "@/lib/utils";

function focusOf(doctor: Doctor) {
  const value = `${doctor.specialisation} ${doctor.designation}`.toLowerCase();
  if (value.includes("prosthodont")) return "Restorative";
  if (value.includes("implant") || value.includes("oral surgeon")) return "Surgical";
  if (value.includes("orthodont")) return "Orthodontics";
  if (value.includes("cosmetic")) return "Cosmetic";
  if (value.includes("paediatric") || value.includes("children")) return "Children";
  if (value.includes("endodont")) return "Endodontics";
  return "General";
}

const focuses = ["All clinicians", "Restorative", "Surgical", "Orthodontics", "Cosmetic", "Children", "Endodontics"];

export default function DoctorsPage() {
  useSeo({
    title: "Our Dentists",
    description:
      "Meet the clinicians at Aurelia Dental Studio — restorative, surgical, orthodontic, cosmetic, paediatric and endodontic expertise working as one team.",
    image: "/images/doctor-6.jpg",
  });

  const { data: doctors } = useCollection<Doctor>("/doctors", staticDoctors);
  const [focus, setFocus] = useState("All clinicians");

  const filtered = useMemo(
    () =>
      doctors
        .filter((doctor) => doctor.active !== false)
        .filter((doctor) => focus === "All clinicians" || focusOf(doctor) === focus),
    [doctors, focus],
  );

  return (
    <>
      <PageHero
        eyebrow="Our clinicians"
        title="Specialists who think beyond the single tooth."
        description="Six clinicians with different specialisms, one shared standard of care. You can request a particular dentist, or let us match you with the right person for your needs."
        crumbs={[{ label: "Our dentists" }]}
        image="/images/doctor-6.jpg"
        imageAlt="A clinician at Aurelia Dental Studio"
      >
        <div className="flex flex-wrap gap-x-6 gap-y-3 text-[12px] text-muted">
          <span className="flex items-center gap-1.5">
            <Stethoscope className="h-3.5 w-3.5 text-rose" aria-hidden /> {doctors.length} clinicians
          </span>
          <span className="flex items-center gap-1.5">
            <Award className="h-3.5 w-3.5 text-rose" aria-hidden /> Restorative, surgical & orthodontic care
          </span>
          <span className="flex items-center gap-1.5">
            <Globe2 className="h-3.5 w-3.5 text-rose" aria-hidden /> Multilingual team
          </span>
        </div>
      </PageHero>

      <section className="bg-white py-12 lg:py-16">
        <div className="container-x">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 hide-scrollbar" role="tablist" aria-label="Filter by specialism">
              {focuses.map((item) => (
                <button
                  key={item}
                  type="button"
                  role="tab"
                  aria-selected={focus === item}
                  onClick={() => setFocus(item)}
                  className={cn(
                    "shrink-0 rounded-full border px-4 py-2 text-[12.5px] font-medium transition-all",
                    focus === item
                      ? "border-burgundy bg-burgundy text-white shadow-soft"
                      : "border-beige bg-white text-ink/70 hover:border-rose hover:text-burgundy",
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
            <p className="text-[12px] text-muted">
              Showing <span className="font-semibold text-ink">{filtered.length}</span> clinicians
            </p>
          </div>

          <h2 className="sr-only">Our clinicians</h2>
          {filtered.length === 0 ? (
            <div className="mt-10 rounded-3xl border border-dashed border-beige bg-ivory/60 px-6 py-16 text-center">
              <p className="font-display text-xl text-ink">No clinicians match that filter</p>
              <button
                type="button"
                onClick={() => setFocus("All clinicians")}
                className="link-arrow mt-3"
              >
                View all clinicians <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </button>
            </div>
          ) : (
            <Stagger className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((doctor) => (
                <StaggerItem key={doctor.slug}>
                  <DoctorCard doctor={doctor} />
                </StaggerItem>
              ))}
            </Stagger>
          )}

          <Reveal className="mt-8 flex flex-col items-start gap-4 rounded-2xl border border-beige bg-ivory p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-start gap-2.5 text-[12px] leading-relaxed text-muted">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-burgundy" aria-hidden />
              Clinician names, qualifications, experience and photographs are illustrative placeholders. Replace them
              with verified professional details before publishing this website.
            </p>
            <ButtonLink to="/appointment" className="shrink-0" iconRight={<ArrowRight className="h-4 w-4" />}>
              Book with a clinician
            </ButtonLink>
          </Reveal>
        </div>
      </section>

      <CtaBand
        eyebrow="Not sure who to see?"
        title="Tell us what you need and we will match you."
        description="Our reception team can help you choose the right clinician based on your concern, your availability and any preferences you have."
        secondaryLabel="Contact the clinic"
        secondaryTo="/contact"
      />
    </>
  );
}
