import { mkdir, writeFile } from "node:fs/promises";

const map = {
  "clinic-hero": "1606811841689-23dfddce3e95",
  "clinic-consult": "1588776814546-1ffcf47267a5",
  "clinic-interior-1": "1519494026892-80bbd2d6fd0d",
  "clinic-interior-2": "1628191139360-4083564d03fd",
  "clinic-interior-3": "1600585154340-be6161a56a0c",
  "clinic-interior-4": "1512678080530-7760d81faba6",
  "treatment-general": "1629909613654-28e377c37b09",
  "treatment-implant": "1609840114035-3c981b782dfe",
  "treatment-rct": "1598256989800-fe5f95da9787",
  "treatment-whitening": "1606265752439-1f18756aa5fc",
  "treatment-veneers": "1622253692010-333f2da6031d",
  "treatment-crown": "1551601651-2a8555f1a136",
  "treatment-ortho": "1629909615184-74f495363b67",
  "treatment-aligners": "1580281658626-ee379f3cce93",
  "treatment-braces": "1631815589968-fdb09a223b1e",
  "treatment-pediatric": "1571772996211-2f02c9727629",
  "treatment-wisdom": "1607613009820-a29f7bb81c04",
  "treatment-extraction": "1576091160399-112ba8d25d1d",
  "treatment-gum": "1600170311833-c2cf5280ce49",
  "treatment-cleaning": "1607990281513-2c110a25bd8c",
  "treatment-cosmetic": "1601049541289-9b1b7bbbfe19",
  "treatment-equipment": "1516549655169-df83a0774514",
  "treatment-surgery": "1586773860418-d37222d8fce3",
  "clinic-reception": "1538108149393-fbbd81895907",
  "treatment-consultation": "1622902046580-2b47f47f5471",
  "doctor-1": "1559839734-2b71ea197ec2",
  "doctor-2": "1612349317150-e413f6a5b16d",
  "doctor-3": "1537368910025-700350fe46c7",
  "doctor-4": "1594824476967-48c8b964273f",
  "doctor-5": "1573497019940-1c28c88b4f3e",
  "doctor-6": "1651008376811-b90baee60c1f",
  "smile-1": "1595152772835-219674b2a8a6",
  "smile-2": "1601412436009-d964bd02edbc",
  "smile-3": "1616683693504-3ea7e9ad6fec",
  "smile-4": "1524504388940-b1c1722653e1",
  "smile-5": "1508214751196-bcfd4ca60f91",
  "smile-6": "1545167622-3a6ac756afa4",
  "smile-7": "1531123897727-8f129e1688ce",
  "smile-8": "1488426862026-3ee34a7d66df",
  "portrait-1": "1494790108377-be9c29b29330",
  "portrait-2": "1507003211169-0a1dd7228f2d",
  "portrait-3": "1580489944761-15a19d654956",
  "portrait-4": "1544005313-94ddf0286df2",
  "portrait-5": "1517841905240-472988babdf9",
  "portrait-6": "1534528741775-53994a69daeb",
  "portrait-7": "1500648767791-00dcc994a43e",
  "clinic-detail": "1576091160399-112ba8d25d1d",
  "clinic-lab": "1666214280557-f1b5022eb634",
  "clinic-team": "1631217868264-e5b90bb7e133",
  "clinic-room": "1629909613654-28e377c37b09",
};

await mkdir("client/public/images", { recursive: true });
const entries = Object.entries(map);
let done = 0;
for (const [name, id] of entries) {
  const url = `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1400&q=75`;
  const res = await fetch(url);
  if (!res.ok) { console.log("FAIL", name, res.status); continue; }
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(`client/public/images/${name}.jpg`, buf);
  done++;
}
console.log("downloaded", done, "of", entries.length);
