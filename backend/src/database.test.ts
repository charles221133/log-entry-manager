import { connect, close, runQuery, insertLogEntry } from './database';
import Database from 'better-sqlite3';
import fs from 'fs';

const TEST_DB = 'test_log_entries.db';

let db: Database.Database;

describe('Database CRUD operations', () => {
  beforeAll(() => {
    // Remove test DB if it exists
    if (fs.existsSync(TEST_DB)) fs.unlinkSync(TEST_DB);
    db = new Database(TEST_DB);
    connect(TEST_DB);
  });

  afterAll(() => {
    try {
      close();
    } catch (e) {
      // ignore if already closed
    }
    try {
      db.close();
    } catch (e) {
      // ignore if already closed
    }
    if (fs.existsSync(TEST_DB)) fs.unlinkSync(TEST_DB);
  });

  let insertedId: number;

  it('should insert a log entry', () => {
    insertedId = Number(insertLogEntry({
      userName: 'TestUser',
      description: 'Test description',
      eventDate: '2024-05-01T12:00:00Z',
      location: 'TestLocation',
    }));
    expect(typeof insertedId).toBe('number');
  });

  it('should read the inserted log entry', () => {
    const rows = runQuery('SELECT * FROM LogEntry WHERE id = ?', [insertedId]);
    expect(rows.length).toBe(1);
    expect((rows[0] as any).userName).toBe('TestUser');
  });

  it('should update the log entry', () => {
    db.prepare('UPDATE LogEntry SET description = ? WHERE id = ?').run('Updated description', insertedId);
    const rows = runQuery('SELECT * FROM LogEntry WHERE id = ?', [insertedId]);
    expect((rows[0] as any).description).toBe('Updated description');
  });

  it('should delete the log entry', () => {
    db.prepare('DELETE FROM LogEntry WHERE id = ?').run(insertedId);
    const rows = runQuery('SELECT * FROM LogEntry WHERE id = ?', [insertedId]);
    expect(rows.length).toBe(0);
  });
}); 