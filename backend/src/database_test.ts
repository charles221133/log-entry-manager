import { connect, close, runQuery, insertLogEntry } from './database';

function testDatabase() {
  try {
    connect();
    // Check if LogEntry table exists
    const tables = runQuery("SELECT name FROM sqlite_master WHERE type='table' AND name='LogEntry'");
    if (tables.length === 1) {
      console.log('✅ LogEntry table exists.');
    } else {
      console.error('❌ LogEntry table does not exist.');
      process.exit(1);
    }
    // Insert a test log entry
    const id = insertLogEntry({
      userName: 'TestUser',
      description: 'Test log entry',
      eventDate: new Date().toISOString(),
      location: 'TestLocation',
    });
    console.log('✅ Inserted test log entry with id:', id);
    // Query the inserted entry
    const entries = runQuery('SELECT * FROM LogEntry WHERE id = ?', [id]);
    if (entries.length === 1) {
      console.log('✅ Queried inserted log entry:', entries[0]);
    } else {
      console.error('❌ Failed to query inserted log entry.');
    }
  } catch (error) {
    console.error('❌ Database test failed:', error);
  } finally {
    close();
  }
}

testDatabase(); 