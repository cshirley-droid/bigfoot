// src/Game.js
import { INVALID_MOVE } from 'boardgame.io/dist/cjs/core.js';

const sortHand = (hand) => {
  return hand.sort((a, b) => {
    if (a.type === 'action' && b.type === 'number') return 1;
    if (a.type === 'number' && b.type === 'action') return -1;
    if (a.type === 'action' && b.type === 'action') return a.name.localeCompare(b.name);
    return b.value - a.value; 
  });
};

const logAction = (G, text, playerID = null) => {
  const avatarUrl = playerID !== null ? G.players[playerID].avatarUrl : null;
  G.commentaryFeed.push({ text, avatarUrl });
  if (G.commentaryFeed.length > 100) G.commentaryFeed.shift();
};

function setupDeck() {
  const deck = [];
  let idCounter = 0;
  
  for (let i = 1; i <= 9; i++) {
    for (let j = 0; j < 6; j++) {
      deck.push({ id: `card_${idCounter++}`, type: 'number', value: i, name: i.toString() });
    }
  }
  
  const minus = [-1, -1, -1, -2, -2, -3];
  minus.forEach(val => {
    deck.push({ id: `card_${idCounter++}`, type: 'number', value: val, name: val.toString() });
  });

  const actions = [
    ...Array(8).fill({ name: 'Bigfoot 👣', target: 'opponentSet' }),
    ...Array(4).fill({ name: 'Campfire 🔥', target: 'ownSet' }),
    ...Array(2).fill({ name: 'Store 🏪', target: 'none' }),
    ...Array(2).fill({ name: 'Raccoon 🦝', target: 'opponentPlayer' }),
    ...Array(2).fill({ name: 'Canoe 🛶', target: 'opponentPlayer' }),
    ...Array(1).fill({ name: 'Fishing Pole 🎣', target: 'none' }),
  ];
  
  actions.forEach(act => {
    deck.push({ id: `card_${idCounter++}`, type: 'action', value: 0, name: act.name, targetType: act.target });
  });

  return deck;
}

export const SPRITESHEET_URL = "https://cdn.jsdelivr.net/gh/cshirley-droid/bigfoot@main/public/assets/avatar_spritesheet.png";

const avatarStyles = [
  { backgroundPosition: '0% 0%' },    // 1. Bear
  { backgroundPosition: '25% 0%' },   // 2. Wolf
  { backgroundPosition: '50% 0%' },   // 3. Otter
  { backgroundPosition: '75% 0%' },   // 4. Moose
  { backgroundPosition: '100% 0%' },  // 5. Fox (Female)
  { backgroundPosition: '0% 100%' },  // 6. Owl
  { backgroundPosition: '25% 100%' }, // 7. Fox (Male)
  { backgroundPosition: '50% 100%' }, // 8. Fish
  { backgroundPosition: '75% 100%' }, // 9. Frog
  { backgroundPosition: '100% 100%' } // 10. Deer
];

