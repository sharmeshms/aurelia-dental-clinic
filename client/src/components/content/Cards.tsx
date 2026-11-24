import { Link } from "react-router-dom";
import { ArrowRight, Clock, MapPin } from "lucide-react";
import type { Doctor, GalleryItem, Post, Service, Testimonial } from "@/data/content";
import { Badge } from "@/components/ui/Badge";
import { Rating } from "@/components/ui/Rating";
import { cn, formatShortDate, initials, truncate } from "@/lib/utils";

export function ServiceCard({ service, className }: { service: Service; className?: string }) {
  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-3xl border border-beige/80 bg-white shadow-soft transition-all duration-500 ease-luxe hover:-translate-y-1 hover:border-rose/50 hover:shadow-lift",
        className,
      )}
    >
      <Link to={`/services/${service.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-ivory">
        <img
          src={service.image}
          alt={`${service.name} at Aurelia Dental Studio`}
          className="img-grade h-full w-full object-cover transition-transform duration-700 ease-luxe group-hover:scale-[1.05]"
          loading="lazy"
          width={640}
          height={480}
        />
        <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-burgundy shadow-soft backdrop-blur">
          {service.category}
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="font-display text-[21px] leading-snug text-ink transition-colors group-hover:text-burgundy">
          <Link to={`/services/${service.slug}`}>{service.name}</Link>
        </h3>
        <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{truncate(service.summary, 132)}</p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <span className="inline-flex items-center gap-1.5 text-[11.5px] text-muted">
            <Clock className="h-3.5 w-3.5 text-rose" aria-hidden />
            {service.duration}
          </span>
          <Link
            to={`/services/${service.slug}`}
            className="link-arrow text-[12.5px]"
            aria-label={`Learn more about ${service.name}`}
          >
            View treatment
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  );
}

export function DoctorCard({ doctor, className }: { doctor: Doctor; className?: string }) {
  return (
    <article
      className={cn(
        "group overflow-hidden rounded-3xl border border-beige/80 bg-white shadow-soft transition-all duration-500 ease-luxe hover:-translate-y-1 hover:shadow-lift",
        className,
      )}
    >
      <Link to={`/doctors/${doctor.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-ivory">
        <img
          src={doctor.image}
          alt={`${doctor.name}, ${doctor.designation}`}
          className="img-grade h-full w-full object-cover object-top transition-transform duration-700 ease-luxe group-hover:scale-[1.04]"
          loading="lazy"
          width={640}
          height={800}
        />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-burgundy-deep/55 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </Link>
      <div className="p-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-rose">{doctor.specialisation}</p>
        <h3 className="mt-1.5 font-display text-[21px] leading-snug text-ink">
          <Link to={`/doctors/${doctor.slug}`} className="transition-colors group-hover:text-burgundy">
            {doctor.name}
          </Link>
        </h3>
        <p className="mt-1 text-[12.5px] text-muted">{doctor.designation}</p>
        <div className="mt-4 flex items-center justify-between border-t border-beige/80 pt-3.5">
          <span className="text-[11px] text-muted">{doctor.experience} experience</span>
          <Link to={`/doctors/${doctor.slug}`} className="link-arrow text-[12px]">
            Profile <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  );
}

