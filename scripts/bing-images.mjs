const query = process.argv[2] ?? "dental clinic interior";
const site = process.argv[3] ?? "unsplash.com";
const url = `https://www.bing.com/images/search?q=${encodeURIComponent(`site:${site} ${query}`)}&form=HDRSC2&first=1`;
const r = await fetch(url, {
  headers: {
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    "accept-language": "en-GB,en;q=0.9",
  },
});
console.log("status", r.status, "len", (await r.clone().text()).length);
const html = await r.text();
const ids = [...html.matchAll(/images\.unsplash\.com\/(?:flagged\/)?photo-([0-9]+-[a-z0-9]+)/gi)].map((m) => m[1]);
console.log("unsplash ids:", [...new Set(ids)].join(" "));
const pexels = [...html.matchAll(/images\.pexels\.com\/photos\/(\d+)\/([a-z0-9-]+\.(?:jpe?g|png))/gi)].map((m) => `${m[1]}/${m[2]}`);
console.log("pexels:", [...new Set(pexels)].slice(0, 30).join("\n"));
