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

  console.log(`[Stripe Webhook] Event Received: ${event.type} [${event.id}]`);

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;
    const clerkUserId = session.metadata?.clerkUserId || session.metadata?.userId;

    console.log(`[Stripe] Checkout Session Metadata:`, session.metadata);

    if (clerkUserId) {
      try {
        const tenant = await Tenant.findOneAndUpdate(
          { clerkUserId },
          { subscriptionPlan: 'PRO' },
          { new: true }
        );
        if (tenant) {
          console.log(`[Stripe] ✅ Successfully upgraded tenant ${tenant._id} (User: ${clerkUserId}) to PRO`);
        } else {
          console.warn(`[Stripe] ⚠️ No tenant found for Clerk User ID: ${clerkUserId}`);
        }
      } catch (err) {
        console.error(`[Stripe] ❌ Error updating tenant for user ${clerkUserId}:`, err);
      }
    } else {
      console.warn(`[Stripe] ⚠️ Webhook received but clerkUserId was missing in session metadata.`);
    }
  }

  // Handle the invoice.payment_succeeded event
  if (event.type === 'invoice.payment_succeeded') {
    const invoice = event.data.object as any;
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
    const clerkUserId = subscription.metadata?.clerkUserId || subscription.metadata?.userId;

    console.log(`[Stripe] Invoice Payment Succeeded for Subscription:`, invoice.subscription);

    if (clerkUserId) {
      try {
        await Tenant.findOneAndUpdate(
          { clerkUserId },
          { subscriptionPlan: 'PRO' },
          { new: true }
        );
        console.log(`[Stripe] ✅ Subscription persistence: Upgraded ${clerkUserId} to PRO via Invoice`);
      } catch (err) {
        console.error(`[Stripe] ❌ Error updating tenant via invoice for user ${clerkUserId}:`, err);
      }
    }
  }

  res.json({ received: true });
};
