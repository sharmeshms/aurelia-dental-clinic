/**
 * Regenerates client/public/sitemap.xml from the editorial content files.
 *
 * Usage: npm run sitemap
 * Set SITE_URL to your production origin before generating the final sitemap.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (name) => JSON.parse(fs.readFileSync(path.join(root, "content", name), "utf8"));

const services = read("services.json");
const doctors = read("doctors.json");
const posts = read("posts.json");

const base = (process.env.SITE_URL || "https://www.aureliadental.studio").replace(/\/$/, "");
const today = new Date().toISOString().slice(0, 10);

const staticPages = [
  ["/", 1.0, "weekly"],
  ["/about", 0.7, "monthly"],
  ["/services", 0.9, "monthly"],
  ["/doctors", 0.8, "monthly"],
  ["/appointment", 0.9, "monthly"],
  ["/patient-information", 0.7, "monthly"],
  ["/gallery", 0.6, "monthly"],
  ["/testimonials", 0.6, "monthly"],
  ["/blog", 0.8, "weekly"],
  ["/contact", 0.7, "monthly"],
  ["/faq", 0.6, "monthly"],
  ["/privacy-policy", 0.3, "yearly"],
  ["/terms", 0.3, "yearly"],
];

const urls = [
  ...staticPages,
  ...services.filter((item) => item.active !== false).map((item) => [`/services/${item.slug}`, 0.8, "monthly"]),
  ...doctors.filter((item) => item.active !== false).map((item) => [`/doctors/${item.slug}`, 0.6, "monthly"]),
  ...posts.filter((item) => item.active !== false).map((item) => [`/blog/${item.slug}`, 0.7, "monthly"]),
];

const body = urls
  .map(
    ([url, priority, frequency]) =>
      `  <url>\n    <loc>${base}${url}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${frequency}</changefreq>\n    <priority>${priority.toFixed(1)}</priority>\n  </url>`,
  )
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;

const output = path.join(root, "client", "public", "sitemap.xml");
fs.writeFileSync(output, xml, "utf8");
console.log(`[sitemap] Wrote ${urls.length} URLs to ${path.relative(root, output)} (base: ${base})`);
