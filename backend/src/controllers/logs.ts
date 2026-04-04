import type { Request, Response } from 'express';
import Tenant from '../models/Tenant.js';
import ThreatLog from '../models/ThreatLog.js';
import { getIO } from '../utils/socket.js';
import { getAuth } from '@clerk/express';

// Helper to deduce severity
const determineSeverity = (threatType: string) => {
  switch (threatType) {
    case 'SQL_Injection':
    case 'Path_Traversal':
      return 'High';
    case 'XSS':
      return 'Medium';
    default:
      return 'Low';
  }
};

/**
 * Expected to be called by the remote Agent middleware installed on a client's site.
 * Authenticates via the `x-api-key` header.
 */
export const logThreatController = async (req: Request, res: Response): Promise<void> => {
  try {
    // The usageLimitMiddleware already validated the key and attached the tenant to the request
    const tenant = (req as any).tenant;

    if (!tenant) {
      console.error(`[SentinelSOC] Error: Tenant context lost in logThreatController. Request headers:`, JSON.stringify(req.headers));
      res.status(500).json({ error: 'Tenant context lost' });
      return;
    }

    // Diagnostic log for production logs mapping
    console.log(`[SentinelSOC] Threat Logging Event:
      Tenant ID: ${tenant._id}
      Clerk User ID: ${tenant.clerkUserId}
      Subscription: ${tenant.subscriptionPlan}
    `);

    const { threatType, method, url, sourceIp, payload } = req.body;

    // 2. Save the Log to MongoDB
    const newThreat = await ThreatLog.create({
      tenantId: tenant._id,
      threatType: threatType || 'Unknown',
      severity: determineSeverity(threatType),
      attackerIp: sourceIp || 'Unknown',
      payload: payload ? JSON.stringify(payload) : '',
      timestamp: new Date()
    });

    // 3. Increment the Tenant's log count
    await Tenant.findByIdAndUpdate(tenant._id, { $inc: { logCount: 1 } });

    // 4. Emit real-time socket event specifically exclusively to this Tenant's room
    getIO().to(tenant._id.toString()).emit('new-threat', newThreat);

    // 4. Return success with threat indicators for the agent
    res.status(201).json({ 
      success: true, 
      isThreat: true,
      redirectUrl: 'https://sentinelsocsaasplatform.vercel.app/blocked',
      message: 'Threat logged successfully' 
    });
  } catch (error) {
    console.error('Error logging threat:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Expected to be called by the React Frontend Dashboard.
 * Authenticates via Clerk JWT Token.
 */
export const dashboardStatsController = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract user ID from the Clerk Auth Object that the middleware appended
    const authRecord = getAuth(req);
    const clerkUserId = authRecord?.userId;

    if (!clerkUserId) {
      res.status(401).json({ error: 'Unauthorized: No active Clerk session found' });
      return;
    }

    // Lookup the internal Tenant database record linked to the authenticated Clerk user
    const tenant = await Tenant.findOne({ clerkUserId });
    
    if (!tenant) {
      res.status(404).json({ error: 'Tenant record not found for this user.' });
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // MongoDB Aggregation Pipeline
    const [stats] = await ThreatLog.aggregate([
      { $match: { tenantId: tenant._id } }, // Only current tenant's logs
      {
        $facet: {
          totalThreatsToday: [
            { $match: { timestamp: { $gte: today } } },
            { $count: 'count' }
          ],
          threatsByType: [
            { $group: { _id: '$threatType', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
          ],
          hourlyThreats: [
            { $match: { timestamp: { $gte: last24h } } },
            {
              $group: {
                _id: { $dateToString: { format: "%Y-%m-%dT%H:00:00Z", date: "$timestamp" } },
                count: { $sum: 1 }
              }
            },
            { $sort: { "_id": 1 } }
          ],
          recentThreats: [
            { $sort: { timestamp: -1 } },
            { $limit: 10 }
          ]
        }
      }
    ]);

    const totalToday = stats?.totalThreatsToday[0]?.count || 0;
    const mostCommonType = stats?.threatsByType[0]?._id || 'None';

    res.json({
      totalToday,
      mostCommonType,
      threatsByType: stats?.threatsByType || [],
      hourlyThreats: stats?.hourlyThreats || [],
      recentThreats: stats?.recentThreats || []
    });

  } catch (error: any) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

/**
 * GET /api/v1/logs
 * Returns a paginated list of logs for the authenticated tenant.
 */
export const fetchLogsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const authRecord = getAuth(req);
    const clerkUserId = authRecord?.userId;

    if (!clerkUserId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const tenant = await Tenant.findOne({ clerkUserId });
    if (!tenant) {
      res.status(404).json({ error: 'Tenant not found' });
      return;
    }

    // 1. Extract Pagination Parameters
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;

    // 2. Fetch Data & Total Count
    const [logs, total] = await Promise.all([
      ThreatLog.find({ tenantId: tenant._id })
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit),
      ThreatLog.countDocuments({ tenantId: tenant._id })
    ]);

    res.json({
      logs,
      total,
      page,
      limit
    });
  } catch (error: any) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
