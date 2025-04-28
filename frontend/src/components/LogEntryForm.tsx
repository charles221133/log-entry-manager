import React, { useState, useEffect } from 'react';
import { createLogEntry, updateLogEntry, LogEntry } from '../services/api';

type LogEntryFormProps = {
  onAdd?: () => void;
  entry?: LogEntry | null;
  onSave?: () => void;
  onCancel?: () => void;
};

const initialState = {
  userName: '',
  description: '',
  eventDate: '',
  location: '',
};

const USERNAME_KEY = 'logEntryUserName';

const LogEntryForm: React.FC<LogEntryFormProps> = ({ onAdd, entry, onSave, onCancel }) => {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEditing = !!entry;

  // On mount, pre-fill userName from localStorage if present and not editing
  useEffect(() => {
    if (!isEditing) {
      const savedName = localStorage.getItem(USERNAME_KEY);
      setForm(f => ({ ...f, userName: savedName || '' }));
    }
  }, [isEditing]);

  useEffect(() => {
    if (entry) {
      setForm({
        userName: entry.userName,
        description: entry.description,
        eventDate: entry.eventDate.slice(0, 16), // for datetime-local input
        location: entry.location,
      });
    } else {
      setForm(f => ({ ...initialState, userName: f.userName })); // preserve pre-filled userName
    }
  }, [entry]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isEditing && entry?.id) {
        await updateLogEntry(entry.id, form);
        localStorage.setItem(USERNAME_KEY, form.userName); // Save name after successful edit
        if (onSave) onSave();
      } else {
        await createLogEntry(form);
        localStorage.setItem(USERNAME_KEY, form.userName); // Save name after successful add
        setForm(f => ({ ...initialState, userName: form.userName }));
        if (onAdd) onAdd();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save entry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={{ padding: '1rem' }}>
      <h2>{isEditing ? 'Edit Log Entry' : 'Add Log Entry'}</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: 400 }}>
        <input type="text" name="userName" placeholder="User Name" value={form.userName} onChange={handleChange} required />
        <input type="text" name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
        <input type="datetime-local" name="eventDate" value={form.eventDate} onChange={handleChange} required />
        <input type="text" name="location" placeholder="Location" value={form.location} onChange={handleChange} required />
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', width: '100%' }}>
          <button type="submit" disabled={loading}>{loading ? (isEditing ? 'Saving...' : 'Adding...') : isEditing ? 'Save' : 'Add Entry'}</button>
          {isEditing && <button type="button" onClick={onCancel}>Cancel</button>}
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </section>
  );
};

export default LogEntryForm; 