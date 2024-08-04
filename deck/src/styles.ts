const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center',
  },
  title: {
    color: '#f9f9f9',
    fontSize: '48px',
  },
  button: {
    display: 'block',
    margin: '20px auto',
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#0070f3',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)', // Limit to 3 columns
    gap: '20px',
    justifyContent: 'center',
    marginTop: '20px',
    padding: '20px 25%',
  },
  emptyState: {
    color: 'gray',
    marginTop: '50px',
    fontSize: '18px',
  },
  explanation: {
    marginTop: '50px',
    padding: '20px',
    backgroundColor: '#1a1a1a',
    textAlign: 'left',
    maxWidth: '800px',
    margin: '50px auto', // Center the explanation section
  },
};

export default styles;
