// src/components/Opponent.jsx
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion'; 
import Card from './Card';

const Opponent = ({ opID, op, G, ctx, playerID, isTargeting, activeAction, handleTargetClick, isRaccoonSteal, moves, activeStage }) => {
  const isPlayerTarget = isTargeting && activeAction?.card.targetType === 'opponentPlayer';
  const isActiveTurn = ctx.currentPlayer === opID;
  const isStealTarget = isRaccoonSteal && G.activeAction.targetPlayer === opID;

  return (
    <div 
      onClick={() => handleTargetClick('player', opID)}
      style={{
        display: 'flex', 
        flexDirection: 'column', 
        opacity: isActiveTurn ? 1 : 0.85,
        border: isPlayerTarget ? '3px dashed #dc3545' : '3px solid transparent',
        borderRadius: '15px', 
        padding: '10px 15px',
        cursor: isPlayerTarget ? 'pointer' : 'default',
        animation: isPlayerTarget ? 'pulse 1.5s infinite' : 'none',
        backgroundColor: 'transparent', 
        transition: 'all 0.3s'
      }}
    >
      {/* --- ROW 1 & 2: Avatar, Name, and Hand --- */}
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: '30px' }}>
        
        {/* Avatar Column */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '80px' }}>
          
          <motion.div 
            animate={isActiveTurn ? { rotate: [0, -10, 10, -10, 10, 0] } : { rotate: 0 }}
            transition={{ repeat: Infinity, duration: 2, repeatDelay: 0.5 }}
            style={{ 
            width: '60px', height: '60px', 
            backgroundColor: '#2d5a27', 
            borderRadius: '50%', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            border: '2px solid #555', 
            boxShadow: isActiveTurn ? '0 0 20px 5px rgba(76, 175, 80, 0.8)' : 'none',
            zIndex: 10,
            overflow: 'hidden' // Keeps image bound to the circle
          }}>
            {/* UPDATED: Sprite sheet background div with zoom scale */}
            <div style={{ 
              width: '100%', 
              height: '100%', 
              backgroundImage: `url('https://cdn.jsdelivr.net/gh/cshirley-droid/bigfoot@main/public/assets/avatar_spritesheet.png')`,
              backgroundSize: '500% 200%', 
              backgroundPosition: op.avatarStyle ? op.avatarStyle.backgroundPosition : '0% 0%',
              transform: 'scale(1.3)' /* <-- This is the zoom! Increase or decrease as needed (e.g., 1.5 for closer) */
            }} />
          </motion.div>
        </div>

        {/* Hand Container (Fanned to the right) */}
        <div style={{ display: 'flex', position: 'relative', width: '120px', height: '80px', marginTop: '10px', filter: isActiveTurn ? 'drop-shadow(0px 0px 15px rgba(76,175,80,0.8))' : 'none', transition: 'filter 0.3s ease-in-out' }}>
          <AnimatePresence>
            {op.hand.map((card, cardIndex) => {
              const offset = cardIndex - (op.hand.length - 1) / 2;
              const rotation = offset * 6;
              const xShift = offset * 15; 
              
              return (
                <div key={card.id} onClick={(e) => {
                   if (isStealTarget) { e.stopPropagation(); moves.stealCard(cardIndex); }
                }}>
                  <Card 
                    card={card} layoutIdPrefix={playerID} isFacedown={true} initial={false}
                    animate={{ rotate: rotation, scale: 0.6, y: isStealTarget ? -10 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    whileHover={isStealTarget ? { scale: 0.7, y: -20 } : {}}
                    styleProps={{ 
                      position: 'absolute', 
                      left: `calc(50% + ${xShift}px - 35px)`, 
                      transformOrigin: 'bottom center', 
                      boxShadow: '-2px 2px 5px rgba(0,0,0,0.5)', 
                      cursor: isStealTarget ? 'crosshair' : 'default' 
                    }}
                  />
                </div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* --- ROW 3: Completed Sets & Status Cards --- */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'row', 
        flexWrap: 'wrap',
        gap: '20px', 
        marginTop: '15px',
        minHeight: '80px' 
      }}>
         {/* Completed Sets */}
         {G.playerSets[opID].map((set, i) => {
            const isSetTarget = isTargeting && activeAction?.card.targetType === 'opponentSet';
            
            const isBeingAttacked = activeStage === 'bigfootAttack' && activeAction?.targetPlayer === opID && activeAction?.targetSetIndex === i;
            
            return (
              <div 
                key={i} 
                onClick={(e) => { e.stopPropagation(); handleTargetClick('set', opID, i); }}
                style={{ 
                  display: 'flex', 
                  border: isSetTarget ? '4px dashed #dc3545' : '4px solid transparent', 
                  borderRadius: '12px', 
                  padding: '5px',
                  cursor: isSetTarget ? 'crosshair' : 'default',
                  transition: 'all 0.2s',
                  animation: isSetTarget ? 'pulse 1.5s infinite' : 'none',
                  transform: 'scale(0.7)',
                  transformOrigin: 'top left',
                  width: `${70 + ((set.length - 1) * 25)}px`,
                  position: 'relative'
                }}
              >
                {set.map((card, cardIndex) => (
                  <Card 
                    key={card.id} card={card} layoutIdPrefix={playerID} 
                    isFacedown={false} 
                    animate={{ rotate: 0 }} 
                    styleProps={{ 
                      marginLeft: cardIndex > 0 ? '-45px' : '0', 
                      boxShadow: '-3px 3px 8px rgba(0,0,0,0.6)' 
                    }} 
                  />
                ))}

                {isBeingAttacked && (
                  <div style={{ position: 'absolute', top: '-15px', right: '-30px', zIndex: 50, animation: 'angryShake 0.5s infinite' }}>
                    <Card 
                      card={activeAction.card} layoutIdPrefix="attacking" isFacedown={false}
                      styleProps={{ boxShadow: '0 0 15px red', border: '3px solid red' }}
                    />
                  </div>
                )}
              </div>
            );
         })}

         {/* Status Debuffs (Canoe) are globally visible next to sets */}
         {op.status?.map(card => (
            <div key={card.id} style={{ 
               display: 'flex',
               transform: 'scale(0.7)', 
               transformOrigin: 'top left', 
               width: '70px',
               borderRadius: '12px'
            }}>
              <Card card={card} layoutIdPrefix={opID} isAction={true} />
            </div>
         ))}
      </div>
    </div>
  );
};

export default Opponent;