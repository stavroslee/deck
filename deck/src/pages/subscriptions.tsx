import { useState, useEffect } from 'react';
import SubscriptionPlans from '../components/SubscriptionPlans';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const Subscriptions = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch('/api/get-plans');
        if (response.ok) {
          const data = await response.json();
          setPlans(data.plans);
        } else {
          const errorData = await response.json();
          setError(errorData.error);
        }
      } catch (err) {
        setError('An error occurred while fetching the plans.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleSubscribe = async (planId) => {
    console.log('Subscribing to plan:', planId);
    const stripe = await stripePromise;

    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ planId }),
    });

    const session = await response.json();
    console.log('Session:', session);

    // Redirect to Stripe Checkout
    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      setError(result.error.message);
    }
  };

  return (
    <div className="p-5 max-w-2xl mx-auto text-center bg-gray-900 text-white rounded-lg shadow-lg">
      <h1 className="text-4xl mb-8">Subscription Plans</h1>
      {loading && <p className="text-lg text-gray-400">Loading plans...</p>}
      {error && <p className="text-lg text-red-500">{error}</p>}
      {!loading && !error && <SubscriptionPlans plans={plans} onSubscribe={handleSubscribe} />}
    </div>
  );
};

export default Subscriptions;
