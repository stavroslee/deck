import React from 'react';

const SubscriptionDashboard = ({ subscription, tokenBalance }) => {
  return (
    <div style={styles.container}>
      <h2 style={styles.header}>My Subscription</h2>
      <div style={styles.subscriptionDetails}>
        <p style={styles.detailRow}><strong>Status:</strong> {subscription.status}</p>
      </div>
      <h2 style={styles.header}>My Tokens</h2>
      <div style={styles.tokenDetails}>
        <p style={styles.detailRow}><strong>Token Balance:</strong> {tokenBalance}</p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#333',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    maxWidth: '600px',
    margin: '20px auto',
    textAlign: 'left',
    color: '#f9f9f9',
  },
  header: {
    fontSize: '24px',
    marginBottom: '20px',
    color: '#f9f9f9',
    textAlign: 'center',
  },
  subscriptionDetails: {
    marginBottom: '30px',
    padding: '20px',
    backgroundColor: '#444',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
  },
  tokenDetails: {
    padding: '20px',
    backgroundColor: '#444',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
  },
  detailRow: {
    marginBottom: '10px',
    fontSize: '16px',
    color: '#ccc',
  },
};

export default SubscriptionDashboard;
