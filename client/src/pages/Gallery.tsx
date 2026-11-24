import { useMemo, useState } from "react";
import { ArrowRight, Camera, Info, Sparkles } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { GalleryCard } from "@/components/content/Cards";
import { Lightbox } from "@/components/ui/Lightbox";
import { ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CtaBand } from "@/components/sections/SharedSections";
import { Reveal } from "@/components/ui/Reveal";
import { gallery as staticGallery, type GalleryItem } from "@/data/content";
import { useCollection } from "@/lib/useCollection";
import { useSeo } from "@/lib/seo";
import { cn } from "@/lib/utils";

export default function GalleryPage() {
  useSeo({
    title: "Smile Gallery",
    description:
      "A curated, illustrative gallery of smile aesthetics and clinic interiors at Aurelia Dental Studio. All imagery is representative and not a genuine patient case.",
    image: "/images/smile-woman-2.jpg",
  });

  const { data: items } = useCollection<GalleryItem>("/gallery", staticGallery);
  const [category, setCategory] = useState("All");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const visible = useMemo(
    () => items.filter((item) => item.active !== false && (category === "All" || item.category === category)),
    [items, category],
  );

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(items.filter((item) => item.active !== false).map((item) => item.category)))],
    [items],
  );

  const lightboxItems = visible.map((item) => ({
    src: item.image,
    title: item.title,
    description: item.description,
    badge: item.category,
  }));

  return (
    <>
      <PageHero
        eyebrow="Smile gallery"
        title="A visual sense of the results we work towards."
        description="This gallery is illustrative. It shows the aesthetic direction and clinic environment rather than genuine before-and-after patient cases. Real clinical photography is only published with documented consent."
        crumbs={[{ label: "Gallery" }]}
        image="/images/smile-woman-2.jpg"
        imageAlt="Illustrative portrait of a patient with a natural, bright smile"
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink to="/appointment" iconRight={<ArrowRight className="h-4 w-4" />}>
            Book a consultation
          </ButtonLink>
          <ButtonLink to="/services/dental-veneers" variant="secondary">
            Explore smile design
          </ButtonLink>
        </div>
      </PageHero>

      <section className="bg-white py-12 lg:py-16">
        <div className="container-x">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 hide-scrollbar" role="tablist" aria-label="Gallery categories">
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  role="tab"
                  aria-selected={category === item}
                  onClick={() => setCategory(item)}
                  className={cn(
                    "shrink-0 rounded-full border px-4 py-2 text-[12.5px] font-medium transition-all",
                    category === item
                      ? "border-burgundy bg-burgundy text-white shadow-soft"
                      : "border-beige bg-white text-ink/70 hover:border-rose hover:text-burgundy",
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
            <p className="flex items-center gap-1.5 text-[11.5px] text-muted">
              <Camera className="h-3.5 w-3.5 text-rose" aria-hidden />
              {visible.length} images · illustrative
            </p>
          </div>

          <div className="mt-6 flex items-start gap-2.5 rounded-2xl border border-beige bg-ivory px-5 py-4">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-burgundy" aria-hidden />
            <p className="text-[12px] leading-relaxed text-muted">
              These images are licensed stock photographs used to demonstrate design and aesthetic direction. They do
              not depict Aurelia patients, and they are not before-and-after records. Replace them with consented
              clinical photography before publication.
            </p>
          </div>

          {visible.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-dashed border-beige bg-ivory/60 px-6 py-16 text-center">
              <p className="font-display text-xl text-ink">No images in this category yet</p>
              <button type="button" onClick={() => setCategory("All")} className="link-arrow mt-3">
                View all images <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </button>
            </div>
          ) : (
            <div className="mt-8 columns-1 gap-4 sm:columns-2 lg:columns-3">
              {visible.map((item, index) => (
                <GalleryCard key={item.id} item={item} onOpen={() => setLightbox(index)} />
              ))}
            </div>
          )}

          <Reveal className="mt-10 grid gap-4 rounded-3xl border border-beige bg-ivory p-6 sm:grid-cols-3 sm:p-8">
            {[
              {
                title: "Consent first",
                text: "Genuine patient photography is only shown with documented, specific consent.",
              },
              {
                title: "No guarantees",
                text: "Aesthetic outcomes depend on your anatomy, materials and maintenance. Nothing here promises a result.",
              },
              {
                title: "Planned together",
                text: "Shade, proportion and smile line are discussed and previewed before treatment begins.",
              },
            ].map((item) => (
              <div key={item.title}>
                <Sparkles className="h-4 w-4 text-rose" aria-hidden />
                <p className="mt-2 font-display text-[17px] text-ink">{item.title}</p>
                <p className="mt-1 text-[12px] leading-relaxed text-muted">{item.text}</p>
              </div>
            ))}
          </Reveal>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Badge tone="muted">Illustrative imagery</Badge>
            <Badge tone="ivory">No genuine patient cases</Badge>
            <Badge tone="ivory">Replace before launch</Badge>
          </div>
        </div>
      </section>

      <Lightbox items={lightboxItems} index={lightbox} onClose={() => setLightbox(null)} onNavigate={setLightbox} />

      <CtaBand
        eyebrow="Your smile"
        title="The best preview is a conversation about your own teeth."
        description="Bring photographs or simply describe what you would like to change. We will explain what is realistic for you."
        secondaryLabel="Smile design treatments"
        secondaryTo="/services/dental-veneers"
      />
    </>
  );
}
