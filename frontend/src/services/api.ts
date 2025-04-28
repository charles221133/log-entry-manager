export type LogEntry = {
  id?: number;
  userName: string;
  description: string;
  eventDate: string;
  location: string;
};

const API_BASE = 'http://localhost:3001/logs';

export async function getLogEntries(): Promise<LogEntry[]> {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error('Failed to fetch log entries');
  return res.json();
}

export async function createLogEntry(entry: Omit<LogEntry, 'id'>): Promise<{ id: number }> {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry),
  });
  if (!res.ok) throw new Error('Failed to create log entry');
  return res.json();
}

export async function deleteLogEntry(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete log entry');
}

export async function updateLogEntry(id: number, entry: Omit<LogEntry, 'id'>): Promise<void> {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry),
  });
  if (!res.ok) throw new Error('Failed to update log entry');
} 