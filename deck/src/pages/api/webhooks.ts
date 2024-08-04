import { buffer } from 'micro';
import Stripe from 'stripe';
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

  const db = getDatabase();

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      if(!session.customer) {
        console.error('No customer found for session');
        break;
      }
      const customerId:string = typeof session.customer === 'string' ? session.customer : session.customer.id;
      if(!session.subscription) {
        console.error('No subscription found for session');
        break;
      }
      const subscriptionId = typeof session.subscription === 'string' ? session.subscription : session.subscription.id;
      if(!subscriptionId) {
        console.error('No subscription found for session');
        break;
      }
      const userId = session.metadata?.userId; // Retrieve userId from metadata
      if(!userId) {
        console.error('No userId found in session metadata');
        break;
      }

      await db.connectUserToCustomer(userId, customerId);
      await db.saveSubscription(customerId, subscriptionId, 'incomplete');
      break;
    }
    case 'customer.subscription.created': {
      const createdSubscription = event.data.object;
      const customerId:string = typeof createdSubscription.customer === 'string' ? createdSubscription.customer : createdSubscription.customer.id;
      await db.saveSubscription(customerId, createdSubscription.id, createdSubscription.status);
      break;
    }
    case 'customer.subscription.updated': {
      const updatedSubscription = event.data.object;
      await db.updateSubscription(updatedSubscription.id, updatedSubscription.status);
      break;
    }
    case 'customer.subscription.deleted': {
      const deletedSubscription = event.data.object;
      await db.deleteSubscription(deletedSubscription.id);
      break;
    }
    default:
      //console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
}
