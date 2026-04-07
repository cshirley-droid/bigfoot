// src/components/CommentaryPane.jsx
import React, { useState, useRef, useEffect } from 'react';

const CommentaryPane = ({ feed, isOpen, toggleOpen }) => {
  const [activeTab, setActiveTab] = useState('commentary'); 
  const feedRef = useRef(null);

  useEffect(() => {
    if (feedRef.current && activeTab === 'commentary') {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [feed, activeTab, isOpen]);

  const paneStyle = {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: '300px',
    backgroundImage: 'url("https://cdn.jsdelivr.net/gh/cshirley-droid/bigfoot@main/public/assets/texture/cardboard.png")',
    backgroundBlendMode: 'multiply',
    backgroundColor: '#1a2421', 
    color: '#e0e6dd',
    borderLeft: '4px solid #333',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 200, 
    fontFamily: '"Overpass", sans-serif',
    boxSizing: 'border-box',
    // The slide-in/slide-out animation!
    transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
    transition: 'transform 0.3s ease-in-out'
  };

  const tabButtonStyle = (tabName) => ({
    flex: 1,
    padding: '15px',
    backgroundColor: activeTab === tabName ? '#333' : '#2d5a27',
    color: activeTab === tabName ? 'white' : '#aaa',
    border: 'none',
    borderBottom: activeTab === tabName ? '4px solid #ffeb3b' : '4px solid transparent',
    cursor: 'pointer',
    fontFamily: '"Luckiest Guy", cursive',
    fontSize: '18px',
    textAlign: 'center'
  });

  return (
    <div style={paneStyle}>
      
      {/* DRAWER TOGGLE BUTTON */}
      <button 
        onClick={toggleOpen}
        style={{
          position: 'absolute', left: '-40px', top: '50%', transform: 'translateY(-50%)',
          width: '40px', height: '60px', backgroundColor: '#333', color: '#ffeb3b',
          border: 'none', borderRadius: '10px 0 0 10px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '-4px 0 10px rgba(0,0,0,0.5)', zIndex: 201, fontSize: '20px'
        }}
      >
        {isOpen ? '▶' : '◀'}
      </button>

      {/* TABS HEADER */}
      <div style={{ display: 'flex' }}>
        <button style={tabButtonStyle('commentary')} onClick={() => setActiveTab('commentary')}>
          📖 Game Log
        </button>
        <button style={tabButtonStyle('rules')} onClick={() => setActiveTab('rules')}>
          📜 Rules
        </button>
      </div>

      {/* TAB CONTENT */}
      {activeTab === 'commentary' ? (
        <div ref={feedRef} style={{ flex: 1, overflowY: 'auto', padding: '15px', fontSize: '14px', lineHeight: '1.4' }}>
          {feed.map((log, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '8px 0', backgroundColor: 'rgba(0,0,0,0.2)', padding: '5px 10px', borderRadius: '8px' }}>
              {log.avatarUrl && (
                <img src={log.avatarUrl} alt="Avatar" style={{ width: '25px', height: '25px', borderRadius: '50%', backgroundColor: '#2d5a27', border: '1px solid #555' }} />
              )}
              <p style={{ margin: 0 }}>{log.text}</p>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ flex: 1, overflowY: 'auto', padding: '15px', fontSize: '14px', lineHeight: '1.5' }}>
          <h3 style={{ margin: '0 0 15px 0', fontFamily: '"Luckiest Guy", cursive', color: 'white' }}>Bigfoot (Make Ten) Rules</h3>
          <p style={{ margin: '5px 0' }}>👨‍👩‍👧‍👦 2→5 players | 🎂 Ages 5→∞ | ⏱️ 5→20 min</p>
          <ul style={{ paddingLeft: '20px', margin: '10px 0' }}>
            <li>🎴 Deal everyone 7</li>
            <li>👶 Youngest goes first</li>
            <li>🔁 Play clockwise</li>
          </ul>
          <p style={{ margin: '10px 0' }}>🎯 <b>Use any combination of number cards to make sets of 10.</b> First to 3 sets wins!</p>
          <p style={{ margin: '10px 0' }}>🃏 <b>On your turn, take 1 action:</b><br/>• Draw 2 new cards<br/>• Play 1 💥action card<br/>• Make 1 set</p>
          <div style={{ backgroundColor: '#1e3323', padding: '10px', borderRadius: '5px', marginTop: '10px', color: '#ff9800' }}>
            <b>👣 Bigfoot Attacks 👣:</b><br/>
            Play Bigfoot to eat another player’s set. 2 Bigfoots can eat a set with 🔥Campfire. Any player can help. First player gets turn next.
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentaryPane;