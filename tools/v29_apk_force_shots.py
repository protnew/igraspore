from pathlib import Path
import zipfile, shutil, subprocess, os, time, tempfile, re

ROOT = Path(r"C:\Obsidian\New\Projects\08-iGraSpore_V2")
APK0 = ROOT / r"06-DevOps-and-Release\android\android\app\build\outputs\apk\debug\app-debug.apk"
OUT = ROOT / r"09-Docs\out-dev-factory\theme-shots-v29-all\apk"
WORK = ROOT / r"09-Docs\out-dev-factory\theme-shots-v29-all\_apkwork"
OUT.mkdir(parents=True, exist_ok=True)
WORK.mkdir(parents=True, exist_ok=True)

THEMES = ["classic","phase-contrast","neon-bio","glass-lab","cyberpunk-scanner","haeckel-watercolor","engraving"]
KEYSTORE = Path(os.environ["USERPROFILE"]) / ".android" / "debug.keystore"
# find apksigner
bt_root = Path(os.environ["LOCALAPPDATA"]) / "Android" / "Sdk" / "build-tools"
bts = sorted([p for p in bt_root.iterdir() if p.is_dir()], reverse=True)
apksigner = None
zipalign = None
for b in bts:
    c1 = b / "apksigner.bat"
    c2 = b / "zipalign.exe"
    if c1.exists() and c2.exists():
        apksigner, zipalign = c1, c2
        break
if not apksigner:
    raise SystemExit("apksigner not found")
print("apksigner", apksigner)

BOOT = """
<script>
window.__IGS_FORCE_THEME__ = "__THEME__";
window.__IGS_APK_SHOT__ = "__SHOT__";
(function(){
  function dismiss(){
    try{ if(typeof closeIntroCard==="function") closeIntroCard(); }catch(e){}
    ["roleCardOk","tutSkip","resBtn","okBtn"].forEach(function(id){ var el=document.getElementById(id); if(el) try{el.click()}catch(e){} });
    ["introO","roleCard","tutO","pauseO"].forEach(function(id){ var el=document.getElementById(id); if(el){ el.classList.remove("show"); el.style.display="none"; }});
    try{ if(typeof state!=="undefined" && state==="paused") state="playing"; }catch(e){}
    try{ if(window.igsThemeVisuals) igsThemeVisuals.install(); }catch(e){}
  }
  function go(){
    var b=document.getElementById("startBtn");
    if(b) try{ b.click(); }catch(e){}
    var n=0;
    var iv=setInterval(function(){
      n++; dismiss();
      var alive=false; try{ alive=!!(window.player&&player.alive); }catch(e){}
      if(!alive && n<40) return;
      clearInterval(iv);
      try{
        if(window.igsThemeEngine){
          igsThemeEngine.applyThemePond(window.__IGS_FORCE_THEME__);
          igsThemeEngine.applyThemeBestiary(window.__IGS_FORCE_THEME__);
        }
        if(window.igsThemeVisuals) igsThemeVisuals.install();
      }catch(e){}
      dismiss();
      if(window.__IGS_APK_SHOT__==="bestiary"){
        setTimeout(function(){
          try{
            var wb=document.getElementById("bWiki")||document.getElementById("wikiBtnMenu");
            if(wb) wb.click(); else { var w=document.getElementById("wikiO"); if(w) w.className="ov show"; if(typeof buildWiki==="function") buildWiki(); }
            if(window.igsThemeWikiEnhance) igsThemeWikiEnhance();
          }catch(e){}
        }, 600);
      }
    }, 500);
  }
  if(document.readyState==="complete") setTimeout(go, 800);
  else window.addEventListener("load", function(){ setTimeout(go, 800); });
})();
</script>
"""

