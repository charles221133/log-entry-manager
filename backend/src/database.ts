import Database from 'better-sqlite3';

export type LogEntry = {
  id?: number;
  userName: string;
  description: string;
  eventDate: string;
  location: string;
};

let db: Database.Database | null = null;

export function connect(dbFile: string = 'log_entries.db') {
  if (!db) {
    try {
      db = new Database(dbFile);
      createLogEntryTable();
      console.log('✅ SQLite database connection established.');
    } catch (error) {
      console.error('❌ Failed to connect to SQLite database:', error);
      throw error;
    }
  }
  return db;
}

export function close() {
  if (db) {
    db.close();
    db = null;
    console.log('🛑 SQLite database connection closed.');
  }
}

function createLogEntryTable() {
  if (!db) throw new Error('Database not connected');
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS LogEntry (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userName TEXT NOT NULL,
      description TEXT NOT NULL,
      eventDate TEXT NOT NULL,
      location TEXT NOT NULL
    )
  `;
  db.prepare(createTableSQL).run();
}

export function runQuery(sql: string, params: any[] = []) {
  if (!db) throw new Error('Database not connected');
  try {
    return db.prepare(sql).all(...params);
  } catch (error) {
    console.error('❌ Query failed:', error);
    throw error;
  }
}

export function insertLogEntry(entry: LogEntry) {
  if (!db) throw new Error('Database not connected');
  const stmt = db.prepare(
    'INSERT INTO LogEntry (userName, description, eventDate, location) VALUES (?, ?, ?, ?)'
  );
  try {
    const info = stmt.run(entry.userName, entry.description, entry.eventDate, entry.location);
    return info.lastInsertRowid;
  } catch (error) {
    console.error('❌ Insert failed:', error);
    throw error;
  }
}

export function getLogEntryById(id: number | string) {
  if (!db) throw new Error('Database not connected');
  try {
    return db.prepare('SELECT * FROM LogEntry WHERE id = ?').get(id);
  } catch (error) {
    console.error('❌ Query failed:', error);
    throw error;
  }
}

export function updateLogEntry(id: number | string, entry: LogEntry) {
  if (!db) throw new Error('Database not connected');
  const stmt = db.prepare(
    'UPDATE LogEntry SET userName = ?, description = ?, eventDate = ?, location = ? WHERE id = ?'
  );
  try {
    const info = stmt.run(entry.userName, entry.description, entry.eventDate, entry.location, id);
    return info.changes > 0;
  } catch (error) {
    console.error('❌ Update failed:', error);
    throw error;
  }
}

export function deleteLogEntry(id: number | string) {
  if (!db) throw new Error('Database not connected');
  const stmt = db.prepare('DELETE FROM LogEntry WHERE id = ?');
  try {
    const info = stmt.run(id);
    return info.changes > 0;
  } catch (error) {
    console.error('❌ Delete failed:', error);
    throw error;
  }
} 