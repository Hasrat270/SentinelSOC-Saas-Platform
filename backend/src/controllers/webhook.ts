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
  
  // Deep debug log for any production mismatch
  console.dir(event.data.object, { depth: null });

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;
    const clerkUserId = session.metadata?.clerkUserId || session.metadata?.userId;
    const customerEmail = session.customer_details?.email;

    console.log(`[Stripe] Checkout Session - User: ${clerkUserId}, Email: ${customerEmail}`);

    if (clerkUserId) {
      try {
        const tenant = await Tenant.findOneAndUpdate(
          { clerkUserId },
          { subscriptionPlan: 'PRO' },
          { new: true }
        );
        if (tenant) {
          console.log(`[Stripe] ✅ Upgraded tenant via Clerk ID: ${clerkUserId}`);
        } else {
          console.warn(`[Stripe] ⚠️ No tenant found for Clerk ID: ${clerkUserId}. Trying email fallback...`);
          if (customerEmail) {
            const tenantByEmail = await Tenant.findOneAndUpdate(
              { email: customerEmail }, // Assumption: Tenant might have email field
              { subscriptionPlan: 'PRO' },
              { new: true }
            );
            if (tenantByEmail) console.log(`[Stripe] ✅ Upgraded tenant via Email: ${customerEmail}`);
          }
        }
      } catch (err) {
        console.error(`[Stripe] ❌ Error in checkout.session.completed:`, err);
      }
    }
  }

  // Handle the invoice.payment_succeeded event
  if (event.type === 'invoice.payment_succeeded') {
    const invoice = event.data.object as any;
    const customerEmail = invoice.customer_email;
    
    console.log(`[Stripe] Invoice Paid - Email: ${customerEmail}`);

    try {
      const tenant = await Tenant.findOneAndUpdate(
        { email: customerEmail },
        { subscriptionPlan: 'PRO' },
        { new: true }
      );
      if (tenant) {
        console.log(`[Stripe] ✅ Upgraded user via Invoice Email: ${customerEmail}`);
      }
    } catch (err) {
      console.error(`[Stripe] ❌ Error in invoice.payment_succeeded:`, err);
    }
  }

  res.json({ received: true });
};
