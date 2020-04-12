// function IsVictory(cells) {
//   const positions = [
//     [0, 1, 2],
//     [3, 4, 5],
//     [6, 7, 8],
//     [0, 3, 6],
//     [1, 4, 7],
//     [2, 5, 8],
//     [0, 4, 8],
//     [2, 4, 6],
//   ]

//   const isRowComplete = (row) => {
//     const symbols = row.map((i) => cells[i])
//     return symbols.every((i) => i !== null && i === symbols[0])
//   }

//   return positions.map(isRowComplete).some((i) => i === true)
// }

const LegendOfAndor = {
  name: 'Legend-of-andor',

  setup: () => ({
    hoursPassed: 0,
    round: 0,
    legend: 1,
    players: [
      {
        health: 10,
        attack: 10,
        move: 1,
        nbOfDice: 2,
        specialAbility: 'none',
        strength: 1,
        willpower: 7,
        rank: 7,
        positionOnMap: 0,
      },
      {
        health: 10,
        attack: 10,
        move: 1,
        nbOfDice: 2,
        specialAbility: 'none',
        strength: 1,
        willpower: 7,
        rank: 7,
        positionOnMap: 0,
      },
    ],
    letter: 'A',
  }),

  moves: {
    move(G, ctx, id) {
      G.players[ctx.currentPlayer].positionOnMap = id
      G.hoursPassed++
    },
    fight(G, ctx, id) {},
    // clickCell(G, ctx, id) {
    //   if (G.cells[id] === null) {
    //     G.cells[id] = ctx.currentPlayer
    //   }
    // },
  },

  turn: { moveLimit: 1 },

  endIf: (G, ctx) => {
    if (G.letter === 'N') {
      return { winner: ctx.currentPlayer }
    }
    // if (G.cells.filter((c) => c === null).length === 0) {
    //   return { draw: true }
    // }
  },

  ai: {
    enumerate: (G) => {
      let moves = []
      // for (let i = 0; i < 9; i++) {
      //   if (G.cells[i] === null) {
      //     moves.push({ move: 'clickCell', args: [i] })
      //   }
      // }
      return moves
    },
  },
}

export default LegendOfAndor
