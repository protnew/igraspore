# -*- coding: utf-8 -*-
"""DEV-FACTORY wall-clock session log. Start once, finish once.

Usage from execute_code (edit MODE/KIND then run the file, or paste this file):

    MODE = "start"   # or "finish"
    KIND = "analysis"  # analysis | analysis-then-dev | dev | dev10 | test11 | gate12 | night99
    ONE_LINE = ""    # finish only
    FILES = []       # finish only, absolute C:\\ paths

CLI: python session_log.py start --kind analysis
     python session_log.py finish --kind analysis --one-line "PRIORITY_LIST 12 rows" --file C:\\x.md

Never writes if workspace is C:\\. Roles 01-09 must not call this.
Duration = time.time() delta, integer seconds. Clocks = local with offset AND UTC.
"""
from __future__ import annotations

import json
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

MODE = "start"
KIND = "analysis"
ONE_LINE = ""
FILES = []


def _now():
    local = datetime.now().astimezone()
    utc = datetime.now(timezone.utc)
    return local, utc, time.time()


def _fmt_local(dt):
    return dt.strftime("%Y-%m-%d %H:%M:%S %z")


def _fmt_utc(dt):
    return dt.strftime("%Y-%m-%d %H:%M:%S UTC")


def _human(sec):
    sec = int(sec)
    if sec < 0:
        sec = 0
    h, r = divmod(sec, 3600)
    m, s = divmod(r, 60)
    if h:
        return "%dч %02dм %02dс" % (h, m, s)
    if m:
        return "%dм %02dс" % (m, s)
    return "%dс" % s


def _workspace():
    cwd = Path.cwd().resolve()
    roots = {Path("C:/").resolve(), Path("C:\\").resolve(), Path("/").resolve()}
    if cwd in roots:
        return None, "workspace is disk root, log skipped"
    return cwd, None


def _log_dir(ws: Path) -> Path:
    if (ws / "02-AI-and-Data").is_dir():
        d = ws / "02-AI-and-Data" / "02-Sessions-Logs"
        d.mkdir(parents=True, exist_ok=True)
        return d
    if (ws / "09-Docs").is_dir():
        d = ws / "09-Docs" / "out-dev-factory" / "session-logs"
        d.mkdir(parents=True, exist_ok=True)
        return d
    d = ws / "out-dev-factory" / "session-logs"
    d.mkdir(parents=True, exist_ok=True)
    return d


def _stamp_path(d: Path) -> Path:
    return d / "_active.json"


def _write_md(path: Path, data: dict):
    files = data.get("files") or []
    files_txt = "\n".join("- %s" % f for f in files) if files else "- (none)"
    body = "\n".join([
        "# session log",
        "",
        "- kind: %s" % data.get("kind"),
        "- status: %s" % data.get("status"),
        "- start_local: %s" % data.get("start_local"),
        "- start_utc: %s" % data.get("start_utc"),
        "- finish_local: %s" % (data.get("finish_local") or ""),
        "- finish_utc: %s" % (data.get("finish_utc") or ""),
        "- duration_sec: %s" % data.get("duration_sec"),
        "- duration: %s" % (data.get("duration") or ""),
        "- workspace: %s" % data.get("workspace"),
        "- one_line: %s" % (data.get("one_line") or ""),
        "",
        "## files",
        files_txt,
        "",
    ])
    path.write_text(body, encoding="utf-8")


def start(kind=None):
    kind = kind or KIND
    ws, err = _workspace()
    if err:
        print("LOG SKIP: %s" % err)
        return None
    d = _log_dir(ws)
    local, utc, unix = _now()
    stem = local.strftime("%Y-%m-%d_%H%M%S") + "_" + kind
    data = {
        "kind": kind,
        "status": "running",
        "start_unix": unix,
        "start_local": _fmt_local(local),
        "start_utc": _fmt_utc(utc),
        "finish_local": "",
        "finish_utc": "",
        "duration_sec": None,
        "duration": "",
        "workspace": str(ws),
        "one_line": "",
        "files": [],
        "md": str(d / (stem + ".md")),
        "json": str(d / (stem + ".json")),
    }
    _stamp_path(d).write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    _write_md(Path(data["md"]), data)
    Path(data["json"]).write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    print("СТАРТ: %s" % data["start_local"])
    print("СТАРТ_UTC: %s" % data["start_utc"])
    print("ЛОГ: %s (status=running)" % data["md"])
    return data


def finish(kind=None, one_line="", files=None):
    kind = kind or KIND
    one_line = one_line or ONE_LINE
    files = list(files if files is not None else FILES)
    ws, err = _workspace()
    if err:
        print("LOG SKIP: %s" % err)
        return None
    d = _log_dir(ws)
    sp = _stamp_path(d)
    local, utc, unix = _now()
    if sp.exists():
        data = json.loads(sp.read_text(encoding="utf-8"))
    else:
        data = {
            "kind": kind,
            "status": "finished",
            "start_unix": None,
            "start_local": "MISSING_START",
            "start_utc": "MISSING_START",
            "workspace": str(ws),
            "md": str(d / (local.strftime("%Y-%m-%d_%H%M%S") + "_" + kind + ".md")),
            "json": str(d / (local.strftime("%Y-%m-%d_%H%M%S") + "_" + kind + ".json")),
        }
        print("LOG WARN: no start stamp, duration unknown")
    start_unix = data.get("start_unix")
    duration_sec = int(round(unix - start_unix)) if isinstance(start_unix, (int, float)) else None
    data["kind"] = kind or data.get("kind")
    data["status"] = "finished"
    data["finish_local"] = _fmt_local(local)
    data["finish_utc"] = _fmt_utc(utc)
    data["duration_sec"] = duration_sec
    data["duration"] = _human(duration_sec) if duration_sec is not None else "unknown"
    data["one_line"] = one_line
    data["files"] = files
    data["workspace"] = str(ws)
    Path(data["md"]).parent.mkdir(parents=True, exist_ok=True)
    _write_md(Path(data["md"]), data)
    Path(data["json"]).write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    if sp.exists():
        sp.unlink()
    print("СТАРТ: %s" % data.get("start_local"))
    print("ФИНИШ: %s" % data["finish_local"])
    if duration_sec is None:
        print("ДЛИЛАСЬ: unknown (нет штампа старта)")
    else:
        print("ДЛИЛАСЬ: %s  (%d сек)" % (data["duration"], duration_sec))
    print("ФАЙЛ: %s" % data["md"])
    return data


def _cli(argv):
    global MODE, KIND, ONE_LINE, FILES
    if len(argv) >= 2:
        MODE = argv[1]
    i = 2
    files = []
    one = ""
    kind = KIND
    while i < len(argv):
        if argv[i] == "--kind" and i + 1 < len(argv):
            kind = argv[i + 1]
            i += 2
        elif argv[i] == "--one-line" and i + 1 < len(argv):
            one = argv[i + 1]
            i += 2
        elif argv[i] == "--file" and i + 1 < len(argv):
            files.append(argv[i + 1])
            i += 2
        else:
            i += 1
    KIND = kind
    ONE_LINE = one
    FILES = files
    if MODE == "finish":
        finish(kind=kind, one_line=one, files=files)
    else:
        start(kind=kind)


if __name__ == "__main__":
    if len(sys.argv) > 1:
        _cli(sys.argv)
    else:
        if MODE == "finish":
            finish()
        else:
            start()
