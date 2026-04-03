import type { Request, Response, NextFunction } from 'express';
import Tenant from '../models/Tenant.js';
import ThreatLog from '../models/ThreatLog.js';
import { getIO } from '../utils/socket.js';

/**
 * Middleware to enforce threat log limits for Free tier tenants.
 * Limits: 500 logs per calendar month.
 */
export const usageLimitMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
      res.status(400).json({ error: 'Missing x-api-key header' });
      return;
    }

    // 1. Find the Tenant associated with the API Key (Searching within the multi-key array)
    const tenant = await Tenant.findOne({ 'apiKeys.key': apiKey });
    if (!tenant) {
      res.status(401).json({ error: 'Invalid API Key' });
      return;
    }

    // 2. Only enforce limits on the 'FREE' tier
    if (tenant.subscriptionPlan === 'FREE') {
      if (tenant.logCount >= 500) {
        // Real-time alert to the tenant's dashboard room
        getIO().to(tenant._id.toString()).emit('limit-reached', { 
          logCount: tenant.logCount,
          message: 'Monthly log limit reached'
        });

        res.status(429).json({ 
          error: 'Monthly log limit reached', 
          message: 'Free tier is limited to 500 logs per month. Please upgrade to PRO for unlimited logging.' 
        });
        return;
      }
    }

    // Attach tenant to the request for the controller's use if needed
    (req as any).tenant = tenant;
    next();
  } catch (error) {
    console.error('Usage Limit Middleware Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
