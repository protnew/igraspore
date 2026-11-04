/* theme_menu_v5.js — v5.5: menu species cards (#spGrid .scPrev) use the same procedural style bodies as pond/bestiary. Visual only. */
(function (w) {
  "use strict";
  function v5() {
    /* restore originals when leaving v5 */ var id = w.__igsThemePondId; return !!(w.__igsThemeCover && w.__igsThemeCover[id]) && !!w.igsNeonDraw; }
  function paint() {
    if (!v5()) { var ims = document.querySelectorAll("#spGrid img.scV5"); for (var q = 0; q < ims.length; q++) { var nx = ims[q].nextSibling; if (nx && nx.style) { nx.style.display = "block"; nx.removeAttribute("data-v5"); } ims[q].parentNode.removeChild(ims[q]); } return; }
    var D = w.igsNeonDraw, st = D.styleNow(), sg = document.getElementById("spGrid"); if (!sg) return;
    var theme = w.__igsThemePondId, cards = sg.querySelectorAll(".sc[data-si]");
    for (var i = 0; i < cards.length; i++) {
      var c = cards[i], cv = c.querySelector("canvas.scPrev"); if (!cv || cv.getAttribute("data-v5") === theme) continue;
      var si = parseInt(c.getAttribute("data-si"), 10), sp = null;
      try { sp = (typeof SPECIES_DB !== "undefined") ? SPECIES_DB[si] : null; } catch (e) {}
      if (!sp) continue;
      var shape = sp.shape ? String(sp.shape) : D.shapeOf({ sp: sp });
      var v = 0, n = String(sp.id || sp.name || "x"); for (var j = 0; j < n.length; j++) v = (v * 31 + n.charCodeAt(j)) | 0;
      var url = D.thumb(sp, theme); if (!url) continue;
      var im = c.querySelector("img.scV5");
      if (!im) { im = document.createElement("img"); im.className = "scV5"; im.alt = ""; cv.parentNode.insertBefore(im, cv); }
      im.src = url; im.style.cssText = "display:block;width:120px;height:120px;margin:2px auto;"; cv.style.display = "none"; cv.setAttribute("data-v5", theme);
    }
  }
  function badges() {
    var m = document.getElementById("menuO"); if (!m) return;
    var b = document.getElementById("v5Badges");
    if (!v5()) { if (b) b.style.display = "none"; return; }
    if (!b) { b = document.createElement("div"); b.id = "v5Badges"; m.appendChild(b); }
    var n = (typeof SPECIES_DB !== "undefined") ? SPECIES_DB.length : 0, f = document.getElementById("spFilterStatus");
    var pop = f ? ((f.textContent.match(/~?\s*(\d+)/) || [])[1] || "") : "";
    var h = '<span class="v5b"><i>\u2697</i>' + n + '</span><span class="v5b"><i>\u2766</i>' + pop + '</span>';
    if (b.innerHTML !== h) b.innerHTML = h; b.style.display = "";
  }
  var pend = false;
  function sched() { if (pend) return; pend = true; setTimeout(function () { pend = false; try { paint(); } catch (e) {} }, 30); }
  function init() {
    var sg = document.getElementById("spGrid"); if (!sg) return setTimeout(init, 500);
    new MutationObserver(sched).observe(sg, { childList: true, subtree: false });
    setInterval(function () { try { paint(); badges(); } catch (e) {} }, 1500);
    sched();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
  w.igsMenuV5 = { paint: paint };
})(window);
