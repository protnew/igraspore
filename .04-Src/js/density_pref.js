// v20.10 R6: one-time migration to the full pool (density 1.0) with a version flag.
// Builds <= v20.9 lowered density on phones (0.3-0.55) and never stored it, so old installs are
// stamped with the version and get the full pool. A density the player picked by hand on the slider
// (igs_density + igs_density_manual=1) is restored and never overwritten by the migration.
(function () {
  var VER = '2', K_VER = 'igs_density_ver', K_VAL = 'igs_density', K_MAN = 'igs_density_manual';
  function store() { try { return window.localStorage || null; } catch (e) { return null; } }
  function valid(v) { return typeof v === 'number' && isFinite(v) && v >= 0.3 && v <= 2; }
  function igsDensityMigrate(s) {
    var st = store(); if (!st || !s) return 'nostore';
    var res;
    try {
      var manual = st.getItem(K_MAN) === '1', v = parseFloat(st.getItem(K_VAL));
      if (manual && valid(v)) { s.density = v; res = 'manual'; }
      else if (st.getItem(K_VER) !== VER) { s.density = 1.0; res = 'migrated'; }
      else { s.density = 1.0; res = 'current'; }
      st.setItem(K_VER, VER);
    } catch (e) { res = 'error'; }
    return res;
  }
  function igsSetDensity(v) {
    v = parseFloat(v); if (!valid(v)) return false;
    if (typeof settings !== 'undefined') settings.density = v;
    var st = store();
    if (st) { try { st.setItem(K_VAL, String(v)); st.setItem(K_MAN, '1'); st.setItem(K_VER, VER); } catch (e) {} }
    return true;
  }
  window.igsDensityMigrate = igsDensityMigrate; window.igsSetDensity = igsSetDensity;
  try { if (typeof settings !== 'undefined') window.igsDensityMigrateResult = igsDensityMigrate(settings); } catch (e) {}
})();
