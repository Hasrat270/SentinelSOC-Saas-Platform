import { randomBytes } from 'crypto';
import { getAuth } from '@clerk/express';
import type { Request, Response } from 'express';
import Tenant from '../models/Tenant.js';

/**
 * GET /api/v1/tenant/me
 * Returns tenant info including the list of API keys.
 */
export const getTenantMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = getAuth(req);
    if (!userId) { res.status(401).json({ error: 'Unauthorized' }); return; }

    let tenant = await Tenant.findOne({ clerkUserId: userId });
    
    // Auto-onboarding if tenant record doesn't exist
    if (!tenant) {
      const initialKey = `sentinel_${randomBytes(16).toString('hex')}`;
      tenant = await Tenant.create({
        clerkUserId: userId,
        // If the frontend passes email in headers or body, we could save it here
        // For now, we'll let the webhook update it if it finds it
        apiKeys: [{ 
          key: initialKey, 
          name: 'Primary Key',
          createdAt: new Date()
        }],
        subscriptionPlan: 'FREE',
        logCount: 0
      });
      console.log(`[SentinelSOC] Created new tenant for user ${userId}`);
    } else if (!tenant.email) {
      // Optional: If we had clerkClient, we could fetch and fix missing emails here
    }

    res.json({ 
      tenantId: tenant._id.toString(), 
      apiKeys: tenant.apiKeys,
      subscriptionPlan: tenant.subscriptionPlan,
      logCount: tenant.logCount
    });
  } catch (err) {
    console.error('Error in getTenantMe:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * POST /api/v1/tenant/keys
 * Adds a new persistent API key to the tenant.
 */
export const createTenantKey = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = getAuth(req);
    if (!userId) { res.status(401).json({ error: 'Unauthorized' }); return; }

    const { name } = req.body;
    const newKey = `sentinel_${randomBytes(16).toString('hex')}`;
    
    const tenant = await Tenant.findOneAndUpdate(
      { clerkUserId: userId },
      { 
        $push: { 
          apiKeys: { 
            key: newKey, 
            name: name || 'New Key',
            createdAt: new Date()
          } 
        } 
      },
      { new: true }
    );

    if (!tenant) { res.status(404).json({ error: 'Tenant not found' }); return; }

    res.status(201).json({ apiKeys: tenant.apiKeys });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * DELETE /api/v1/tenant/keys/:key
 * Revokes/removes a specific API key.
 */
export const revokeTenantKey = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = getAuth(req);
    if (!userId) { res.status(401).json({ error: 'Unauthorized' }); return; }

    const { key } = req.params;
    
    const tenant = await Tenant.findOneAndUpdate(
      { clerkUserId: userId },
      { $pull: { apiKeys: { key: key } } },
      { new: true }
    );

    if (!tenant) { res.status(404).json({ error: 'Tenant not found' }); return; }

    res.json({ apiKeys: tenant.apiKeys });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
