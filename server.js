// server.js
import ServerPkg from 'boardgame.io/dist/cjs/server.js';
const { Server, Origins } = ServerPkg;
import { BigfootGame } from './src/Game.js'; 

// 1. Create a function that generates a random 4-letter uppercase code
const generateShortCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const server = Server({
  games: [BigfootGame],
  origins: ['https://bigfoot-card-game.pages.dev'], // Note: Ensure this URL matches exactly!
  uuid: generateShortCode, // 2. Override the default ID generator
});

const PORT = process.env.PORT || 8000;

server.run(PORT, () => {
  console.log(`🌲 Bigfoot Server is running on port ${PORT}...`);
});