export function PostCard({
  post,
  variant = "default",
  className,
}: {
  post: Post;
  variant?: "default" | "compact" | "featured";
  className?: string;
}) {
  if (variant === "compact") {
    return (
      <Link
        to={`/blog/${post.slug}`}
        className={cn("group flex gap-4 rounded-2xl p-2 transition-colors hover:bg-ivory", className)}
      >
        <img
          src={post.cover}
          alt=""
          className="img-grade h-20 w-24 shrink-0 rounded-xl object-cover"
          loading="lazy"
        />
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-rose">{post.category}</p>
          <h3 className="mt-1 line-clamp-2 font-display text-[16px] leading-snug text-ink transition-colors group-hover:text-burgundy">
            {post.title}
          </h3>
          <p className="mt-1.5 text-[11px] text-muted">{post.readTime}</p>
        </div>
      </Link>
    );
  }

  if (variant === "featured") {
    return (
      <article className={cn("group grid overflow-hidden rounded-3xl border border-beige/80 bg-white shadow-soft lg:grid-cols-2", className)}>
        <Link to={`/blog/${post.slug}`} className="relative block min-h-[260px] overflow-hidden bg-ivory lg:min-h-[400px]">
          <img
            src={post.cover}
            alt={post.title}
            className="img-grade h-full w-full object-cover transition-transform duration-700 ease-luxe group-hover:scale-[1.04]"
            loading="lazy"
          />
          <span className="absolute left-5 top-5">
            <Badge tone="burgundy">Featured</Badge>
          </span>
        </Link>
        <div className="flex flex-col justify-center p-6 sm:p-9">
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-rose">
            {post.category} · {post.readTime}
          </p>
          <h3 className="mt-3 font-display text-[26px] leading-[1.2] text-ink sm:text-[32px]">
            <Link to={`/blog/${post.slug}`} className="transition-colors group-hover:text-burgundy">
              {post.title}
            </Link>
          </h3>
          <p className="mt-4 text-[14px] leading-relaxed text-muted">{truncate(post.excerpt, 190)}</p>
          <div className="mt-6 flex items-center gap-3 text-[12px] text-muted">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-burgundy-50 text-[10px] font-semibold text-burgundy">
              {initials(post.author)}
            </span>
            <span>
              <span className="block font-medium text-ink">{post.author}</span>
              <span className="block text-[11px]">{formatShortDate(post.date)}</span>
            </span>
          </div>
          <Link to={`/blog/${post.slug}`} className="link-arrow mt-6">
            Read the article <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </article>
    );
  }

  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-3xl border border-beige/80 bg-white shadow-soft transition-all duration-500 ease-luxe hover:-translate-y-1 hover:shadow-lift",
        className,
      )}
    >
      <Link to={`/blog/${post.slug}`} className="relative block aspect-[16/10] overflow-hidden bg-ivory">
        <img
          src={post.cover}
          alt={post.title}
          className="img-grade h-full w-full object-cover transition-transform duration-700 ease-luxe group-hover:scale-[1.04]"
          loading="lazy"
        />
      </Link>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-rose">
          <span>{post.category}</span>
          <span className="h-1 w-1 rounded-full bg-rose/60" aria-hidden />
          <span className="font-medium normal-case tracking-normal text-muted">{post.readTime}</span>
        </div>
        <h3 className="mt-2.5 font-display text-[20px] leading-snug text-ink">
          <Link to={`/blog/${post.slug}`} className="transition-colors group-hover:text-burgundy">
            {post.title}
          </Link>
        </h3>
        <p className="mt-2 text-[13px] leading-relaxed text-muted">{truncate(post.excerpt, 118)}</p>
        <div className="mt-auto flex items-center justify-between pt-5 text-[11.5px] text-muted">
          <span>{formatShortDate(post.date)}</span>
          <Link to={`/blog/${post.slug}`} className="link-arrow text-[12px]">
            Read <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  );
}

export function TestimonialCard({
  testimonial,
  className,
}: {
  testimonial: Testimonial;
  className?: string;
}) {
  return (
    <figure
      className={cn(
        "flex h-full flex-col rounded-3xl border border-beige/80 bg-white p-6 shadow-soft",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <Rating value={testimonial.rating} size="sm" />
        {testimonial.isSample && <Badge tone="muted">Sample review</Badge>}
      </div>
      <blockquote className="mt-4 flex-1 text-[14px] leading-[1.8] text-ink/80">
        “{testimonial.quote}”
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3 border-t border-beige/80 pt-4">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-burgundy-50 text-[11px] font-semibold text-burgundy">
          {testimonial.initials}
        </span>
        <span>
          <span className="block text-[13px] font-medium text-ink">{testimonial.name}</span>
          <span className="block text-[11px] text-muted">
            {testimonial.treatment} · {formatShortDate(testimonial.date)}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}

export function GalleryCard({
  item,
  onOpen,
  className,
}: {
  item: GalleryItem;
  onOpen: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        "group relative mb-4 block w-full break-inside-avoid overflow-hidden rounded-2xl bg-ivory text-left focus-visible:ring-2 focus-visible:ring-burgundy",
        className,
      )}
      aria-label={`View ${item.title}`}
    >
      <img
        src={item.image}
        alt={item.title}
        className="img-grade w-full object-cover transition-transform duration-700 ease-luxe group-hover:scale-[1.04]"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-burgundy-deep/70 via-burgundy-deep/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="absolute inset-x-0 bottom-0 translate-y-2 p-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-rose">{item.category}</p>
        <p className="mt-1 font-display text-lg leading-snug text-white">{item.title}</p>
      </div>
      {item.isIllustrative && (
        <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-burgundy/80 backdrop-blur">
          Illustrative
        </span>
      )}
    </button>
  );
}

export function LocationCard({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-start gap-3 rounded-2xl border border-beige bg-white p-4", className)}>
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-burgundy-50 text-burgundy">
        <MapPin className="h-4 w-4" aria-hidden />
      </span>
      <div>
        <p className="text-[13px] font-medium text-ink">Marylebone, London</p>
        <p className="mt-0.5 text-[12px] text-muted">18 Cavendish Row, W1G 9AA</p>
      </div>
    </div>
  );
}
