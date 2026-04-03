import { Router } from 'express';
import { logThreatController, dashboardStatsController, fetchLogsController } from '../controllers/logs.js';
import { getTenantMe, createTenantKey, revokeTenantKey } from '../controllers/tenant.js';
import { usageLimitMiddleware } from '../middleware/usageLimit.js';
import { clerkMiddleware, requireAuth } from '@clerk/express';

const router = Router();

// V1 API Endpoints

// 1. Agent Log Ingestion Endpoint (Authorized via 'x-api-key' in the controller itself)
// Apply usage limit middleware to enforce Free tier limits
router.post('/logs', usageLimitMiddleware, logThreatController);

// Protected Group (All below require Clerk authentication after being parsed by clerkMiddleware)
const protectedRoutes = Router();
protectedRoutes.use(clerkMiddleware());

// 2. Dashboard Analytics (Authorized via Clerk JWT Session)
protectedRoutes.get('/dashboard-stats', requireAuth(), dashboardStatsController);
protectedRoutes.get('/logs', requireAuth(), fetchLogsController);

// 3. Tenant endpoints (Clerk-protected, used by the frontend dashboard)
protectedRoutes.get('/tenant/me', requireAuth(), getTenantMe);
protectedRoutes.post('/tenant/keys', requireAuth(), createTenantKey);
protectedRoutes.delete('/tenant/keys/:key', requireAuth(), revokeTenantKey);

// 4. Subscription endpoints
import { createPortalSession } from '../controllers/subscription.js';
protectedRoutes.post('/subscription/create-portal', requireAuth(), createPortalSession);

router.use(protectedRoutes);

export default router;
