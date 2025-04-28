import { Router, Request, Response, NextFunction } from 'express';
import { insertLogEntry, getLogEntryById, updateLogEntry, deleteLogEntry, runQuery, LogEntry } from '../database';
import { ValidationError, NotFoundError } from '../middleware/errorHandler';
import { z } from 'zod';

const router = Router();

const logEntrySchema = z.object({
  userName: z.string().min(1, 'userName is required'),
  description: z.string().min(1, 'description is required'),
  eventDate: z.string().min(1, 'eventDate is required'),
  location: z.string().min(1, 'location is required'),
});

// GET /logs - Retrieve all log entries, sorted by eventDate DESC
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  try {
    const entries = runQuery('SELECT * FROM LogEntry ORDER BY eventDate DESC');
    return res.json(entries);
  } catch (error) {
    next(error);
  }
});

// POST /logs - Create a new log entry
router.post('/', (req: Request, res: Response, next: NextFunction) => {
  const parseResult = logEntrySchema.safeParse(req.body);
  if (!parseResult.success) {
    return next(new ValidationError('Invalid log entry data.', parseResult.error.errors));
  }
  const entry: LogEntry = parseResult.data;
  try {
    const id = insertLogEntry(entry);
    return res.status(201).json({ id });
  } catch (error) {
    next(error);
  }
});

// PUT /logs/:id - Update an existing log entry
router.put('/:id', (req: Request, res: Response, next: NextFunction) => {
  const parseResult = logEntrySchema.safeParse(req.body);
  if (!parseResult.success) {
    return next(new ValidationError('Invalid log entry data.', parseResult.error.errors));
  }
  const { id } = req.params;
  // Check if entry exists
  const existing = getLogEntryById(id);
  if (!existing) {
    return next(new NotFoundError('Log entry not found.'));
  }
  try {
    const updated = updateLogEntry(id, parseResult.data);
    if (updated) {
      res.json({ message: 'Log entry updated.' });
    } else {
      next(new Error('Failed to update log entry.'));
    }
  } catch (error) {
    next(error);
  }
});

// DELETE /logs/:id - Delete a log entry
router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  // Check if entry exists
  const existing = getLogEntryById(id);
  if (!existing) {
    return next(new NotFoundError('Log entry not found.'));
  }
  try {
    const deleted = deleteLogEntry(id);
    if (deleted) {
      res.json({ message: 'Log entry deleted.' });
    } else {
      next(new Error('Failed to delete log entry.'));
    }
  } catch (error) {
    next(error);
  }
});

export default router; 