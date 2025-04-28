import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import LogEntryForm from './components/LogEntryForm';
import LogEntryList from './components/LogEntryList';
import { LogEntry } from './services/api';
import './App.css';

function App() {
  const [reloadKey, setReloadKey] = useState(0);
  const [editEntry, setEditEntry] = useState<LogEntry | null>(null);

  const handleAdd = () => setReloadKey(k => k + 1);
  const handleEdit = (entry: LogEntry) => setEditEntry(entry);
  const handleSave = () => {
    setReloadKey(k => k + 1);
    setEditEntry(null);
  };
  const handleCancel = () => setEditEntry(null);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <LogEntryForm
          onAdd={handleAdd}
          entry={editEntry}
          onSave={handleSave}
          onCancel={handleCancel}
        />
        <LogEntryList key={reloadKey} onEdit={handleEdit} />
      </main>
      <Footer />
    </div>
  );
}

export default App;
