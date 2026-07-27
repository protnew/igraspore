CREATE TRIGGER IF NOT EXISTS trg_tasks_ai AFTER INSERT ON tasks BEGIN
  INSERT INTO tasks_history(task_id, action, status_old, status_new, payload)
  VALUES (NEW.task_id, 'INSERT', NULL, NEW.status, NEW.title);
END;
CREATE TRIGGER IF NOT EXISTS trg_tasks_au AFTER UPDATE ON tasks BEGIN
  INSERT INTO tasks_history(task_id, action, status_old, status_new, payload)
  VALUES (NEW.task_id, 'UPDATE', OLD.status, NEW.status, NEW.title);
END;
CREATE TRIGGER IF NOT EXISTS trg_tasks_ad AFTER DELETE ON tasks BEGIN
  INSERT INTO tasks_history(task_id, action, status_old, status_new, payload)
  VALUES (OLD.task_id, 'DELETE', OLD.status, NULL, OLD.title);
END;