def make_apk(theme, shot):
    unsigned = WORK / f"unsigned-{theme}-{shot}.apk"
    aligned = WORK / f"aligned-{theme}-{shot}.apk"
    signed = WORK / f"signed-{theme}-{shot}.apk"
    if signed.exists(): signed.unlink()
    if aligned.exists(): aligned.unlink()
    if unsigned.exists(): unsigned.unlink()
    shutil.copy2(APK0, unsigned)
    # read index from apk
    with zipfile.ZipFile(unsigned, "r") as zin:
        names = zin.namelist()
        idx_name = None
        for n in names:
            if n.endswith("assets/public/index.html") or n == "assets/public/index.html":
                idx_name = n; break
        if not idx_name:
            raise SystemExit("index.html not in apk: " + str([n for n in names if "index" in n][:20]))
        html = zin.read(idx_name).decode("utf-8", errors="replace")
        # also ensure theme_engine in apk has hook - may be old; update from disk
        eng_name = None
        for n in names:
            if n.endswith("assets/public/04-Src/js/theme_engine.js"):
                eng_name = n; break
        eng = None
        if eng_name:
            eng = (ROOT / r".04-Src\js\theme_engine.js").read_bytes()
        vis_name = None
        for n in names:
            if n.endswith("assets/public/04-Src/js/theme_visuals.js"):
                vis_name = n; break
        vis = None
        if (ROOT / r".04-Src\js\theme_visuals.js").exists():
            # path may not exist inside apk yet
            pass
        disk_vis = ROOT / r".04-Src\js\theme_visuals.js"
        disk_css = ROOT / "style-themes-v29.css"

    boot = BOOT.replace("__THEME__", theme).replace("__SHOT__", shot)
    if "<!--IGS_APK_BOOT-->" in html:
        html = re.sub(r"<!--IGS_APK_BOOT-->.*?<!--/IGS_APK_BOOT-->", "", html, flags=re.S)
    inject = "<!--IGS_APK_BOOT-->" + boot + "<!--/IGS_APK_BOOT-->"
    if "</body>" in html:
        html = html.replace("</body>", inject + "\n</body>", 1)
    else:
        html = html + inject

    # rebuild zip: copy all, replace index (+engine/visuals/css if present)
    tmp = WORK / f"rebuild-{theme}-{shot}.apk"
    if tmp.exists(): tmp.unlink()
    with zipfile.ZipFile(unsigned, "r") as zin, zipfile.ZipFile(tmp, "w", compression=zipfile.ZIP_DEFLATED) as zout:
        for item in zin.infolist():
            data = zin.read(item.filename)
            if item.filename == idx_name:
                data = html.encode("utf-8")
            elif eng_name and item.filename == eng_name:
                data = eng
            elif item.filename.endswith("assets/public/04-Src/js/theme_visuals.js") and disk_vis.exists():
                data = disk_vis.read_bytes()
            elif item.filename.endswith("assets/public/style-themes-v29.css") and disk_css.exists():
                data = disk_css.read_bytes()
            # keep compress type
            zi = zipfile.ZipInfo(filename=item.filename, date_time=item.date_time)
            zi.compress_type = item.compress_type
            zi.external_attr = item.external_attr
            zout.writestr(zi, data)
        # add missing theme_visuals / css / themes json if absent
        have = set(zin.namelist())
        extras = {
            "assets/public/04-Src/js/theme_visuals.js": disk_vis,
            "assets/public/style-themes-v29.css": disk_css,
        }
        for name, path in extras.items():
            if name not in have and path.exists():
                zout.write(path, name)
                print("added", name)
        themes_dir = ROOT / r".04-Src\data\themes"
        if themes_dir.exists():
            for jf in themes_dir.glob("*.json"):
                name = "assets/public/04-Src/data/themes/" + jf.name
                if name not in have:
                    zout.write(jf, name)
    unsigned.unlink()
    tmp.rename(unsigned)

    # zipalign + sign
    subprocess.check_call([str(zipalign), "-f", "4", str(unsigned), str(aligned)], shell=False)
    subprocess.check_call([
        str(apksigner), "sign", "--ks", str(KEYSTORE), "--ks-pass", "pass:android",
        "--key-pass", "pass:android", "--out", str(signed), str(aligned)
    ], shell=False)
    return signed

ADB = str(Path(os.environ.get("LOCALAPPDATA","")) / "Android" / "Sdk" / "platform-tools" / "adb.exe")
def adb(*args, check=True):
    cmd = [ADB, *args]
    if check:
        return subprocess.check_output(cmd, stderr=subprocess.STDOUT)
    return subprocess.run(cmd, stderr=subprocess.STDOUT, stdout=subprocess.PIPE).stdout

def screencap(dest: Path):
    raw = subprocess.check_output([ADB, "exec-out", "screencap", "-p"])
    # fix CRLF sometimes
    if raw[:8].find(b"\r\n") >= 0:
        raw = raw.replace(b"\r\n", b"\n")
    dest.write_bytes(raw)
    print("shot", dest.name, dest.stat().st_size)

report = []
# install base once then per theme
for theme in THEMES:
  for shot in ["pond", "bestiary"]:
    try:
      signed = make_apk(theme, shot)
      adb("shell", "am", "force-stop", "com.igraspore.app", check=False)
      adb("push", str(signed), "/data/local/tmp/igs-theme.apk")
      out = subprocess.check_output([ADB, "shell", "pm", "install", "-r", "-t", "/data/local/tmp/igs-theme.apk"], stderr=subprocess.STDOUT)
      print(theme, shot, out.decode("utf-8", "replace").strip())
      adb("shell", "am", "start", "-n", "com.igraspore.app/.MainActivity")
      time.sleep(12 if shot=="pond" else 14)
      dest = OUT / f"apk_{shot}_{theme}.png"
      screencap(dest)
      report.append({"theme": theme, "shot": shot, "file": dest.name, "bytes": dest.stat().st_size})
    except Exception as e:
      print("ERR", theme, shot, e)
      report.append({"theme": theme, "shot": shot, "error": str(e)})

import json
(OUT / "apk-report.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
print("DONE", len(report))
