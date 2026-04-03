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

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: 'price_1THohh1P0Fl04GJ5jG3mzeUN',
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.CLIENT_URL}/dashboard?success=true`,
      cancel_url: `${process.env.CLIENT_URL}/dashboard?canceled=true`,
      metadata: {
        clerkUserId,
      },
    });

    res.json({ url: session.url });
  } catch (error: any) {
    console.log("Stripe Error:", error);
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};
