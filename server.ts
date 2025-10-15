import express, { Request, Response, NextFunction } from 'express';

const app = express();

// Use Elastic Beanstalk's PORT environment variable, fallback to 8080 locally
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;
const HOST = '0.0.0.0'; // Required for EB to access the container externally

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

// Graceful startup with error handling
app.listen(PORT, HOST)
  .on('listening', () => {
    console.log(`✅ Server listening on ${HOST}:${PORT}`);
  })
  .on('error', (err: any) => {
    console.error('❌ Server failed to start:', err);
    process.exit(1);
  });
