'use client';

import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';

interface Slide {
  title: string;
  pages: string[];
}

interface Deck {
  name: string;
  slides: Slide[];
}

interface PageParams {
  id: string;
}

const DeckView = ({ params }: { params: PageParams }) => {
  const id = parseInt(params.id);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [pageHistory, setPageHistory] = useState({}); // Store previously selected page index for each slide
  const titleInputRef = useRef(null);
  const textAreaRef = useRef(null);

  useEffect(() => {
    const savedDecks = JSON.parse(localStorage.getItem('decks') || '[]');
    console.log(`loaded ${savedDecks.length} decks`);
    if (!savedDecks.length || id > savedDecks.length - 1) {
      alert('Deck not found');
      window.location.href = '/';
    }
    setDecks(savedDecks);
  }, []);

  useEffect(() => {
    if (decks.length) {
      localStorage.setItem('decks', JSON.stringify(decks));
    }
  }, [decks]);

  if (!decks[id]) return <div>Loading...</div>;

  const deck = decks[id];
  const slide = deck.slides[currentSlideIndex];
  const page = slide.pages[currentPageIndex];

  const handleKeyDown = (e) => {
    if (editMode) {
      if (e.key === 'Escape') {
        setEditMode(false);
        setTimeout(() => {
          document.getElementById('main-div')?.focus();
        }, 0);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowLeft':
        if (currentSlideIndex > 0) {
          setPageHistory({ ...pageHistory, [currentSlideIndex]: currentPageIndex });
          const prevSlideIndex = currentSlideIndex - 1;
          setCurrentSlideIndex(prevSlideIndex);
          setCurrentPageIndex(pageHistory[prevSlideIndex] || 0);
        }
        break;
      case 'ArrowRight':
        if (currentSlideIndex < deck.slides.length - 1) {
          setPageHistory({ ...pageHistory, [currentSlideIndex]: currentPageIndex });
          const nextSlideIndex = currentSlideIndex + 1;
          setCurrentSlideIndex(nextSlideIndex);
          setCurrentPageIndex(pageHistory[nextSlideIndex] || 0);
        }
        break;
      case 'ArrowUp':
        if (currentPageIndex > 0) setCurrentPageIndex(currentPageIndex - 1);
        break;
      case 'ArrowDown':
        if (currentPageIndex < slide.pages.length - 1) setCurrentPageIndex(currentPageIndex + 1);
        break;
      case 'Enter':
        setEditMode(true);
        textAreaRef.current?.focus();
        break;
      case 'Escape':
        window.location.href = '/';
        break;
      case 'Backspace':
      case 'Delete':
        if (confirm('Are you sure you want to delete this page?')) {
          const updatedPages = slide.pages.filter((_, index) => index !== currentPageIndex);
          deck.slides[currentSlideIndex].pages = updatedPages.length ? updatedPages : [''];
          setDecks([...decks]);
          setCurrentPageIndex(Math.max(currentPageIndex - 1, 0));
        }
        break;
      case 'Tab':
        e.preventDefault();
        const newPage = '';
        deck.slides[currentSlideIndex].pages.splice(currentPageIndex + 1, 0, newPage);
        setDecks([...decks]);
        setCurrentPageIndex(currentPageIndex + 1);
        setEditMode(true);
        setTimeout(() => (textAreaRef.current as HTMLTextAreaElement)?.focus(), 0);
        break;
      case '+':
        const newSlide = { title: 'New Slide', pages: [''] };
        deck.slides.splice(currentSlideIndex + 1, 0, newSlide);
        setDecks([...decks]);
        setCurrentSlideIndex(currentSlideIndex + 1);
        setCurrentPageIndex(0);
        setEditMode(true);
        setTimeout(() => titleInputRef.current?.focus(), 0);
        break;
      case '-':
        if (deck.slides.length > 1) {
          if (confirm('Are you sure you want to delete this slide?')) {
            console.log(`deleting slide ${currentSlideIndex} ${deck.slides.length}`);
            const updatedSlides = deck.slides.filter((_, index) => index !== currentSlideIndex);
            console.log(`deleted slide ${updatedSlides.length}`);

            // Update the specific deck in the decks array
            const updatedDecks = decks.map((d, i) =>
              i === id ? { ...d, slides: updatedSlides } : d
            );

            setDecks(updatedDecks);
            setCurrentSlideIndex(Math.max(currentSlideIndex - 1, 0));
            setCurrentPageIndex(0);
            // Update the page history
            const updatedPageHistory = {};
            for (const [key, value] of Object.entries(pageHistory)) {
              const numericKey = Number(key);
              if (numericKey > currentSlideIndex) {
                updatedPageHistory[numericKey - 1] = value;
              } else if (numericKey < currentSlideIndex) {
                updatedPageHistory[numericKey] = value;
              }
            }
            setPageHistory(updatedPageHistory);
          }
        }
        break;
      default:
        //console.log(e.key);
        break;
    }
  };

  const handleTextChange = (e) => {
    slide.pages[currentPageIndex] = e.target.value;
    setDecks([...decks]);
  };

  const handleTitleChange = (e) => {
    slide.title = e.target.value;
    setDecks([...decks]);
  };

  const generateAISuggestion = async () => {
    // to generate an AI suggestion we should look at
    const currentSlide = deck.slides[currentSlideIndex];

    const prompt = `you're helping a user create a slide deck, each slide contains a title and multiple pages.  each page is an alternative version of this slide.  You're going to suggest a new page for the current slide.
      Return a suggestion that is different from other pages on this slide that also help strengthen the narrative for the over all deck.  Consider all the other slides their titles and pages when coming up with a suggestion.  Only return the content for the slide you're suggesting.  No title no page.  given:`;

    let context = `${prompt}\n\ndeck - ${deck.name}\n`;
    for (let i = 0; i < deck.slides.length; i++) {
      const slide = deck.slides[i];
      context += `\t${i == currentSlideIndex ? '***' : ''} slide ${i} title ${deck.slides[i].title}\n`;
      for(let j = 0; j < slide.pages.length; j++) {
        const page = slide.pages[j];
        context += `\t\tpage ${j} ${page}\n`;
      }
    }

    context += `current slide ${currentSlideIndex} with title ${currentSlide.title}\n`;

    context += `generate a suggestion for another page on this slide\n`;

    const response = await fetch('/api/getSuggestion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ context }),
    });

    if (!response.ok) {
      console.log(response);
      throw new Error('Failed to fetch AI suggestion');
    }

    const data = await response.json();
    console.log('AI suggestion:', data.suggestion);

    const newPage = data.suggestion;
    deck.slides[currentSlideIndex].pages.splice(currentPageIndex + 1, 0, newPage);
    setDecks([...decks]);
    setCurrentPageIndex(currentPageIndex + 1);
  };

  return (
    <div onKeyDown={handleKeyDown} tabIndex={0} style={{ outline: 'none', margin: '10px', position: 'relative' }} id="main-div">
      <h3>Slide {currentSlideIndex + 1}/{deck.slides.length} Page {currentPageIndex + 1}/{slide.pages.length}</h3>
      <div
        style={{
          color: 'gray',
          fontSize: '16px',
          position: 'absolute',
          top: '95%',
        }}
      >
        <br />
        Press Enter to edit<br />
        arrow keys to navigate<br />
        tab to add a new page<br />
        delete to delete a page<br />
        + to add a new slide<br />
      </div>
      {editMode ? (
        <div style={{ position: 'relative', height: '80vh', margin: '30px' }}>
          <input
            ref={titleInputRef}
            value={slide.title}
            onChange={handleTitleChange}
            style={{
              width: '65%',
              border: '1px solid lightgray',
              padding: '10px',
              fontSize: '16px',
              color: 'black',
              position: 'absolute',
              right: '50%',
              top: '0%',
              transform: 'translate(+50%, -5%)',
            }}
          />
          <textarea
            ref={textAreaRef}
            value={page}
            onChange={handleTextChange}
            style={{
              width: '65%',
              height: '60vh',
              border: '1px solid lightgray',
              padding: '10px',
              fontSize: '16px',
              color: 'black',
              position: 'absolute',
              right: '50%',
              top: '50%',
              transform: 'translate(+50%, -50%)',
            }}
          />
          <div
            style={{
              color: 'gray',
              fontSize: '16px',
              textAlign: 'center',
              position: 'absolute',
              bottom: '5%',
              width: '100%',
            }}
          >
            Press Esc to stop editing
          </div>
        </div>
      ) : (
        <>
          <div style={{ position: 'relative', height: '80vh', margin: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <h2 style={{ textAlign: 'center', width: '65%' }} onClick={() => setEditMode(true)}>{slide.title || '.'}</h2>
            </div>
            {page ? (
              <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <div style={{ width: '65%', outline: 'solid', padding: '10px', height: '60vh', position: 'absolute', right: '50%', top: '50%', transform: 'translate(+50%, -50%)' }} onClick={() => setEditMode(true)}>
                <ReactMarkdown remarkPlugins={[remarkBreaks]}>{page}</ReactMarkdown>
                </div>
              </div>
            ) : (
              <div
                style={{
                  color: 'gray',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  fontSize: '16px',
                }}
              >
                Press Enter to edit
              </div>
            )}
          </div>
        </>
      )}

      {currentSlideIndex > 0 && (
        <div style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', color: 'gray' }}>
          &#9664; Previous Slide
        </div>
      )}
      {currentSlideIndex < deck.slides.length - 1 && (
        <div style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', color: 'gray' }}>
          Next Slide &#9654;
        </div>
      )}
      {currentPageIndex > 0 && (
        <div style={{ position: 'absolute', left: '50%', top: 0, transform: 'translateX(-50%)', color: 'gray' }}>
          &#9650; Previous Page
        </div>
      )}
      {currentPageIndex < slide.pages.length - 1 && (
        <div style={{ position: 'absolute', left: '50%', bottom: 0, transform: 'translateX(-50%)', color: 'gray' }}>
          Next Page &#9660;
        </div>
      )}
      <button
        onClick={generateAISuggestion}
        style={{
          position: 'absolute',
          right: '20px',
          bottom: '20px',
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#0070f3',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Generate AI Suggestion
      </button>
    </div>
  );
};

export default DeckView;
