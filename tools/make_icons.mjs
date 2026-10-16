import path from 'path';
import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const sharp = require(path.resolve('.04-Src/node_modules/sharp'));

const R = '06-DevOps-and-Release/android/android/app/src/main/res';
const src = `${R}/mipmap-xxxhdpi/ic_launcher.png`;
const fg = `${R}/mipmap-xxxhdpi/ic_launcher_foreground.png`;
const outDir = '06-DevOps-and-Release/cf-publish/assets/icons';
fs.mkdirSync(outDir, { recursive: true });
const bg = { r: 12, g: 16, b: 32, alpha: 1 };

for (const size of [192, 512]) await sharp(src).resize(size, size).png().toFile(`${outDir}/icon-${size}.png`);
const inner = await sharp(fg).resize(340, 340, { fit: 'contain', background: bg }).png().toBuffer();
await sharp({ create: { width: 512, height: 512, channels: 4, background: bg } })
  .composite([{ input: inner, top: 86, left: 86 }]).png().toFile(`${outDir}/icon-maskable-512.png`);
await sharp(src).resize(1024, 500, { fit: 'cover', position: 'centre' }).png().toFile('09-Docs/store-listing/feature-graphic-1024x500.png');

function sz(p) { const b = fs.readFileSync(p); return b.slice(0, 8).toString('hex') === '89504e470d0a1a0a' ? `${b.readUInt32BE(16)}x${b.readUInt32BE(20)}` : 'not-png'; }
console.log('icons: ' + fs.readdirSync(outDir).join(', '));
for (const f of fs.readdirSync(outDir)) console.log('  ' + f + ' ' + sz(`${outDir}/${f}`));
console.log('feature-graphic ' + sz('09-Docs/store-listing/feature-graphic-1024x500.png'));
