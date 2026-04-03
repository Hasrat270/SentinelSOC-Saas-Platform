import express from 'express';
import http from 'http';
import cors from 'cors';
import { clerkMiddleware } from '@clerk/express';
import connectDB from './config/db.js';
import { initSocket } from './utils/socket.js';
import apiRouter from './routes/api.js';

// 1. Initialize MongoDB connection (which internally loads .env as well via db.ts)
await connectDB();

const app = express();
const server = http.createServer(app);

// 2. Initialize the global Socket.IO instance attached to the HTTP server
initSocket(server);

// Global Express Middlewares
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

// 3. Webhook Route (MUST be before express.json() for signature verification)
import { handleStripeWebhook } from './controllers/webhook.js';
app.post('/api/v1/webhooks', express.raw({ type: 'application/json' }), handleStripeWebhook);

// Parse incoming JSON payloads from the Agent
app.use(express.json({ limit: '5mb' }));

// 4. Mount API Routes 
// clerkMiddleware is now applied within the router for specific protected endpoints
app.use('/api/v1', apiRouter);

// Basic health check route
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// 5. Start the engine
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`[SentinelSOC] Backend API & Real-Time Engine running on http://localhost:${PORT}`);
});
