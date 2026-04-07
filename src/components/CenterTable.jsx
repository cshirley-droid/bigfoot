import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Card from './Card';

const CenterTable = ({ deckCount, discardPile, isActive, isTargeting, handleDeckClick, layoutIdPrefix, isLogOpen }) => {
  
  const getStackOffset = (index) => {
    const rotation = (index * 73) % 11 - 5;
    const shiftX = (index * 13) % 7 - 3;
    const shiftY = (index * 19) % 5 - 2;
    return { rotation, shiftX, shiftY };
  };

  return (
    <div style={{ 
      position: 'absolute', bottom: '20px', right: '20px', // CHANGED: Now anchored to bottom right
      width: '300px', height: '200px', backgroundColor: '#3e2723', borderRadius: '50%', 
      border: '10px solid #261612', display: 'flex', justifyContent: 'center', 
      alignItems: 'center', gap: '20px', boxShadow: 'inset 0 0 30px rgba(0,0,0,0.8), 0 10px 30px rgba(0,0,0,0.5)', 
      zIndex: 1, 
      marginRight: isLogOpen ? '320px' : '0', // Adjusted to accommodate drawer width
      transition: 'margin-right 0.3s ease-in-out'
    }}>
      {/* DECK */}
      <div onClick={handleDeckClick} style={{ cursor: (isActive && !isTargeting) ? 'pointer' : 'default', position: 'relative', width: '70px', height: '100px' }}>
        <h5 style={{ margin: 0, textAlign: 'center', color: '#aaa', position: 'absolute', top: '-25px', left: 0, width: '100%' }}>Deck ({deckCount})</h5>
        
        {Array(Math.min(5, deckCount)).fill().map((_, i) => {
          const { rotation, shiftX, shiftY } = getStackOffset(i);
          return (
             <Card 
               key={i} 
               card={{ id: `deck_${i}` }} // Fake card object for the renderer
               layoutIdPrefix="deck" 
               isFacedown={true} // Now uses the matching 👣 design
               animate={{ rotate: rotation, x: shiftX, y: shiftY }} 
               transition={{ type: "spring", stiffness: 300, damping: 30 }}
               styleProps={{ position: 'absolute', bottom: `${i*1}px` }}
             />
          );
        })}
      </div>

      {/* DISCARD PILE */}
      <div>
        <h5 style={{ margin: '0 0 5px 0', textAlign: 'center', color: '#aaa' }}>Discard</h5>
        <div style={{ width: '70px', height: '100px', borderRadius: '10px', border: '2px dashed #555', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <AnimatePresence>
            {discardPile.length > 0 && discardPile.slice(-5).map((card, i) => {
              const { rotation, shiftX, shiftY } = getStackOffset(discardPile.length - 5 + i);
              return (
                <Card 
                  key={card.id} card={card} layoutIdPrefix={layoutIdPrefix} isAction={card.type === 'action'}
                  animate={{ rotate: rotation, x: shiftX, y: shiftY }} 
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  styleProps={{ position: 'absolute', bottom: `${i*1}px` }}
                />
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default CenterTable;