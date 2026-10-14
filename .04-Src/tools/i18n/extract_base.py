import json, re
from pathlib import Path

root = Path(__file__).resolve().parents[3]
text = (root / ".04-Src/js/config.js").read_text(encoding="utf-8")

def grab(lang):
    m = re.search(r"T\.%s=\{(.+?)\};" % lang, text)
    pairs = re.findall(r"(\w+):'((?:\\'|[^'])*)'", m.group(1))
    out = {}
    for k, v in pairs:
        if "\\u" in v or "\\n" in v:
            v = v.encode("utf-8").decode("unicode_escape")
        out[k] = v.replace("\\'", "'")
    return out

out_dir = root / ".04-Src/i18n"
out_dir.mkdir(exist_ok=True)
en, ru = grab("en"), grab("ru")
(out_dir / "en.json").write_text(json.dumps(en, ensure_ascii=False, indent=2, sort_keys=True) + "\n", encoding="utf-8")
(out_dir / "ru.json").write_text(json.dumps(ru, ensure_ascii=False, indent=2, sort_keys=True) + "\n", encoding="utf-8")
print(len(en), len(ru), set(en) == set(ru))