export const BigfootGame = {
  name: 'bigfoot-card-game', // The lobby MUST have this to match players
  minPlayers: 2,
  maxPlayers: 5,

  setup: ({ ctx, random }) => {
    let deck = setupDeck();
    deck = random.Shuffle(deck);

    const players = {};
    const playerSets = {};

    for (let i = 0; i < ctx.numPlayers; i++) {
      players[i.toString()] = { 
        hand: [], 
        name: `Player ${i}`, 
        avatarStyle: avatarStyles[i], 
        status: []
      };
      playerSets[i.toString()] = [];
    }
    
    for (let i = 0; i < 7; i++) {
      for (let p = 0; p < ctx.numPlayers; p++) {
        players[p.toString()].hand.push(deck.pop());
      }
    }

    for (let p = 0; p < ctx.numPlayers; p++) {
      players[p.toString()].hand = sortHand(players[p.toString()].hand);
    }

    const commentaryFeed = [{ text: "🌲 Welcome to Bigfoot (Make Ten)! Game started.", avatarUrl: null }];

    return { deck, discardPile: [], playerSets, players, activeAction: null, commentaryFeed };
  },

  moves: {
    drawCards: ({ G, events, playerID }) => {
      if (G.players[playerID].status.some(c => c.name === 'Canoe 🛶')) return INVALID_MOVE;
      const player = playerID;
      if (G.deck.length >= 2) {
        G.players[player].hand.push(G.deck.pop(), G.deck.pop());
        G.players[player].hand = sortHand(G.players[player].hand);
        logAction(G, `🏕️ Drew 2 cards.`, player);
      }
      events.endTurn();
    },

    makeSet: ({ G, events, playerID }, cardIndexes) => {
      if (G.players[playerID].status.some(c => c.name === 'Canoe 🛶')) return INVALID_MOVE;
      const player = playerID;
      const hand = G.players[player].hand;
      const selectedCards = cardIndexes.map(index => hand[index]);
      
      const numbers = selectedCards.filter(c => c.type === 'number');
      const campfires = selectedCards.filter(c => c.name === 'Campfire 🔥');
      const otherActions = selectedCards.filter(c => c.type === 'action' && c.name !== 'Campfire 🔥');

      if (otherActions.length > 0 || campfires.length > 1) return INVALID_MOVE;
      
      const sum = numbers.reduce((acc, card) => acc + card.value, 0);
      if (sum !== 10) return INVALID_MOVE;

      const finalSet = [...numbers.sort((a,b) => b.value - a.value), ...campfires];
      G.playerSets[player].push(finalSet);

      const cardsText = finalSet.map(c => c.name).join(' + ');
      logAction(G, `✨ Made a set of [${cardsText}]!`, player);

      cardIndexes.sort((a, b) => b - a).forEach(index => {
        G.players[player].hand.splice(index, 1);
      });
      G.players[player].hand = sortHand(G.players[player].hand);
      
      events.endTurn();
    },

    playActionCard: ({ G, events, playerID }, cardIndex) => {
      if (G.players[playerID].status.some(c => c.name === 'Canoe 🛶')) return INVALID_MOVE;
      const player = playerID;
      const card = G.players[player].hand[cardIndex];
      
      if (card.type !== 'action') return INVALID_MOVE;
      
      G.players[player].hand.splice(cardIndex, 1);
      
      if (card.targetType === 'none') {
        if (card.name === 'Store 🏪') {
           for(let i=0; i<4; i++) {
             if (G.deck.length > 0) G.players[player].hand.push(G.deck.pop());
           }
           G.players[player].hand = sortHand(G.players[player].hand);
        }
        G.discardPile.push(card);
        logAction(G, `🏪 Played Store!`, player);
        events.endTurn();
        return;
      }

      G.activeAction = { card, sourcePlayer: player };
      events.setStage('targeting');
    },

    discardCanoe: ({ G, events, playerID }) => {
      const player = playerID;
      const canoeIndex = G.players[player].status.findIndex(c => c.name === 'Canoe 🛶');
      if (canoeIndex === -1) return INVALID_MOVE;

      const canoeCard = G.players[player].status.splice(canoeIndex, 1)[0];
      G.discardPile.push(canoeCard);
      logAction(G, `🗑️ Discarded the Canoe and skipped turn.`, player);
      events.endTurn();
    }
  },

  turn: {
    stages: {
      targeting: {
        moves: {
          resolveTarget: ({ G, events, playerID }, targetInfo) => {
            const player = playerID;
            const action = G.activeAction;

            if (action.card.name === 'Canoe 🛶' && targetInfo.type === 'player') {
               G.players[targetInfo.player].status.push(action.card);
               G.activeAction = null;
               logAction(G, `🛶 Placed a Canoe in front of Player ${targetInfo.player}!`, player);
               events.endStage(); 
               return; 
            }

            if (action.card.name === 'Campfire 🔥' && targetInfo.type === 'set') {
                G.playerSets[player][targetInfo.setIndex].push(action.card);
                logAction(G, `🔥 Added a Campfire to a set.`, player);
                events.endTurn();
                return;
            }

            if (action.card.name === 'Raccoon 🦝' && targetInfo.type === 'player') {
               const targetHand = G.players[targetInfo.player].hand;
               G.activeAction.targetPlayer = targetInfo.player;
               logAction(G, `🦝 Robbing Player ${targetInfo.player} with a Raccoon!`, player);
               
               const hasCampfire = targetHand.some(c => c.name === 'Campfire 🔥');
               if (hasCampfire) {
                   events.setActivePlayers({ value: { [targetInfo.player]: 'raccoonReact' } });
               } else {
                   events.setActivePlayers({ value: { [player]: 'raccoonSteal' } });
                   G.activeAction.stealsLeft = Math.min(2, targetHand.length);
               }
               return;
            }

            if (action.card.name === 'Bigfoot 👣' && targetInfo.type === 'set') {
              const targetedSet = G.playerSets[targetInfo.player][targetInfo.setIndex];
              const hasCampfire = targetedSet.some(c => c.name === 'Campfire 🔥');
              
              logAction(G, `👣 Targeted Player ${targetInfo.player}'s set with a Bigfoot!`, player);

              if (hasCampfire) {
                 G.activeAction.targetPlayer = targetInfo.player;
                 G.activeAction.targetSetIndex = targetInfo.setIndex;
                 G.activeAction.bigfootsPlayed = 1;
                 events.setActivePlayers({ all: 'bigfootAttack' }); 
                 return;
              } else {
                 G.discardPile.push(...targetedSet, action.card);
                 G.playerSets[targetInfo.player].splice(targetInfo.setIndex, 1);
                 G.activeAction = null;
                 logAction(G, `👣 Destroyed the set!`, player);
                 events.endTurn();
                 return;
              }
            }
          },
          
          cancelAction: ({ G, events, playerID }) => {
            const player = playerID;
            G.players[player].hand.push(G.activeAction.card);
            G.players[player].hand = sortHand(G.players[player].hand);
            G.activeAction = null;
            events.endStage(); 
          }
        }
      },

      raccoonReact: {
        moves: {
           blockRaccoon: ({ G, events, playerID }) => {
              const targetPlayer = playerID;
              const campfireIndex = G.players[targetPlayer].hand.findIndex(c => c.name === 'Campfire 🔥');
              const campfire = G.players[targetPlayer].hand.splice(campfireIndex, 1)[0];
              G.discardPile.push(campfire, G.activeAction.card); 
              G.activeAction = null;
              logAction(G, `🔥 Blocked the Raccoon with a Campfire!`, targetPlayer);
              events.endTurn(); 
           },
           passRaccoon: ({ G, events, playerID }) => {
              const targetPlayer = playerID; 
              const attacker = G.activeAction.sourcePlayer;

              logAction(G, `🦝 Let the Raccoon pass!`, targetPlayer);
              G.activeAction.stealsLeft = Math.min(2, G.players[targetPlayer].hand.length);
              events.setActivePlayers({ value: { [attacker]: 'raccoonSteal' } });
           }
        }
      },

      raccoonSteal: {
        moves: {
          stealCard: ({ G, events, playerID }, cardIndex) => {
             const attacker = playerID;
             const targetPlayer = G.activeAction.targetPlayer;
             
             const stolenCard = G.players[targetPlayer].hand.splice(cardIndex, 1)[0];
             G.players[attacker].hand.push(stolenCard);
             G.activeAction.stealsLeft -= 1;
             
             logAction(G, `🦝 Stole a card!`, attacker);

             if (G.activeAction.stealsLeft <= 0 || G.players[targetPlayer].hand.length === 0) {
                 G.discardPile.push(G.activeAction.card); 
                 G.players[attacker].hand = sortHand(G.players[attacker].hand);
                 G.activeAction = null;
                 events.endTurn();
             }
          }
        }
      },

      bigfootAttack: {
        moves: {
          addBigfoot: ({ G, events, playerID }, cardIndex) => {
             const player = playerID;
             const card = G.players[player].hand[cardIndex];
             if (card.name !== 'Bigfoot 👣') return INVALID_MOVE;
             
             G.players[player].hand.splice(cardIndex, 1);
             G.discardPile.push(card);
             
             const targetPlayer = G.activeAction.targetPlayer;
             const setIndex = G.activeAction.targetSetIndex;
             const destroyedSet = G.playerSets[targetPlayer][setIndex];
             
             G.discardPile.push(...destroyedSet, G.activeAction.card); 
             G.playerSets[targetPlayer].splice(setIndex, 1);
             
             logAction(G, `👣 Added a Bigfoot! The set is destroyed!`, player);
             
             G.activeAction = null;
             events.endTurn(); 
          },
          passBigfoot: ({ G, events }) => {
             G.discardPile.push(G.activeAction.card);
             logAction(G, `👣 The Bigfoot attack failed!`);
             G.activeAction = null;
             events.endTurn();
          }
        }
      }
    }
  },

  // FIXED: Removed state mutation (logAction) from pure endIf function
  endIf: ({ G, ctx }) => {
    for (let i = 0; i < ctx.numPlayers; i++) {
      if (G.playerSets[i.toString()].length >= 3) {
        return { winner: G.players[i.toString()].name };
      }
    }
  }
};