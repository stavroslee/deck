import React from 'react';

const SubscriptionDashboard = ({ subscription, tokenBalance }) => {
  return (
    <div style={styles.container}>
      <h2 style={styles.header}>My Subscription</h2>
      <div style={styles.subscriptionDetails}>
        <p><strong>Plan:</strong> {subscription.plan.nickname}</p>
        <p><strong>Status:</strong> {subscription.status}</p>
        <p><strong>Current Period Start:</strong> {new Date(subscription.current_period_start * 1000).toLocaleDateString()}</p>
        <p><strong>Current Period End:</strong> {new Date(subscription.current_period_end * 1000).toLocaleDateString()}</p>
      </div>
      <h2 style={styles.header}>My Tokens</h2>
      <div style={styles.tokenDetails}>
        <p><strong>Token Balance:</strong> {tokenBalance}</p>
        <p><strong>Tokens Used:</strong> {subscription.tokensUsed}</p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    maxWidth: '600px',
    margin: '20px auto',
    textAlign: 'left',
  },
  header: {
    fontSize: '24px',
    marginBottom: '20px',
    color: '#333',
    textAlign: 'center',
  },
  subscriptionDetails: {
    marginBottom: '30px',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  tokenDetails: {
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  detailRow: {
    marginBottom: '10px',
    fontSize: '16px',
    color: '#555',
  },
};

export default SubscriptionDashboard;
