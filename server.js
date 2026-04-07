// server.js
import ServerPkg from 'boardgame.io/dist/cjs/server.js';
const { Server, Origins } = ServerPkg;

// Ensure your Game.js only contains game logic, and no React or CSS imports!
import { BigfootGame } from './src/Game.js'; 

const server = Server({
  games: [BigfootGame],
  origins: ['*'], 
});

const PORT = process.env.PORT || 8000;

server.run(PORT, () => {
  console.log(`🌲 Bigfoot Server is running on port ${PORT}...`);
});
