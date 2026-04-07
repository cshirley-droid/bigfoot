// src/components/PlayerArea.jsx
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Card from './Card';

const PlayerArea = ({ player, playerID, playerSets, isActive, activeStage, selectedCards, setSelectedCards, handleCardClick, moves, isLogOpen, activeAction }) => {
  
  const hasCanoe = player.status && player.status.some(c => c.name === 'Canoe 🛶');

  const selected = selectedCards.map(i => player.hand[i]);
  const sum = selected.reduce((acc, c) => acc + (c.type === 'number' ? c.value : 0), 0);
  const actionCardsCount = selected.filter(c => c.type === 'action' && c.name !== 'Campfire 🔥').length;
  const campfireCount = selected.filter(c => c.name === 'Campfire 🔥').length;

  const isMakeSetValid = sum === 10 && actionCardsCount === 0 && campfireCount <= 1 && !hasCanoe;
  const isPlayActionValid = selectedCards.length === 1 && selected[0].type === 'action' && !hasCanoe;

  const handleConfirmAction = () => {
    if (isMakeSetValid) moves.makeSet(selectedCards);
    else if (isPlayActionValid) moves.playActionCard(selectedCards[0]);
    setSelectedCards([]);
  };

  return (
    <div style={{ 
      padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', 
      backgroundColor: 'transparent', 
      position: 'relative', 
      marginRight: isLogOpen ? '300px' : '0', 
      transition: 'all 0.3s ease-in-out' 
    }}>
      
      <AnimatePresence>
        {(isMakeSetValid || isPlayActionValid) && !activeStage && isActive && (
          <motion.button
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            onClick={handleConfirmAction}
            style={{ position: 'absolute', top: '-60px', padding: '15px 30px', fontSize: '18px', backgroundColor: isMakeSetValid ? '#4caf50' : '#ff9800', color: 'white', border: 'none', borderRadius: '30px', cursor: 'pointer', boxShadow: '0 5px 15px rgba(0,0,0,0.5)', zIndex: 100, fontFamily: '"Luckiest Guy", cursive' }}
          >
            {isMakeSetValid ? "✨ MAKE SET ✨" : `💥 PLAY ${selected[0].name.toUpperCase()}`}
          </motion.button>
        )}
      </AnimatePresence>

      <div style={{ display: 'flex', justifyContent: 'center', width: '100%', maxWidth: '800px', marginBottom: '20px', position: 'relative' }}>
         
         <div style={{ position: 'absolute', bottom: '20px', left: '20px', display: 'flex', gap: '20px', zIndex: 50, transform: 'scale(0.8)', transformOrigin: 'bottom left' }}>
           
           {playerSets.map((set, i) => {
              const isBeingAttacked = activeStage === 'bigfootAttack' && activeAction?.targetPlayer === playerID && activeAction?.targetSetIndex === i;

              return (
                <div key={i} style={{ display: 'flex', transform: 'scale(0.8)', transformOrigin: 'bottom right', position: 'relative' }}>
                  {set.map((card, cardIndex) => (
                    <Card 
                      key={card.id} card={card} layoutIdPrefix={playerID} isFacedown={false}
                      animate={{ rotate: (cardIndex - (set.length - 1) / 2) * 6 }} 
                      styleProps={{ marginLeft: cardIndex > 0 ? '-45px' : '0', boxShadow: '-3px 3px 8px rgba(0,0,0,0.6)' }}
                    />
                  ))}

                  {isBeingAttacked && (
                    <div style={{ position: 'absolute', top: '-15px', right: '-40px', zIndex: 50, animation: 'angryShake 0.5s infinite' }}>
                      <Card 
                        card={activeAction.card} layoutIdPrefix="attacking" isFacedown={false}
                        styleProps={{ boxShadow: '0 0 15px red', border: '3px solid red' }}
                      />
                    </div>
                  )}
                </div>
              );
            })}

            <AnimatePresence>
              {player.status?.map((card) => (
                <div key={card.id} style={{ position: 'relative' }}>
                  <motion.div
                    animate={isActive && !activeStage ? { scale: [1, 1.05, 1], boxShadow: ['0 0 10px #ffeb3b', '0 0 30px #ff9800', '0 0 10px #ffeb3b'] } : {}}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    style={{ borderRadius: '10px' }}
                  >
                    <Card 
                      card={card} 
                      layoutIdPrefix={playerID} 
                      isAction={true} 
                      onClick={isActive && !activeStage ? () => moves.discardCanoe() : undefined} 
                    />
                  </motion.div>
                  {(isActive && !activeStage) && (
                    <div style={{ position: 'absolute', top: '-25px', width: '100%', textAlign: 'center', color: '#ffeb3b', fontWeight: 'bold', fontFamily: '"Luckiest Guy", cursive', textShadow: '0 2px 4px black', whiteSpace: 'nowrap', left: '50%', transform: 'translateX(-50%)' }}>
                      CLICK TO DISCARD
                    </div>
                  )}
                </div>
              ))}
            </AnimatePresence>
         </div>
      </div> {/* Closes playerSets container */}

      {/* ADDED: Wrapping Avatar and Hand in a Flex Row! */}
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '30px', width: '100%', justifyContent: 'center' }}>
        
        {/* Avatar */}
        <motion.div 
          animate={isActive ? { rotate: [0, -10, 10, -10, 10, 0] } : { rotate: 0 }}
          transition={{ repeat: Infinity, duration: 2, repeatDelay: 0.5 }}
          style={{ width: '60px', height: '60px', backgroundColor: '#2d5a27', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #555', zIndex: 10, boxShadow: isActive ? '0 0 20px 5px rgba(76, 175, 80, 0.8)' : 'none', overflow: 'hidden' }}>
          {/* UPDATED: Sprite sheet background div instead of standard img tag */}
          <div style={{ 
            width: '100%', 
            height: '100%', 
            backgroundImage: `url('https://cdn.jsdelivr.net/gh/cshirley-droid/bigfoot@main/public/assets/avatar_spritesheet.png')`,
            backgroundSize: '500% 200%', /* Scales the image to 5 columns and 2 rows */
            backgroundPosition: player.avatarStyle ? player.avatarStyle.backgroundPosition : '0% 0%',
            transform: 'scale(1.3)'
          }} />
        </motion.div>

        {/* Hand Container */}
        <div style={{ display: 'flex', justifyContent: 'center', height: '120px', position: 'relative', width: '100%', maxWidth: '700px', filter: isActive ? 'drop-shadow(0px 0px 15px rgba(76,175,80,0.8))' : 'none', transition: 'filter 0.3s ease-in-out' }}>
          <AnimatePresence>
            {player.hand.map((card, index) => {
              const offset = index - (player.hand.length - 1) / 2;
              const isSelected = selectedCards.includes(index);
              
              const rotation = isSelected ? 0 : offset * 11; 
              const xShift = offset * 55; 
              const yShift = isSelected ? -30 : Math.abs(offset) * 8; 
              
              return (
                <Card 
                  key={card.id} card={card} layoutIdPrefix={playerID} 
                  isSelected={isSelected} isAction={card.type === 'action'} 
                  onClick={() => handleCardClick(index)}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: (hasCanoe && !isSelected) ? 0.5 : 1, y: yShift, rotate: rotation, zIndex: isSelected ? 10 : 1 }}
                  exit={{ opacity: 0, scale: 0.5 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  whileHover={hasCanoe ? {} : { y: yShift - 15, scale: 1.05 }}
                  styleProps={{ position: 'absolute', left: `calc(50% + ${xShift}px - 35px)`, transformOrigin: 'bottom center' }}
                />
              );
            })}
          </AnimatePresence>
        </div>
      </div> {/* Closes Flex Row Container */}
      
    </div>
  );
};

export default PlayerArea;