const q = process.argv[2] ?? "dental clinic";
const r = await fetch(`https://www.pexels.com/search/${encodeURIComponent(q)}/`, {
  headers: { "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36" },
});
console.log("status", r.status);
const t = await r.text();
console.log("len", t.length);
const matches = [...t.matchAll(/images\.pexels\.com\/photos\/(\d+)\/[^"'\\?\s]+/g)].map((m) => m[0]);
console.log([...new Set(matches)].slice(0, 40).join("\n"));
