// src/components/Board.jsx
import React, { useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import Opponent from './Opponent';
import CenterTable from './CenterTable';
import PlayerArea from './PlayerArea';
import CommentaryPane from './CommentaryPane';

// Added `reset` to the destructured props!
export const BigfootBoard = ({ G, ctx, moves, playerID, isActive, reset }) => {
  const [selectedCards, setSelectedCards] = useState([]);
  const [isLogOpen, setIsLogOpen] = useLocalStorage('bigfoot_log_pref', true);
  
  // NEW: Listen for turn changes and clear selected cards when the turn ends
  useEffect(() => {
    if (!isActive) {
      setSelectedCards([]);
    }
  }, [isActive]);

  const safePlayerID = playerID !== null ? playerID : "0";
  
  const activeStage = ctx.activePlayers?.[safePlayerID];
  const isTargeting = activeStage === 'targeting';
  const isRaccoonReact = activeStage === 'raccoonReact';
  const isRaccoonSteal = activeStage === 'raccoonSteal';
  const isBigfootAttack = activeStage === 'bigfootAttack';

  // NEW: Check if the game has ended
  const isGameOver = ctx.gameover !== undefined;

  const activeAction = G.activeAction;
  const player = G.players[safePlayerID];

  const opponents = [];
  for (let i = 1; i < ctx.numPlayers; i++) {
    opponents.push(((parseInt(safePlayerID) + i) % ctx.numPlayers).toString());
  }

  const handleDeckClick = () => {
    const hasCanoe = player.status && player.status.some(c => c.name === 'Canoe 🛶');
    if (isActive && !activeStage && !hasCanoe && G.deck.length >= 2) {
      setSelectedCards([]); // <-- Instantly drops selected cards
      moves.drawCards();
    }
  };

  const handleCardClick = (index) => {
    const hasCanoe = player.status && player.status.some(c => c.name === 'Canoe 🛶');
    if (!isActive || activeStage || hasCanoe) return; 
    if (selectedCards.includes(index)) {
      setSelectedCards(selectedCards.filter(i => i !== index));
    } else {
      setSelectedCards([...selectedCards, index]);
    }
  };

  const handleTargetClick = (targetType, opponentID, setIndex = null) => {
    if (!isTargeting) return;
    if (targetType === 'player' && activeAction.card.targetType === 'opponentPlayer') {
      moves.resolveTarget({ type: 'player', player: opponentID });
    }
    if (targetType === 'set' && activeAction.card.targetType === 'opponentSet') {
      moves.resolveTarget({ type: 'set', player: opponentID, setIndex });
    }
  };

  const tableVibe = {
    backgroundColor: '#5c3400', 
    backgroundImage: 'url("https://cdn.jsdelivr.net/gh/cshirley-droid/bigfoot@main/public/assets/texture/dirt.png")',
    backgroundRepeat: 'repeat',
    backgroundBlendMode: 'multiply', 
    color: '#e0e6dd', 
    height: '100vh', 
    width: '100vw', 
    display: 'flex', 
    flexDirection: 'column', // This is the main vertical column
    justifyContent: 'space-between', // Spreads the top, middle, and bottom out
    fontFamily: '"Overpass", sans-serif', 
    position: 'relative', 
    overflow: 'hidden'
  };

  const bannerStyle = { position: 'absolute', top: '15px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#ffc107', color: 'black', padding: '10px 20px', borderRadius: '20px', zIndex: 100, boxShadow: '0 4px 10px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', gap: '15px' };
  const btnStyle = { padding: '8px 15px', cursor: 'pointer', borderRadius: '5px', border: 'none', backgroundColor: '#333', color: 'white', fontWeight: 'bold', fontFamily: '"Luckiest Guy", cursive' };

  // NEW: Styling for the Game Over overlay
  const gameOverOverlayStyle = {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)', zIndex: 1000,
    display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
    color: '#ffc107', textAlign: 'center'
  };

  return (
    <div style={tableVibe}>
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Luckiest+Guy&family=Overpass:wght@400;700&display=swap');
          html, body { margin: 0; padding: 0; overflow: hidden; }
          h1, h2, h3, h4, h5, .title-font { font-family: 'Luckiest Guy', cursive; letter-spacing: 1px; }
          @keyframes pulse { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.8; transform: scale(1.05); } 100% { opacity: 1; transform: scale(1); } }
          @keyframes angryShake { 0% { transform: rotate(0deg) scale(1.1); } 25% { transform: rotate(-5deg) scale(1.1); } 50% { transform: rotate(0deg) scale(1.1); } 75% { transform: rotate(5deg) scale(1.1); } 100% { transform: rotate(0deg) scale(1.1); } }`}
      </style>
      
      <CommentaryPane 
        feed={G.commentaryFeed} 
        isOpen={isLogOpen} 
        toggleOpen={() => setIsLogOpen(!isLogOpen)} 
      />

      {/* NEW: Bulletproof Game Over Screen */}
      {ctx.gameover && (
        <div style={{
          position: 'fixed', // 'fixed' ensures it overlays the entire browser window, ignoring parent constraints
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.9)', 
          zIndex: 9999, // Super high z-index to force it to the very top layer
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
          color: '#ffc107', textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '5rem', margin: '0 0 20px 0', textShadow: '2px 2px 4px #000' }}>🏆 GAME OVER 🏆</h1>
          
          {/* Fallback added just in case the winner object isn't perfectly formatted */}
          <h2 style={{ fontSize: '3rem', color: 'white', margin: '0 0 40px 0' }}>
            {ctx.gameover.winner ? `${ctx.gameover.winner} Wins!` : 'The Game Has Ended!'}
          </h2>
          
          <button 
            style={{ 
              padding: '15px 40px', fontSize: '2rem', cursor: 'pointer', borderRadius: '10px', 
              border: 'none', backgroundColor: '#4caf50', color: 'white', fontWeight: 'bold', 
              fontFamily: '"Luckiest Guy", cursive', boxShadow: '0 4px 6px rgba(0,0,0,0.5)'
            }} 
            onClick={() => reset()}
          >
            Play Again
          </button>
        </div>
      )}

      {isTargeting && (
        <div style={bannerStyle}>
          <b>🎯 Playing {activeAction.card.name}! Choose a target...</b>
          <button style={btnStyle} onClick={() => { moves.cancelAction(); setSelectedCards([]); }}>Cancel</button>
        </div>
      )}

      {isRaccoonReact && (
        <div style={{...bannerStyle, backgroundColor: '#dc3545', color: 'white'}}>
          <b>🦝 Raccoon Attack! You are being robbed!</b>
          {player.hand.some(c => c.name === 'Campfire 🔥') && (
             <button style={{...btnStyle, backgroundColor: '#ff9800'}} onClick={() => moves.blockRaccoon()}>🔥 Block with Campfire</button>
          )}
          <button style={btnStyle} onClick={() => moves.passRaccoon()}>Take the hit</button>
        </div>
      )}

      {isRaccoonSteal && (
        <div style={{...bannerStyle, backgroundColor: '#17a2b8', color: 'white'}}>
          <b>🦝 Steal 2 Cards! Click on the target's hand! ({activeAction.stealsLeft} left)</b>
        </div>
      )}

      {isBigfootAttack && (
        <div style={{...bannerStyle, backgroundColor: '#8B4513', color: 'white'}}>
          <b>👣 A Bigfoot is attacking a Campfire! Anyone can help finish it!</b>
          {player.hand.some(c => c.name === 'Bigfoot 👣') && (
             <button style={{...btnStyle, backgroundColor: '#4caf50'}} onClick={() => moves.addBigfoot(player.hand.findIndex(c => c.name === 'Bigfoot 👣'))}>👣 Add a Bigfoot!</button>
          )}
          <button style={btnStyle} onClick={() => moves.passBigfoot()}>Pass</button>
        </div>
      )}

      {/* TOP SECTION: Opponents */}
      <div style={{ 
        flex: '0 1 auto', // Will take up only the space it needs
        display: 'flex', justifyContent: 'space-around', padding: '20px',
        marginRight: isLogOpen ? '300px' : '0', transition: 'margin-right 0.3s ease-in-out' 
      }}>
        {opponents.map(opID => (
          <Opponent 
            key={opID} opID={opID} op={G.players[opID]} G={G} ctx={ctx} playerID={safePlayerID}
            isTargeting={isTargeting} activeAction={activeAction} isRaccoonSteal={isRaccoonSteal} moves={moves}
            handleTargetClick={handleTargetClick} activeStage={activeStage}
          />
        ))}
      </div>

      {/* MIDDLE SECTION: Center Table */}
      <div style={{
        flex: '1 1 auto', // Will expand to fill the available middle space
        display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 0,
        marginRight: isLogOpen ? '300px' : '0', transition: 'margin-right 0.3s ease-in-out'
      }}>
        <CenterTable 
          deckCount={G.deck.length} discardPile={G.discardPile} 
          isActive={isActive} isTargeting={isTargeting} 
          handleDeckClick={handleDeckClick} layoutIdPrefix={safePlayerID} 
          isLogOpen={isLogOpen}
        />
      </div>

      {/* BOTTOM SECTION: Player Area */}
      <div style={{
        flex: '0 1 auto', // Will take up only the space it needs
        marginRight: isLogOpen ? '300px' : '0', transition: 'margin-right 0.3s ease-in-out'
      }}>
        <PlayerArea 
          player={player} playerID={safePlayerID} playerSets={G.playerSets[safePlayerID]}
          isActive={isActive} isTargeting={isTargeting} activeStage={activeStage}
          selectedCards={selectedCards} setSelectedCards={setSelectedCards} 
          handleCardClick={handleCardClick} moves={moves}
          isLogOpen={isLogOpen} activeAction={activeAction} 
        />
      </div>
    </div>
  );
};