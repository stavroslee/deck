import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      if(!process.env.STRIPE_PRODUCT_ID) {
        throw new Error('STRIPE_PRODUCT_ID is not set');
      }
      const product = await stripe.products.retrieve(process.env.STRIPE_PRODUCT_ID);
      console.log(product);
      const prices = await stripe.prices.list({ product: process.env.STRIPE_PRODUCT_ID });
      console.log(prices);

      const plans = prices.data.map(price => {
        console.log(price.recurring);
        return {
          id: price.id,
          product: product.id,
          name: product.name,
          recurring: price.recurring?.interval,
          description: product.description,
          price: price.unit_amount,
        };
      });

      res.status(200).json({ plans });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
