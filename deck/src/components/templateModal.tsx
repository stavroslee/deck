import React from 'react';

const TemplateModal = ({ templates, onSelectTemplate, onClose }) => {
  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <h2>Select a Template</h2>
        <ul style={styles.templateList}>
          {templates.map((template, index) => (
            <li key={index} style={styles.templateItem} onClick={() => onSelectTemplate(template)}>
              {template.name}
            </li>
          ))}
        </ul>
        <button onClick={onClose} style={styles.closeButton}>Close</button>
      </div>
    </div>
  );
};

const styles = {
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#2a2a2a',
    padding: '20px',
    borderRadius: '5px',
    textAlign: 'center',
    width: '80%', // Adjust this value to make the modal wider
    maxWidth: '600px', // Add a max-width for better responsiveness
  },
  templateList: {
    listStyleType: 'none',
    padding: 0,
  },
  templateItem: {
    padding: '10px',
    margin: '5px 0',
    backgroundColor: '#a0a0a0',
    cursor: 'pointer',
  },
  closeButton: {
    marginTop: '10px',
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#0070f3',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default TemplateModal;
