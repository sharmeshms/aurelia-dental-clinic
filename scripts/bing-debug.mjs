const q = process.argv[2] ?? "dental clinic interior";
const r = await fetch(`https://www.bing.com/images/search?q=${encodeURIComponent(q)}&form=HDRSC2&first=1`, {
  headers: {
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    "accept-language": "en-GB,en;q=0.9",
  },
});
const html = await r.text();
for (const key of ["murl", "turl", "images.unsplash", "images.pexels", "imgurl"]) {
  const i = html.indexOf(key);
  console.log("KEY", key, "at", i);
  if (i > 0) console.log(html.slice(Math.max(0, i - 200), i + 600).replace(/\s+/g, " "));
}
