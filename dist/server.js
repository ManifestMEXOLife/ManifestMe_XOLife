"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
// Use Elastic Beanstalk's PORT environment variable, fallback to 8080 locally
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;
const HOST = '0.0.0.0'; // Required for EB to access the container externally
// Simple logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});
// Health check endpoint for ELB
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});
// Default root endpoint
app.get('/', (req, res) => {
    res.send('Server is running!');
});
// Graceful startup with error handling
app.listen(PORT, HOST)
    .on('listening', () => {
    console.log(`✅ Server listening on ${HOST}:${PORT}`);
})
    .on('error', (err) => {
    console.error('❌ Server failed to start:', err);
    process.exit(1);
});
//# sourceMappingURL=server.js.map