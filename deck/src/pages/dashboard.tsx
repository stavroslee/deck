import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import SubscriptionDashboard from '../components/SubscriptionDashboard';

const Dashboard = () => {
  const { user } = useUser();
  const [subscription, setSubscription] = useState(null);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      const fetchSubscriptionDetails = async () => {
        try {
          const response = await fetch('/api/get-subscription', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ customerId: user.id }),
          });

          if (response.ok) {
            const data = await response.json();
            setSubscription(data.subscription);

            const tokenBalanceResponse = await fetch('/api/get-token-balance', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ userId: user.id }),
            });

            if (tokenBalanceResponse.ok) {
              const tokenData = await tokenBalanceResponse.json();
              setTokenBalance(tokenData.tokenBalance);
            } else {
              setError('Failed to fetch token balance');
            }
          } else {
            const errorData = await response.json();
            setError(errorData.error);
          }
        } catch (err) {
          setError('An error occurred while fetching the subscription details.');
        }
      };

      fetchSubscriptionDetails();
    }
  }, [user]);

  if (!user) return <p>You need to be authenticated to view this page</p>;

  return (
    <div style={styles.dashboardContainer}>
      <h1 style={styles.header}>Dashboard</h1>
      {error && <p style={styles.error}>{error}</p>}
      {subscription ? (
        <SubscriptionDashboard subscription={subscription} tokenBalance={tokenBalance} />
      ) : (
        !error && <p style={styles.loading}>Loading subscription details...</p>
      )}
    </div>
  );
};

const styles = {
  dashboardContainer: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
  },
  header: {
    fontSize: '32px',
    textAlign: 'center',
    marginBottom: '40px',
    color: '#333',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: '20px',
  },
  loading: {
    textAlign: 'center',
    fontSize: '18px',
    color: '#555',
  },
};

export default Dashboard;
