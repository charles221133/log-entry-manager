import React, { useEffect, useState } from 'react';
import { getLogEntries, deleteLogEntry, LogEntry } from '../services/api';

type LogEntryListProps = {
  reloadKey?: number;
  onEdit?: (entry: LogEntry) => void;
};

type SortDirection = 'asc' | 'desc';

const LogEntryList: React.FC<LogEntryListProps> = ({ reloadKey, onEdit }) => {
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDirection>('desc');

  const fetchEntries = () => {
    setLoading(true);
    setError(null);
    getLogEntries()
      .then(setEntries)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEntries();
    // eslint-disable-next-line
  }, [reloadKey]);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this log entry?')) return;
    setDeletingId(id);
    setDeleteError(null);
    try {
      await deleteLogEntry(id);
      fetchEntries();
    } catch (err: any) {
      setDeleteError(err.message || 'Failed to delete entry');
    } finally {
      setDeletingId(null);
    }
  };

  const handleSortToggle = () => {
    setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const sortedEntries = [...entries].sort((a, b) => {
    const aDate = new Date(a.eventDate).getTime();
    const bDate = new Date(b.eventDate).getTime();
    return sortDir === 'asc' ? aDate - bDate : bDate - aDate;
  });

  return (
    <section style={{ padding: '1rem' }}>
      <h2>Log Entries</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {deleteError && <p style={{ color: 'red' }}>{deleteError}</p>}
      {!loading && !error && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'auto' }}>
            <thead>
              <tr>
                <th style={{ padding: '0.5rem 1rem' }}>
                  <button onClick={handleSortToggle} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                    Date {sortDir === 'asc' ? '▲' : '▼'}
                  </button>
                </th>
                <th style={{ padding: '0.5rem 1rem' }}>User</th>
                <th style={{ padding: '0.5rem 1rem' }}>Description</th>
                <th style={{ padding: '0.5rem 1rem' }}>Location</th>
                <th style={{ padding: '0.5rem 1rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedEntries.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', color: '#888', padding: '0.5rem 1rem' }}>No log entries found.</td>
                </tr>
              ) : (
                sortedEntries.map(entry => (
                  <tr key={entry.id}>
                    <td style={{ padding: '0.5rem 1rem' }}>{new Date(entry.eventDate).toLocaleString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false })}</td>
                    <td style={{ padding: '0.5rem 1rem' }}>{entry.userName}</td>
                    <td style={{ padding: '0.5rem 1rem' }}>{entry.description}</td>
                    <td style={{ padding: '0.5rem 1rem' }}>{entry.location}</td>
                    <td style={{ display: 'flex', gap: 4, justifyContent: 'center', padding: '0.5rem 1rem' }}>
                      <button
                        onClick={() => onEdit && onEdit(entry)}
                        title="Edit"
                        aria-label="Edit"
                        style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', padding: 2 }}
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(entry.id!)}
                        disabled={deletingId === entry.id}
                        title="Delete"
                        aria-label="Delete"
                        style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', padding: 2, opacity: deletingId === entry.id ? 0.5 : 1 }}
                      >
                        {deletingId === entry.id ? '⏳' : '🗑️'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default LogEntryList; 