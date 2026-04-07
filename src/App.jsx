// src/App.jsx
import React from 'react';
import { Lobby } from 'boardgame.io/react';
import { BigfootGame } from './Game.js';
import { BigfootBoard } from './components/Board.jsx';

const App = () => {
  return (
    <div style={{ backgroundColor: '#222', minHeight: '100vh' }}>
      <Lobby
        gameServer={`http://localhost:8000`}
        lobbyServer={`http://localhost:8000`}
        gameComponents={[
          { 
            game: BigfootGame, 
            // We wrap your board in an inline component to preserve your exact layout!
            board: (props) => (
              <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
                <BigfootBoard {...props} />
              </div>
            )
          }
        ]}
      />
    </div>
  );
};

export default App;