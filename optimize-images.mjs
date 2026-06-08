// Optimisation des images EN PLACE.
// - Plafonne le côté long à 1920px en PRÉSERVANT le ratio (les width/height du HTML
//   encodent le ratio → ils restent valides, aucune modif HTML, CLS préservé).
// - Recompresse JPG (mozjpeg q80), PNG (palette q80), WebP (q80) ; n'écrase QUE si plus petit.
// - Strip des métadonnées (orientation EXIF = 1 sur tout le lot → sûr).
// Usage : npm run optimize:img   (ou : node optimize-images.mjs)
// NB : ré-exécuter sur des images déjà optimisées les recompresse (légère perte) ;
//      à lancer surtout après l'ajout de NOUVELLES images.
import sharp from 'sharp';
import { readdirSync, statSync, readFileSync, writeFileSync } from 'fs';
import { join, extname } from 'path';

sharp.cache(false);
sharp.concurrency(4);

const DIRS = ['img', 'img/ancien-site'];
const MAX = 1920, JPG_Q = 80, PNG_Q = 80, WEBP_Q = 80;

function listFiles(dir) {
  return readdirSync(dir).map(n => join(dir, n)).filter(p => statSync(p).isFile());
}

let totalBefore = 0, totalAfter = 0, changed = 0, skipped = 0;

for (const dir of DIRS) {
  for (const file of listFiles(dir)) {
    const ext = extname(file).toLowerCase();
    if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) continue;
    const input = readFileSync(file);
    const beforeSize = input.length;
    const pipeline = sharp(input, { failOn: 'none' })
      .resize({ width: MAX, height: MAX, fit: 'inside', withoutEnlargement: true });
    try {
      let out;
      if (ext === '.png') out = await pipeline.png({ quality: PNG_Q, compressionLevel: 9, palette: true, effort: 8 }).toBuffer();
      else if (ext === '.webp') out = await pipeline.webp({ quality: WEBP_Q, effort: 5 }).toBuffer();
      else out = await pipeline.jpeg({ quality: JPG_Q, mozjpeg: true }).toBuffer();

      if (out.length < beforeSize) {
        writeFileSync(file, out);
        totalBefore += beforeSize; totalAfter += out.length; changed++;
        console.log(`  ${file}  ${(beforeSize/1024).toFixed(0)}Ko -> ${(out.length/1024).toFixed(0)}Ko  (-${(100*(1-out.length/beforeSize)).toFixed(0)}%)`);
      } else {
        totalBefore += beforeSize; totalAfter += beforeSize; skipped++;
      }
    } catch (e) {
      console.log(`  !! ERREUR ${file}: ${e.message}`);
      totalBefore += beforeSize; totalAfter += beforeSize;
    }
  }
}

console.log('\n=== BILAN ===');
console.log(`Recompressées : ${changed}  |  inchangées (déjà optimales) : ${skipped}`);
console.log(`Total : ${(totalBefore/1024/1024).toFixed(1)} Mo -> ${(totalAfter/1024/1024).toFixed(1)} Mo  (-${(100*(1-totalAfter/totalBefore)).toFixed(0)}%)`);
