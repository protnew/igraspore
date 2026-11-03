from pathlib import Path
import subprocess, time, json

ROOT = Path(r"C:\Obsidian\New\Projects\08-iGraSpore_V2")
WORK = ROOT / r"09-Docs\out-dev-factory\theme-shots-v29-all\_apkwork"
OUT = ROOT / r"09-Docs\out-dev-factory\theme-shots-v29-all\apk"
OUT.mkdir(parents=True, exist_ok=True)
THEMES = ["classic","phase-contrast","neon-bio","glass-lab","cyberpunk-scanner","haeckel-watercolor","engraving"]

def adb(args):
    return subprocess.check_output(["adb", *args], stderr=subprocess.STDOUT)

def screencap(dest: Path):
    adb(["shell", "screencap", "-p", "/sdcard/igs_shot.png"])
    if dest.exists():
        dest.unlink()
    adb(["pull", "/sdcard/igs_shot.png", str(dest)])
    print("shot", dest.name, dest.stat().st_size)

report=[]
for theme in THEMES:
  for shot in ["pond","bestiary"]:
    signed = WORK / f"signed-{theme}-{shot}.apk"
    if not signed.exists():
      print("MISSING", signed); report.append({"theme":theme,"shot":shot,"error":"missing signed apk"}); continue
    try:
      adb(["shell","am","force-stop","com.igraspore.app"])
      adb(["push", str(signed), "/data/local/tmp/igs-theme.apk"])
      out = adb(["shell","pm","install","-r","-t","/data/local/tmp/igs-theme.apk"]).decode("utf-8","replace").strip()
      print(theme, shot, out)
      adb(["shell","am","start","-n","com.igraspore.app/.MainActivity"])
      time.sleep(14 if shot=="bestiary" else 12)
      dest = OUT / f"apk_{shot}_{theme}.png"
      screencap(dest)
      # validate png header
      head = dest.read_bytes()[:8]
      ok = head.startswith(b"\x89PNG\r\n\x1a\n")
      report.append({"theme":theme,"shot":shot,"file":dest.name,"bytes":dest.stat().st_size,"png":ok})
      print("png", ok)
    except Exception as e:
      print("ERR", theme, shot, e)
      report.append({"theme":theme,"shot":shot,"error":str(e)})

(OUT/"apk-report.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
print("DONE", report)
