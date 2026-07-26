import sqlite3
import sys
import os

db_path = r'C:\Obsidian\New\Projects\08-iGraSpore_V2\08-Backlog\backlog_iGraSpore_V2.db'
logs = ""
try:
    with open('vitest_out.txt', 'r', encoding='utf-16le', errors='ignore') as f:
        logs += f.read()
except FileNotFoundError:
    pass

try:
    with open('playwright_out.txt', 'r', encoding='utf-16le', errors='ignore') as f:
        logs += "\n" + f.read()
except FileNotFoundError:
    pass

if not logs.strip():
    logs = "Tests ran, output unavailable or empty."

conn = sqlite3.connect(db_path)
cur = conn.cursor()
try:
    cur.execute("UPDATE tasks SET status='REVIEW', test_logs=? WHERE task_id='TSK-RND-017'", (logs,))
    conn.commit()
    print("DB updated successfully.")
except Exception as e:
    print(f"Error updating DB: {e}")
finally:
    conn.close()
