
const sharp = require('sharp');
const fs = require('fs');
const svg = fs.readFileSync('icons/icon.svg');
async function gen() {
  for (const size of [192, 256, 384, 512]) {
    await sharp(svg).resize(size, size).png().toFile(`icons/icon-${size}.png`);
    console.log(`icon-${size}.png done`);
  }
  // Maskable variant (with padding)
  await sharp(svg).resize(512, 512, {fit:'inside', background:{r:2,g:40,b:48,alpha:1}}).extend({top:46,left:46,bottom:46,right:46,background:{r:2,g:40,b:48,alpha:1}}).resize(512,512).png().toFile('icons/maskable-512.png');
  console.log('maskable-512.png done');
  // Apple touch icon (180x180, no transparency)
  await sharp(svg).resize(180, 180).flatten({background:'#022830'}).png().toFile('icons/apple-touch-icon.png');
  console.log('apple-touch-icon.png done');
  // Favicon
  await sharp(svg).resize(32, 32).png().toFile('favicon-32.png');
  console.log('favicon done');
}
gen().catch(e => { console.error(e); process.exit(1); });
