// shots_manifest.mjs — rebuild shots-manifest.json (path|bytes|sha256) for all png under the shots root.
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
const ROOT = process.cwd();
const root = path.join(ROOT, '09-Docs', 'out-dev-factory', 'shots-release-ready-2026-10-14');
const files = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.png$/i.test(e.name)) {
      const b = fs.readFileSync(p);
      files.push({ path: path.relative(root, p).split(path.sep).join('/'), bytes: b.length, sha256: crypto.createHash('sha256').update(b).digest('hex') });
    }
  }
})(root);
files.sort((a, b) => a.path < b.path ? -1 : 1);
const lab = files.filter((f) => f.path.startsWith('lab/')).length;
fs.writeFileSync(path.join(root, 'shots-manifest.json'), JSON.stringify({ schema: 'shots-manifest/1', generated: new Date().toISOString(), root: path.relative(ROOT, root).split(path.sep).join('/'), count: files.length, files }, null, 1) + '\n');
console.log('manifest count=' + files.length + ' lab=' + lab);
