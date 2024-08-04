import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { session_id } = req.query;

  if (!session_id) {
    res.status(400).json({ error: 'Missing session_id' });
    return;
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id as string);
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

    res.status(200).json(subscription);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
