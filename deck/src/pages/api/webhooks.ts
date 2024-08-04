import { buffer } from 'micro';
import Stripe from 'stripe';
import { Database } from '../../lib/database';
import { getDatabase } from '@/lib/databaseFactory';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  const db: Database = getDatabase();

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log(`Checkout session completed: ${session.id}`);
      const customerId = session.customer;
      const subscriptionId = session.subscription;
      await db.saveSubscription(customerId, subscriptionId, 'active');
      break;
    case 'customer.subscription.created':
      const createdSubscription = event.data.object;
      console.log(`Subscription created: ${createdSubscription.id}`);
      await db.saveSubscription(createdSubscription.customer, createdSubscription.id, createdSubscription.status);
      break;
    case 'customer.subscription.updated':
      const updatedSubscription = event.data.object;
      console.log(`Subscription updated: ${updatedSubscription.id}`);
      await db.updateSubscription(updatedSubscription.id, updatedSubscription.status);
      break;
    case 'customer.subscription.deleted':
      const deletedSubscription = event.data.object;
      console.log(`Subscription deleted: ${deletedSubscription.id}`);
      await db.deleteSubscription(deletedSubscription.id);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
}
