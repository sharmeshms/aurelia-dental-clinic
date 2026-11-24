import { useEffect } from "react";
import { site } from "@/config/site";

type SeoInput = {
  title?: string;
  description?: string;
  image?: string;
  type?: "website" | "article";
  noIndex?: boolean;
  jsonLd?: Record<string, unknown>;
};

function setMeta(attr: "name" | "property", key: string, content: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function setLink(rel: string, href: string) {
  let tag = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!tag) {
    tag = document.createElement("link");
    tag.setAttribute("rel", rel);
    document.head.appendChild(tag);
  }
  tag.setAttribute("href", href);
}

export function useSeo({
  title,
  description,
  image,
  type = "website",
  noIndex,
  jsonLd,
}: SeoInput) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${site.name}` : site.seo.defaultTitle;
    const desc = description ?? site.seo.defaultDescription;
    const ogImage = image ?? site.seo.ogImage;
    const url = window.location.href;

    document.title = fullTitle;
    setMeta("name", "description", desc);
    setMeta("name", "robots", noIndex ? "noindex, nofollow" : "index, follow");
    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", desc);
    setMeta("property", "og:type", type);
    setMeta("property", "og:url", url);
    setMeta("property", "og:image", ogImage.startsWith("http") ? ogImage : `${window.location.origin}${ogImage}`);
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", desc);
    setLink("canonical", url);

    const id = "page-jsonld";
    document.getElementById(id)?.remove();
    if (jsonLd) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = id;
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }

    return () => {
      if (jsonLd) document.getElementById(id)?.remove();
    };
  }, [title, description, image, type, noIndex, jsonLd]);
}
