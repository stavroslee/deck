// src/components/DeckListComponent.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { hashString } from '../utils/hash';

const getBackgroundImage = (title, index) => {
  const hash = hashString(title || index.toString());
  const imageId = hash % 1000; // Picsum has at least 1000 images
  return `https://picsum.photos/id/${imageId}/200/200`;
};

const DeckListComponent = ({ decks, updateDeckTitle }) => {
  const [editMode, setEditMode] = useState(null);
  const [newTitle, setNewTitle] = useState('');

  const handleTitleClick = (event, index, title) => {
    event.preventDefault(); // Prevent default link navigation
    event.stopPropagation(); // Stop event bubbling to parent link
    setEditMode(index);
    setNewTitle(title);
  };

  const handleTitleChange = (e) => {
    setNewTitle(e.target.value);
  };

  const handleTitleSave = (index) => {
    updateDeckTitle(index, newTitle);
    setEditMode(null);
  };

  return (
    <>
      {decks.map((deck, index) => (
        <Link
          href={`/deck/${index}`}
          key={index}
          style={{
            ...styles.deck,
            backgroundImage: `url(${getBackgroundImage(deck.name, index)})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div style={styles.deckContent}>
            {editMode === index ? (
              <>
                <input
                  type="text"
                  value={newTitle}
                  onChange={handleTitleChange}
                  onBlur={() => handleTitleSave(index)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') handleTitleSave(index);
                  }}
                  autoFocus
                  style={styles.input}
                />
              </>
            ) : (
              <>
                <h3 onClick={(event) => handleTitleClick(event, index, deck.name)} style={styles.title}>
                  {deck.name}
                </h3>
                <p>{deck.slides.length} {deck.slides.length === 1 ? 'slide' : 'slides'}</p>
              </>
            )}
          </div>
        </Link>
      ))}
    </>
  );
};

const styles = {
  deck: {
    padding: '20px',
    backgroundColor: '#222',
    borderRadius: '5px',
    textDecoration: 'none',
    color: '#f9f9f9',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s',
    height: '200px',
    display: 'flex',
    alignItems: 'flex-end', // Align content to the bottom
    backgroundSize: 'cover', // Ensure the background image covers the entire deck
    backgroundPosition: 'center', // Center the background image
  },
  deckContent: {
    textAlign: 'center',
    width: '100%', // Ensure the content takes the full width
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Add a semi-transparent dark overlay to make text readable
    padding: '10px',
    borderRadius: '0 0 5px 5px', // Ensure the corners match the parent
  },
  title: {
    cursor: 'pointer',
  },
  input: {
    width: '80%',
    padding: '5px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    color: 'black',
  },
  'deck:hover': {
    transform: 'scale(1.05)',
  },
};

export default DeckListComponent;
