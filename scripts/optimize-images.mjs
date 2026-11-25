import sharp from "sharp";
import { access } from "node:fs/promises";

const sources = [
  ["swag-screenshot.png", "swag"],
  ["sahara-screenshot.png", "sahara"],
  ["aironix-screenshot.png", "aironix"],
  ["interiors-source.jpg", "interiors"],
  ["corporate-source.jpg", "corporate"],
  ["education-source.jpg", "education"],
];

for (const [file, name] of sources) {
  const source = `assets/source-images/${file}`;
  await access(source);
  await sharp(source)
    .resize({ width: 1400, withoutEnlargement: true })
    .webp({ quality: 85 })
    .toFile(`public/images/${name}.webp`);
  await sharp(source)
    .resize({ width: 700, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(`public/images/${name}-small.webp`);
}
