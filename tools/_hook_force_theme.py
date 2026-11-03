from pathlib import Path
import shutil

ROOT = Path(r"C:\Obsidian\New\Projects\08-iGraSpore_V2")
te_paths = [
    ROOT / r".04-Src\js\theme_engine.js",
]
for te in te_paths:
    t = te.read_text(encoding="utf-8")
    if "__IGS_FORCE_THEME__" in t:
        print("already hooked")
    else:
        old = "function initThemes() { ensureAnon(); readUrlThemes();"
        new = (
            "function initThemes() { try{ if(w.__IGS_FORCE_THEME__){ "
            "lsSet(LS_P,w.__IGS_FORCE_THEME__); lsSet(LS_B,w.__IGS_FORCE_THEME__); "
            "} }catch(_f){} ensureAnon(); readUrlThemes();"
        )
        if old not in t:
            raise SystemExit("pattern missing")
        te.write_text(t.replace(old, new, 1), encoding="utf-8")
        print("hooked canonical")
# sync
src = ROOT / r".04-Src\js\theme_engine.js"
for dst in [
    ROOT / r"06-DevOps-and-Release\cf-publish\www-release\04-Src\js\theme_engine.js",
    ROOT / r"06-DevOps-and-Release\android\android\app\src\main\assets\public\04-Src\js\theme_engine.js",
]:
    dst.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(src, dst)
    print("copied", dst)
