import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const queries = ["dentist", "dental", "teeth", "smile", "clinic", "doctor", "portrait", "medical"];
const found = new Map();
for (const q of queries) {
  const url = `https://burst.shopify.com/photos/search?q=${encodeURIComponent(q)}`;
  const r = await fetch(url, { headers: { "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36" } });
  if (!r.ok) { console.log("fail", q, r.status); continue; }
  const html = await r.text();
  const urls = [...html.matchAll(/https:\/\/burst\.shopifycdn\.com\/photos\/[a-z0-9-]+\.jpg/g)].map((m) => m[0]);
  for (const u of urls) if (!found.has(u)) found.set(u, q);
  console.log(q, urls.length);
}
await mkdir("scripts/candidates/burst", { recursive: true });
let i = 0;
for (const [u, q] of found) {
  const name = `${String(i).padStart(2, "0")}-${q}-${path.basename(u)}`;
  const r = await fetch(`${u}?width=1000`);
  if (!r.ok) { console.log("dl fail", u, r.status); continue; }
  await writeFile(`scripts/candidates/burst/${name}`, Buffer.from(await r.arrayBuffer()));
  i++;
}
console.log("downloaded", i, "of", found.size);
