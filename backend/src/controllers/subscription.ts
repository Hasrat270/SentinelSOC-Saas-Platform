import type { Request, Response } from 'express';
import { stripe } from '../utils/stripe.js';
import { getAuth } from '@clerk/express';
import Tenant from '../models/Tenant.js';

export const createPortalSession = async (req: Request, res: Response): Promise<void> => {
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

    const priceId = process.env.STRIPE_PRICE_ID || process.env.PRO_PRICE_ID;
    if (!priceId) {
      res.status(500).json({ error: 'Stripe Price ID (STRIPE_PRICE_ID) is not configured on the server' });
      return;
    }

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${clientUrl}/dashboard?success=true`,
      cancel_url: `${clientUrl}/dashboard?canceled=true`,
      metadata: {
        clerkUserId,
      },
    });

    res.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe Error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};
