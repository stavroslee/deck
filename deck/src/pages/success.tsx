import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Success = () => {
  const router = useRouter();
  const { session_id } = router.query;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [subscriptionDetails, setSubscriptionDetails] = useState(null);

  useEffect(() => {
    if (session_id) {
      fetchSubscriptionDetails(session_id);
    }
  }, [session_id]);

  const fetchSubscriptionDetails = async (sessionId) => {
    try {
      const response = await fetch(`/api/get-subscription-details?session_id=${sessionId}`);
      const data = await response.json();
      if (response.ok) {
        setSubscriptionDetails(data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('An error occurred while fetching the subscription details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 max-w-2xl mx-auto text-center bg-gray-900 text-white rounded-lg shadow-lg">
      <h1 className="text-4xl mb-8">Subscription Successful</h1>
      {loading && <p className="text-lg text-gray-400">Loading subscription details...</p>}
      {error && <p className="text-lg text-red-500">{error}</p>}
      {subscriptionDetails && (
        <div>
          <p className="text-lg text-gray-400 mb-8">Your subscription was successful. Thank you!</p>
          <div className="flex justify-center space-x-4">
            <Link href="/dashboard">
              <button className="px-4 py-2 bg-blue-500 text-black rounded-lg">Go to Dashboard</button>
            </Link>
            <Link href="/">
              <button className="px-4 py-2 bg-gray-700 text-white rounded-lg">Go to Home</button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Success;
