import express, { Request, Response, NextFunction } from 'express';

const app = express();

// Use Elastic Beanstalk's PORT environment variable or default to 8080
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8080;

// Simple logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Health check endpoint for ELB
app.get('/health', (req: Request, res: Response) => {
  res.status(200).send('OK');
});

// Default root endpoint
app.get('/', (req: Request, res: Response) => {
  res.send('Server is running!');
});

// Start server with error handling
app.listen(PORT, '0.0.0.0', (err?: any) => {
  if (err) {
    console.error('Server failed to start:', err);
    process.exit(1);
  }
  console.log(`Server listening on port ${PORT}`);
});
