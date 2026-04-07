import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ card, layoutIdPrefix, isSelected, isAction, isFacedown, onClick, styleProps, animate, ...framerProps }) => {
  const cardStyle = {
    width: '70px',
    height: '100px',
    backgroundColor: isFacedown ? '#2d5a27' : (isAction ? '#EDE8D0' : 'beige'),
    backgroundImage: 'url("https://cdn.jsdelivr.net/gh/cshirley-droid/bigfoot@main/public/assets/texture/cardboard.png")',
    backgroundBlendMode: 'multiply',
    backgroundSize: 'cover',
    color: isFacedown ? '#e2edd8' : 'black',
    borderRadius: '10px',
    display: 'flex',
    flexDirection: 'column',
    // --- visual polish 1: standard content aligned top-left ---
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: '6px 8px',
    boxSizing: 'border-box',
    fontWeight: 'bold',
    // if facedown, center the tracks, otherwise useOverpass/Luckiest guy font sizes
    fontSize: isFacedown ? '40px' : '18px',
    boxShadow: isSelected ? '0 0 15px 5px #007bff' : '2px 4px 10px rgba(0,0,0,0.5)',
    border: isSelected ? '3px solid #007bff' : (isFacedown ? '2px solid #111' : '2px solid #333'),
    cursor: onClick ? 'pointer' : 'default',
    userSelect: 'none',
    zIndex: isSelected ? 10 : 1,
    ...styleProps
  };

  return (
    <motion.div
      layoutId={`${layoutIdPrefix}-${card.id}`}
      style={cardStyle}
      onClick={onClick}
      animate={animate}
      {...framerProps}
    >
      {isFacedown ? (
        // --- visual polish 2: very large tracks centered ---
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>👣</div>
      ) : (
        <>
          <span style={{ fontSize: '16px', lineHeight: '16px' }}>{card.name}</span>
          
          {/* --- visual polish 3: the apple image from jsDelivr --- */}
          {card.value === 1 && card.type === 'number' && (
            <img 
              src="https://cdn.jsdelivr.net/gh/cshirley-droid/bigfoot@main/Apple.BF.png"
              alt="Apple"
              style={{ width: '35px', height: '35px', margin: 'auto' }}
              draggable="false"
            />
          )}
        </>
      )}
    </motion.div>
  );
};

export default Card;