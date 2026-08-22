/**
 * Generates all PWA icons from inline SVG art using sharp.
 * Run once: node scripts/generate-icons.mjs
 */
import sharp from "sharp";
import { mkdirSync } from "node:fs";

const OUT = "public/icons";
mkdirSync(OUT, { recursive: true });

const chartGlyph = (scale = 1, cx = 32, cy = 32) => `
  <g transform="translate(${cx - 32 * scale} ${cy - 32 * scale}) scale(${scale})">
    <path d="M14 44 L26 30 L34 37 L50 18" fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="50" cy="18" r="4.5" fill="#ffffff"/>
  </g>`;

const roundedIcon = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#0a84ff"/>
  ${chartGlyph()}
</svg>`;

// Maskable art must keep the glyph inside the inner 80% safe zone.
const maskableIcon = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" fill="#0a84ff"/>
  ${chartGlyph(0.72, 32, 33)}
</svg>`;

const shortcut = (glyph) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#0a84ff"/>
  ${glyph}
</svg>`;

const SHORTCUTS = {
  "shortcut-new": `<path d="M32 18 V46 M18 32 H46" stroke="#fff" stroke-width="5.5" stroke-linecap="round"/>`,
  "shortcut-dashboard": `
    <rect x="15" y="15" width="15" height="20" rx="3" fill="#fff" opacity="0.85"/>
    <rect x="34" y="15" width="15" height="12" rx="3" fill="#fff" opacity="0.6"/>
    <rect x="15" y="39" width="15" height="10" rx="3" fill="#fff" opacity="0.6"/>
    <rect x="34" y="31" width="15" height="18" rx="3" fill="#fff"/>`,
  "shortcut-compare": `<path d="M24 18 L12 32 L24 46 M40 18 L52 32 L40 46" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
  "shortcut-calculator": `
    <rect x="17" y="13" width="30" height="38" rx="5" fill="#fff" opacity="0.95"/>
    <rect x="22" y="18" width="20" height="8" rx="2" fill="#0a84ff"/>
    <g fill="#0a84ff">
      <circle cx="25" cy="34" r="2.6"/><circle cx="32" cy="34" r="2.6"/><circle cx="39" cy="34" r="2.6"/>
      <circle cx="25" cy="43" r="2.6"/><circle cx="32" cy="43" r="2.6"/><circle cx="39" cy="43" r="2.6"/>
    </g>`,
};

async function render(svg, name, size) {
  await sharp(Buffer.from(svg), { density: 300 })
    .resize(size, size)
    .png()
    .toFile(`${OUT}/${name}.png`);
  console.log(`wrote ${OUT}/${name}.png`);
}

await render(roundedIcon, "icon-192", 192);
await render(roundedIcon, "icon-512", 512);
await render(maskableIcon, "icon-maskable-192", 192);
await render(maskableIcon, "icon-maskable-512", 512);
for (const [name, glyph] of Object.entries(SHORTCUTS)) {
  await render(shortcut(glyph), name, 96);
}
console.log("done");
