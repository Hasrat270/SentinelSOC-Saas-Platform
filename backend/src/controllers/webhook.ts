import type { Request, Response } from 'express';
import { stripe } from '../utils/stripe.js';
import Tenant from '../models/Tenant.js';

export const handleStripeWebhook = async (req: Request, res: Response): Promise<void> => {
  const sig = req.headers['stripe-signature'];

  if (!sig) {
    res.status(400).json({ error: 'Missing Stripe Signature' });
    return;
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;
    const clerkUserId = session.metadata.clerkUserId;

    if (clerkUserId) {
      try {
        await Tenant.findOneAndUpdate(
          { clerkUserId },
          { subscriptionPlan: 'PRO' },
          { new: true }
        );
        console.log(`[Stripe] Successfully upgraded user ${clerkUserId} to Pro`);
      } catch (err) {
        console.error(`Error updating tenant for user ${clerkUserId}:`, err);
      }
    }
  }

  res.json({ received: true });
};
