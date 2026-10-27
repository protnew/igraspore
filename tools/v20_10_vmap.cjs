// v20.10: maps the vcheck metrics to V01–V44 statuses; writes status.json + status.md
const fs = require('fs'), path = require('path');
module.exports = function (S, OUT, LANGS, VPS) {
  const g = (k, st) => (S[k] && S[k][st]) || null;
  const keys = Object.keys(S), mobK = keys.filter(k => +k.split('_')[1] < 600), deskK = keys.filter(k => +k.split('_')[1] >= 600);
  const nonEn = keys.filter(k => !k.startsWith('en_'));
  const EN = /\b(Exit\?|Progress of this life|Your cell died|alive|glide|drift|colony|Language|Global|More)\b/;
  const res = [];
  const add = (id, status, ev, file) => res.push({ id, status, ev: typeof ev === 'string' ? ev : JSON.stringify(ev), file: file || '' });
  const all = (ks, st, fn) => { const bad = []; let f = ''; for (const k of ks) { const m = g(k, st); if (!m || m.err) { bad.push(k + ':nosnap'); continue; } f = f || m.file; const r = fn(m, k); if (r) bad.push(k + ':' + r); } return { bad, f }; };
  const auto = (id, ks, st, fn, okMsg) => { const { bad, f } = all(ks, st, fn); add(id, bad.length ? 'FAIL' : 'PASS', bad.length ? bad.slice(0, 4).join(' | ') : okMsg, f); };
  const man = (id, why, k, st) => add(id, 'MANUAL', why, (g(k, st) || {}).file);
  man('V01', 'player-cell plaque: look at the screenshot (not measurable from DOM, canvas)', mobK[0], 'game');
  auto('V02', keys, 'menu', m => m.ids.pauseBtn && m.ids.pauseBtn.vis ? 'pauseBtn visible in menu' : '', '#pauseBtn hidden in menu (all lang×vp)');
  auto('V03', mobK, 'game', m => { const n = ['pauseBtn', 'bPause'].filter(i => m.ids[i] && m.ids[i].vis).length; return n > 1 ? n + ' pause buttons' : ''; }, '≤1 pause button visible at 390');
  man('V04', 'death counters: check Starved+Eaten+Other=Dead in deadStats text', mobK[0], 'death');
  auto('V05', nonEn, 'exit', m => /Exit\?|Progress of this life|^No$|^Yes$/.test([m.t.ecT, m.t.ecMsg, m.t.ecNo, m.t.ecYes].join('\n')) ? 'EN: ' + m.t.ecT + '/' + m.t.ecNo : (m.ovs.includes('exitConfirm') ? '' : 'exit dialog not shown'), 'Exit dialog translated');
  auto('V06', nonEn, 'pause', m => { if (/^(Exit|More)$/.test(m.t.pExit) || /^More$/.test(m.t.pMore)) return 'EN ' + m.t.pExit + '/' + m.t.pMore; const mb = m.pauseBtns.find(x => x[0] === '#pMore'); return mb && mb[3] !== 'center' ? 'pMore align ' + mb[3] : ''; }, 'pExit/pMore translated, centered');
  auto('V07', nonEn, 'death', m => !m.ovs.includes('deadO') ? 'deadO not shown' : (/Your cell died/.test(m.t.deadT || '') ? 'EN title' : ''), 'death title translated');
  auto('V08', mobK, 'help', m => /WASD|LMB|Space|колес|wheel/i.test(m.t.helpBody || '') ? 'desktop keys in help' : (m.t.helpBody ? '' : 'help empty'), 'touch help at 390');
  { const bad = []; let f = ''; for (const k of keys) for (const st of ['menu', 'help', 'settings', 'wiki', 'pause', 'exit', 'death']) { const m = g(k, st); if (!m || m.err) continue; f = f || m.file;
      // menuO is the base screen: hidden under a full-screen opaque overlay it is not a visible stack
      const top = m.ovs.filter(x => x !== 'menuO' && x !== 'introO'); const covered = top.some(x => m.cover[x] && m.cover[x].full && m.cover[x].alpha >= 0.95);
      const o = m.ovs.filter(x => x !== 'introO' && !(x === 'menuO' && covered)); const allow = st === 'exit' ? 2 : 1; if (o.length > allow) bad.push(k + ':' + st + ':' + o.join('+')); }
    add('V09', bad.length ? 'FAIL' : 'PASS', bad.length ? bad.slice(0, 5).join(' | ') : 'one overlay at a time (exit = pause+confirm by design)', f); }
  auto('V10', mobK, 'settings', m => { const o = m.ovf.filter(x => /^setO>/.test(x)); return o.length ? o.slice(0, 3).join(',') : ''; }, 'no overflow in settings at 390');
  auto('V11', keys, 'death', m => m.cover.deadO && !m.cover.deadO.full ? 'deadO partial ' + m.cover.deadO.r : '', 'death backdrop covers full viewport');
  man('V12', 'old AAB/APK build issue; AAB rebuild is fork R5 (waiting for Alexey)', mobK[0], 'pause');
  auto('V13', keys, 'menu', m => { const b = m.diffBtns.filter(x => x[1] > 0 && (x[1] < 44 || x[2] < 13)); return b.length ? b.slice(0, 3).map(x => x.join(':')).join(',') : ''; }, 'difficulty buttons ≥44px, ≥13px');
  auto('V14', mobK, 'menu', m => { const o = m.ovf.filter(x => /help|set|wiki|Btn/i.test(x)); return o.length ? o.slice(0, 3).join(',') : ''; }, 'footer labels not clipped');
  auto('V15', keys, 'menu', m => { const s = m.small.filter(x => /colBadge|alive|card|sp/i.test(x) && parseFloat(x.split(':')[1]) < 12); return s.length ? s.length + ' <12px e.g. ' + s[0] : ''; }, 'card badges ≥12px');
  auto('V16', nonEn, 'menu', m => / alive|\bglide\b|\bdrift\b|\bcolony\b|diplococci/i.test(m.t.spGrid || '') ? 'EN in cards: ' + ((m.t.spGrid || '').match(/ alive|\bglide\b|\bdrift\b|\bcolony\b|diplococci/i) || [''])[0] : '', 'cards translated');
  auto('V17', keys, 'menu', m => ['popLabel', 'mapLabel'].filter(i => m.ids[i] && m.ids[i].vis).join(','), 'Pop/Map hidden in menu');
  auto('V18', keys, 'menu', m => { const a = m.ids.langSelWrap, v = m.ids.menuVer; if (!a || !v || !a.vis || !v.vis) return ''; const [x1, y1, w1, h1] = a.r, [x2, y2, w2, h2] = v.r; return (x1 < x2 + w2 && x2 < x1 + w1 && y1 < y2 + h2 && y2 < y1 + h1) ? 'lang selector overlaps title' : ''; }, 'lang selector does not overlap title');
  man('V19', 'pool estimate stability: R6 makes density 1.0 on every screen (vitest density_migrate, mobile_pool)', mobK[0], 'menu');
  man('V20', 'second row of cards cut by footer: look at 1280 menu', deskK[0], 'menu');
  auto('V21', mobK, 'game', m => { const o = m.ovf.filter(x => /hud|card|tip/i.test(x)); return o.length ? o.slice(0, 3).join(',') : ''; }, 'HUD text inside card at 390');
  auto('V22', keys, 'game', m => /Pop\S*\s*(·|$)/m.test(m.t.hud || '') ? 'Pop without number' : '', 'no bare "Pop"');
  auto('V23', mobK, 'game', m => m.hk ? m.hk + ' key hints visible' : '', 'key hints hidden on touch');
  auto('V24', mobK, 'game', m => { const o = m.ovf.filter(x => /^#b|actBar|LIGHT/i.test(x)); return o.length ? o.slice(0, 3).join(',') : ''; }, 'action buttons inside screen');
  man('V25', 'status text duplicates / scale bar overlap: look at game 390', mobK[0], 'game');
  auto('V26', keys, 'pause', m => { const b = m.pauseBtns.filter(x => x[1] > 0 && x[1] < 44); return b.length ? b.slice(0, 3).map(x => x.join(':')).join(',') : ''; }, 'pause buttons ≥44px');
  auto('V27', nonEn, 'settings', m => /\bLanguage\b|Cartoon/.test(m.t.setBody || '') ? 'EN in settings' : '', 'settings translated');
  auto('V28', mobK, 'settings', m => { const t = m.taps.filter(x => /tg|range|setClose/.test(x)); return t.length ? t.length + ' small: ' + t.slice(0, 3).join(',') : ''; }, 'settings targets ≥48');
  auto('V29', keys, 'settings', m => { const a = /rgba?\(([^)]+)\)/.exec(m.setBg || ''); const al = a ? (a[1].split(',')[3] === undefined ? 1 : +a[1].split(',')[3]) : 0; const ov = m.cover.setO ? m.cover.setO.alpha : 0; return Math.max(al, ov) < 0.85 ? 'panel alpha ' + al + '/' + ov : ''; }, 'settings panel opaque ≥0.85');
  man('V30', 'demo group labels / hint: look at demo 390', mobK[0], 'demo');
  auto('V31', mobK, 'demo', m => { const t = m.taps.filter(x => /demo|grp|Label/i.test(x)); return t.length ? t.slice(0, 3).join(',') : ''; }, 'demo buttons ≥48 at 390');
  man('V32', 'player HUD ghost text in demo: look at demo 390', mobK[0], 'demo');
  auto('V33', mobK, 'death', m => { const o = m.ovf.filter(x => /dead|no cell/i.test(x)); return o.length ? o.join(',') : ''; }, 'death screen clean at 390');
  auto('V34', nonEn, 'death', m => /Global/.test(m.t.deadStats || '') ? '"Global" left' : '', 'no "Global" in death causes');
  auto('V35', keys, 'wiki', m => m.wikiSearch && m.wikiSearch[3] < 40 ? 'search h=' + m.wikiSearch[3] : '', 'wiki search ≥40px');
  auto('V36', mobK, 'intro', m => m.ids.pauseBtn && m.ids.pauseBtn.vis && m.ovs.includes('introO') ? 'pause visible during intro' : '', 'no pause button over intro');
  auto('V37', keys.filter(k => k.startsWith('ru_')), 'menu', m => /v2\.0\.0|V2 -/.test(m.t.menuVer || '') ? 'old title' : '', 'title v3, no RU/EN mix');
  add('V38', 'ENV', 'Capacitor splash: phone build only; AAB rebuild = fork R5', '');
  man('V39', 'empty menu buttons at phone start: emulator shots emu/emu2 v20.9.1', mobK[0], 'menu');
  man('V40', 'menu header grid at 1280: look at screenshot', deskK[0], 'menu');
  auto('V41', mobK, 'menu', m => m.cat && m.cat.sw > m.cat.cw + 2 && m.cat.wrap !== 'wrap' ? 'catSel clipped ' + m.cat.sw + '>' + m.cat.cw : '', 'category row fits/wraps');
  auto('V42', deskK, 'intro', m => { const o = m.ids.introOk; if (!o || !o.vis || !m.introDlgW) return ''; return o.r[2] > m.introDlgW + 2 ? 'OK ' + o.r[2] + ' > dialog ' + m.introDlgW : ''; }, 'intro OK ≤ dialog width');
  auto('V43', deskK, 'death', m => m.ids.actBar && m.ids.actBar.vis ? 'actBar visible under death' : '', 'actBar hidden on death');
  add('V44', 'ENV', 'System UI not responding = emulator environment, not a game defect', '');
  const pe = keys.filter(k => S[k].errs && S[k].errs.length).map(k => k + ':' + S[k].errs[0]);
  fs.writeFileSync(path.join(OUT, 'status.json'), JSON.stringify({ res, pageErrors: pe }, null, 1));
  const c = s => res.filter(r => r.status === s).length;
  const md = ['# V01–V44 status (auto, v20.10)', '', `langs ${LANGS} × vp ${VPS}; PASS=${c('PASS')} FAIL=${c('FAIL')} MANUAL=${c('MANUAL')} ENV=${c('ENV')}; page errors: ${pe.length}`, '',
    '| V | status | evidence | screenshot |', '|---|---|---|---|', ...res.map(r => `| ${r.id} | ${r.status} | ${r.ev.replace(/\|/g, '/').slice(0, 160)} | ${r.file ? path.basename(r.file) : ''} |`)];
  fs.writeFileSync(path.join(OUT, 'status.md'), md.join('\n'));
  console.log('\nPASS=' + c('PASS') + ' FAIL=' + c('FAIL') + ' MANUAL=' + c('MANUAL') + ' ENV=' + c('ENV') + ' pageErrors=' + pe.length);
  res.filter(r => r.status === 'FAIL').forEach(r => console.log('FAIL', r.id, r.ev.slice(0, 200)));
};
