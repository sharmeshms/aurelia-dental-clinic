import { writeFile, mkdir } from "node:fs/promises";

const queries = process.argv.slice(2);
const all = [];
for (const q of queries) {
  for (let page = 0; page < 2; page++) {
    const url = `https://www.bing.com/images/search?q=${encodeURIComponent(q)}&first=${page * 35 + 1}&count=35`;
    const r = await fetch(url, {
      headers: {
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        "accept-language": "en-GB,en;q=0.9",
      },
    });
    if (!r.ok) { console.log("HTTP", r.status, q); continue; }
    const html = await r.text();
    const items = [...html.matchAll(/m="([^"]+)"/g)].map((m) => {
      const raw = m[1].replace(/&quot;/g, '"').replace(/&amp;/g, "&");
      try { return JSON.parse(raw); } catch { return null; }
    }).filter(Boolean);
    for (const it of items) {
      if (!it.murl) continue;
      if (!/images\.unsplash\.com|images\.pexels\.com/.test(it.murl)) continue;
      all.push({ query: q, murl: it.murl, purl: it.purl, title: it.t || "" });
    }
  }
}
const seen = new Set();
const unique = all.filter((x) => (seen.has(x.murl) ? false : (seen.add(x.murl), true)));
await mkdir("scripts/candidates", { recursive: true });
await writeFile("scripts/candidates/candidates.json", JSON.stringify(unique, null, 2));
console.log("found", unique.length);
for (const u of unique) console.log(u.murl.split("?")[0], "|", u.title.slice(0, 70));
