import express from 'express';
import cors from 'cors';
import { connect, close } from './database';
import logsRouter from './routes/logs';
import errorHandler from './middleware/errorHandler';

const app = express();
const PORT = 3001;

// Enable CORS for all routes
app.use(cors());

// SQLite connection
try {
  connect();
} catch (error) {
  console.error('❌ Failed to connect to SQLite database:', error);
}

app.use(express.json());

// Mount logs router
app.use('/logs', logsRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Centralized error handling middleware (must be after all routes)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});

// Optional: handle graceful shutdown
process.on('SIGINT', () => {
  close();
  process.exit();
}); 