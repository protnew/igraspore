const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('c:\\\\Obsidian\\\\New\\\\Projects\\\\iGraSpore V2\\\\08-Backlog\\\\backlog_iGraSpore_V2.db');

db.run(`UPDATE tasks SET status='REVIEW', test_logs='ALL VITEST PASSED (39 tests). Playwright test timed out due to pre-existing Canvas ellipse error.' WHERE task_id='TSK-WRD-016'`, function(err) {
  if (err) {
    return console.log(err.message);
  }
  console.log(`Row(s) updated: ${this.changes}`);
});
db.close();
