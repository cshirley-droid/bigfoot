import React, { useState } from 'react';

const RulesPanel = () => {
  const [showRules, setShowRules] = useState(false);

  return (
    <div 
      onMouseEnter={() => setShowRules(true)} 
      onMouseLeave={() => setShowRules(false)}
      style={{ position: 'absolute', top: '15px', left: '15px', zIndex: 1000, backgroundColor: '#2d5a27', color: 'white', padding: '10px 15px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.5)', maxWidth: showRules ? '350px' : '90px', transition: 'all 0.3s ease-in-out', overflow: 'hidden', cursor: 'help', border: '2px solid #555' }}
    >
      <h3 style={{ margin: 0, whiteSpace: 'nowrap' }}>{showRules ? "📌📜 Bigfoot RULES" : "📜 Rules"}</h3>
      {showRules && (
        <div style={{ marginTop: '15px', fontSize: '14px', lineHeight: '1.5' }}>
          <p style={{ margin: '5px 0' }}>👨‍👩‍👧‍👦 2→5 players | 🎂 Ages 5→∞ | ⏱️ 5→20 min</p>
          <ul style={{ paddingLeft: '20px', margin: '10px 0' }}>
            <li>🎴 Deal everyone 7</li>
            <li>👶 Youngest goes first</li>
            <li>🔁 Play clockwise</li>
          </ul>
          <p style={{ margin: '10px 0' }}>🎯 <b>Use any combination of number cards to make sets of 10.</b> First to 3 sets wins!</p>
          <p style={{ margin: '10px 0' }}>🃏 <b>On your turn, take 1 action:</b><br/>• Draw 2 new cards<br/>• Play 1 💥action card<br/>• Make 1 set</p>
          <div style={{ backgroundColor: '#1e3323', padding: '10px', borderRadius: '5px', marginTop: '10px' }}>
            <b>👣 Bigfoot Attacks 👣:</b><br/>Play Bigfoot to eat another player’s set. 2 Bigfoots can eat a set with 🔥Campfire. After attack starts, any player can add Bigfoots to the set you're attacking. After attack, player to the left of whoever started it goes next.
          </div>
        </div>
      )}
    </div>
  );
};

export default RulesPanel;