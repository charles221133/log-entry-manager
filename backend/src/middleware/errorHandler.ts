import { Request, Response, NextFunction } from 'express';

export class ValidationError extends Error {
  public details: any[];
  constructor(message: string, details: any[] = []) {
    super(message);
    this.name = 'ValidationError';
    this.details = details;
  }
}



export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

function logError(error: Error, req: Request) {
  // Simple structured logging (replace with a real logger if needed)
  console.error({
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl,
    errorName: error.name,
    message: error.message,
    stack: process.env.NODE_ENV === 'production' ? undefined : error.stack,
    // Add more context as needed, but avoid sensitive info
  });
}

export default function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  logError(err, req);
  if (err instanceof ValidationError) {
    return res.status(400).json({
      error: true,
      type: 'validation',
      message: err.message,
      details: err.details,
    });
  }
  if (err instanceof NotFoundError) {
    return res.status(404).json({
      error: true,
      type: 'not_found',
      message: err.message,
    });
  }
  // Generic server error
  const referenceId = Math.random().toString(36).substring(2, 10); // Simple reference ID
  return res.status(500).json({
    error: true,
    type: 'server',
    message: 'Internal server error',
    referenceId,
  });
} 