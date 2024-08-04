import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import SubscriptionDashboard from '../components/SubscriptionDashboard';

const Dashboard = () => {
  const { user } = useUser();
  const [subscription, setSubscription] = useState(null);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (user) {
      const fetchSubscriptionDetails = async () => {
        try {
          const response = await fetch('/api/get-subscription', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const data = await response.json();
            setSubscription(data.subscription);
            if(!data.subscription) {
              setError('No subscription found for this user');
              setTimeout(() => {
                window.location.href = '/subscriptions';
              }, 3000);
              return;
            }

            const tokenBalanceResponse = await fetch('/api/get-token-balance', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
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
          console.error(err);
          setError('An error occurred while fetching the subscription details.');
        }
      };

      fetchSubscriptionDetails();
    }
  }, [user]);

  const handleReturnToIndex = () => {
    router.push('/');
  };

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
      <button onClick={handleReturnToIndex} style={styles.button}>Return to Index</button>
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
    color: 'white',
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
  button: {
    marginTop: '20px',
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#0070f3',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default Dashboard;
