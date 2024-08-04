'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DeckListComponent from '../components/DeckListComponent';
import TemplateModal from '../components/TemplateModal';
import templates from '../templates';
import styles from '../styles';
import Link from 'next/link';

const Index = () => {
  const [decks, setDecks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedDecks = JSON.parse(localStorage.getItem('decks') || '[]');
    console.log(`loaded ${savedDecks.length} decks`);
    setDecks(savedDecks);
  }, []);

  useEffect(() => {
    if (decks.length) {
      localStorage.setItem('decks', JSON.stringify(decks));
    }
  }, [decks]);

  const createNewDeck = () => {
    setShowModal(true);
  };

  const handleSelectTemplate = (template) => {
    const newDeckName = prompt('Enter the name of the new slide deck:');
    if (newDeckName) {
      const newDeck = { name: newDeckName, ...template };
      const updatedDecks = [...decks, newDeck];
      setDecks(updatedDecks);

      // Navigate to the new deck
      setTimeout(() => {
        const newDeckIndex = updatedDecks.length - 1;
        router.push(`/deck/${newDeckIndex}`);
      }, 0);
    }
    setShowModal(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const updateDeckTitle = (index, newTitle) => {
    const updatedDecks = decks.map((deck, i) => (i === index ? { ...deck, name: newTitle } : deck));
    setDecks(updatedDecks);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Simple Slides</h1>
      <button onClick={createNewDeck} style={styles.button}>Create New Slide Deck</button>
      <Link href="/subscriptions"><button style={styles.button}>View Subscription Plans</button></Link>
      <Link href="/dashboard"><button style={styles.button}>Dashboard</button></Link>
      {decks.length > 0 ? (
        <div style={styles.gridContainer}>
          <DeckListComponent decks={decks} updateDeckTitle={updateDeckTitle} />
        </div>
      ) : (
        <div style={styles.emptyState}>No slide decks available. Create a new one to get started!</div>
      )}
      <div style={styles.explanation}>
        <h2>About This App</h2>
        <p>
          All slide decks are stored in your browser's local memory. This application allows you to create, view, and edit multiple variations of content in a pitch deck. 
          Use keyboard inputs for fast navigation:
        </p>
        <ul>
          <li><strong>Arrow Keys:</strong> Navigate between slides and pages.</li>
          <li><strong>Enter:</strong> Edit content.</li>
          <li><strong>Tab:</strong> Add a new page.</li>
          <li><strong>Delete:</strong> Delete the current page.</li>
          <li><strong>+:</strong> Add a new slide.</li>
        </ul>
      </div>
      {showModal && (
        <TemplateModal templates={templates} onSelectTemplate={handleSelectTemplate} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default Index;
