# -*- coding: utf-8 -*-
from PIL import Image, ImageDraw, ImageFont
import os, json

ROOT = r"C:\Obsidian\New\Projects\08-iGraSpore_V2"
MOCK = os.path.join(ROOT, r"09-Docs\design-concepts-2026-11-03")
SHOT = os.path.join(ROOT, r"09-Docs\out-dev-factory\theme-shots-v29-all")
OUT = os.path.join(ROOT, r"09-Docs\out-dev-factory\theme-shots-v29-all\side")
os.makedirs(OUT, exist_ok=True)

MAP = [
  ("phase-contrast", "01-phase-contrast-pond.png", "01-phase-contrast-creatures.png"),
  ("haeckel-watercolor", "02-haeckel-watercolor-pond.png", "02-haeckel-watercolor-creatures.png"),
  ("neon-bio", "03-neon-bio-pond.png", "03-neon-bio-creatures.png"),
  ("glass-lab", "07-glass-lab-pond.png", "07-glass-lab-creatures.png"),
  ("engraving", "09-engraving-pond.png", "09-engraving-creatures.png"),
  ("cyberpunk-scanner", "10-cyberpunk-scanner-pond.png", "10-cyberpunk-scanner-creatures.png"),
]

def fit(im, tw, th):
  im = im.convert("RGB")
  r = min(tw/im.width, th/im.height)
  nw, nh = max(1,int(im.width*r)), max(1,int(im.height*r))
  im = im.resize((nw, nh), Image.Resampling.LANCZOS)
  canvas = Image.new("RGB", (tw, th), (20, 20, 24))
  canvas.paste(im, ((tw-nw)//2, (th-nh)//2))
  return canvas

def score_pair(mock, shot):
  # strict crude metric: mean abs channel diff on downscaled 64x64 + structural checks via filename only
  a = mock.resize((64,64), Image.Resampling.BILINEAR).convert("RGB")
  b = shot.resize((64,64), Image.Resampling.BILINEAR).convert("RGB")
  pa, pb = list(a.getdata()), list(b.getdata())
  s = 0.0
  for i in range(len(pa)):
    s += abs(pa[i][0]-pb[i][0]) + abs(pa[i][1]-pb[i][1]) + abs(pa[i][2]-pb[i][2])
  mean = s / (len(pa)*3*255.0)
  # 0 mean => 100%; clamp
  pct = max(0.0, min(100.0, (1.0 - mean) * 100.0))
  return round(pct, 1)

def compose(left, right, label, path):
  W, H = 700, 500
  L = fit(left, W, H)
  R = fit(right, W, H)
  bar = 36
  out = Image.new("RGB", (W*2+16, H+bar), (12,12,16))
  out.paste(L, (0, bar))
  out.paste(R, (W+16, bar))
  d = ImageDraw.Draw(out)
  d.text((12, 8), "MOCKUP | " + label, fill=(200,220,255))
  d.text((W+28, 8), "GAME | " + label, fill=(180,255,200))
  out.save(path, optimize=True)
  return path

report = {"pairs": [], "note": "pct = 100*(1-meanAbsDiff/255) on 64x64 RGB; STRICT lower-is-harsher vs human eye; eye notes override"}
for tid, mp, mc in MAP:
  pond_shot = os.path.join(SHOT, f"pond_{tid}_1400_en.png")
  best_shot = os.path.join(SHOT, f"bestiary_{tid}_1400_en.png")
  mock_p = os.path.join(MOCK, mp)
  mock_c = os.path.join(MOCK, mc)
  row = {"theme": tid}
  if os.path.exists(mock_p) and os.path.exists(pond_shot):
    imM, imS = Image.open(mock_p), Image.open(pond_shot)
    sp = os.path.join(OUT, f"side_pond_{tid}_1400.png")
    compose(imM, imS, tid+" pond", sp)
    row["pond_auto_pct"] = score_pair(imM, imS)
    row["pond_side"] = sp
  if os.path.exists(mock_c) and os.path.exists(best_shot):
    imM, imS = Image.open(mock_c), Image.open(best_shot)
    sp = os.path.join(OUT, f"side_bestiary_{tid}_1400.png")
    compose(imM, imS, tid+" bestiary", sp)
    row["bestiary_auto_pct"] = score_pair(imM, imS)
    row["bestiary_side"] = sp
  report["pairs"].append(row)
  print(tid, row.get("pond_auto_pct"), row.get("bestiary_auto_pct"))

with open(os.path.join(OUT, "side-auto-scores.json"), "w", encoding="utf-8") as f:
  json.dump(report, f, indent=2)
print("DONE", OUT)
