import React, { useState } from 'react';

const SubscriptionPlans = ({ plans, onSubscribe }) => {
  const [hoveredPlan, setHoveredPlan] = useState(null);

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Choose a Plan</h2>
      <div style={styles.plansContainer}>
        {plans.map(plan => (
          <div
            key={plan.id}
            style={{
              ...styles.planCard,
              ...(hoveredPlan === plan.id ? styles.planCardHover : {})
            }}
            onMouseEnter={() => setHoveredPlan(plan.id)}
            onMouseLeave={() => setHoveredPlan(null)}
          >
            <h3 style={styles.planName}>{plan.recurring}ly plan</h3>
            <p style={styles.planPrice}>${(plan.price / 100).toFixed(2)}</p>
            <button onClick={() => onSubscribe(plan.id)} style={styles.subscribeButton}>Subscribe</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    textAlign: 'center',
    backgroundColor: '#121212', // Dark background
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    maxWidth: '800px',
    margin: '20px auto',
  },
  header: {
    fontSize: '28px',
    marginBottom: '30px',
    color: '#f9f9f9', // Light text
  },
  plansContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    flexWrap: 'wrap',
  },
  planCard: {
    backgroundColor: '#1e1e1e', // Dark card background
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    width: '250px',
    textAlign: 'left',
    transition: 'transform 0.2s, box-shadow 0.2s',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  planName: {
    fontSize: '22px',
    marginBottom: '10px',
    color: '#4fc3f7', // Light blue text
    textAlign: 'center',
  },
  planDescription: {
    fontSize: '14px',
    marginBottom: '15px',
    color: '#b0bec5', // Light grey text
    textAlign: 'center',
  },
  planPrice: {
    fontSize: '18px',
    marginBottom: '20px',
    color: '#f9f9f9', // Light text
    textAlign: 'center',
  },
  subscribeButton: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#4fc3f7', // Light blue background
    color: '#121212', // Dark text
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: 'auto',
    alignSelf: 'center',
  },
  planCardHover: {
    transform: 'scale(1.05)',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
  },
};

export default SubscriptionPlans;
