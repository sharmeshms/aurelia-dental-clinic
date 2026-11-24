const targets = [
  ["pixabay", "https://pixabay.com/images/search/dental%20clinic/"],
  ["stocksnap", "https://stocksnap.io/search/dentist"],
  ["burst", "https://burst.shopify.com/photos/search?q=dentist"],
  ["openverse", "https://api.openverse.org/v1/images/?q=modern%20dental%20office&license=cc0,pdm,by&page_size=10"],
];
for (const [name, url] of targets) {
  try {
    const r = await fetch(url, { headers: { "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36" } });
    const t = await r.text();
    console.log(name, r.status, t.length);
    const imgs = [...t.matchAll(/https?:\/\/[^"'\\\s]+\.(?:jpe?g|png|webp)/g)].map((m) => m[0]);
    console.log([...new Set(imgs)].slice(0, 8).join("\n"));
    if (name === "openverse") {
      const j = JSON.parse(t);
      console.log(j.results.map((x) => `${x.title} | ${x.license} | ${x.width}x${x.height} | ${x.url}`).join("\n"));
    }
  } catch (e) { console.log(name, "ERR", e.message); }
}
