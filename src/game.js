import tiles from './pages/tiles'
import { Stage } from 'boardgame.io/core'

function distance(from, to) {
  var iDiff = from.data.i - to.data.i
  var jDiff = from.data.j - to.data.j
  return Math.sqrt(iDiff * iDiff + jDiff * jDiff)
}

const LegendOfAndor = {
  name: 'Legend-of-andor',
  minPlayers: 2,
  maxPlayers: 4,

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
        hoveredArea: null,
        path: [],
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
        hoveredArea: null,
        path: [],
      },
    ],
    letter: 'A',
  }),

  moves: {
    move(G, ctx, id) {
      G.players[ctx.currentPlayer].positionOnMap = id
      G.hoursPassed++
      G.players.map((player) => (player.path = []))
      ctx.events.endTurn()
    },
    fight(G, ctx, id) {},
    drawPath: {
      move: (G, ctx, player, from, to) => {
        let steps = []
        const { players } = G
        const startingPosition = players[ctx.currentPlayer].positionOnMap
        const areaInPath = players[player].path.findIndex((step) => step.includes(to))
        if (to === startingPosition)
          // Player clicked on starting position
          to = null
        else if (areaInPath > -1)
          // Player clicked on an area already in path, remove path after it
          steps = players[player].path.slice(0, areaInPath + 1)
        else {
          // Player clicked on a new area, extend path
          from = from || startingPosition
          const path = tiles.dijkstra.shortestPath(tiles.graph.vertices[from], tiles.graph.vertices[to], {
            OUT: { heuristic: (n) => distance(n, to) },
            IN: { heuristic: (n) => distance(n, from) },
          })
          const newSteps = path.map((step) => [parseInt(step.from.data.id), parseInt(step.to.data.id)])
          if (players[player].path.length > 0) {
            // If there was already a path drawn
            const oldTo = [startingPosition].concat(players[player].path.map((step) => step[1]))
            const newTo = newSteps.map((step) => step[1])
            let newToList = []
            for (let i = 0; i < oldTo.length && newToList.length === 0; i++) {
              // If new path crosses existing path, replace where it crosses
              const pos = newTo.indexOf(oldTo[i])
              if (pos > -1) newToList = oldTo.slice(0, i).concat(newTo.slice(pos))
            }
            if (newToList.length > 0)
              for (let i = 0; i < newToList.length - 1; i++) steps.push([newToList[i], newToList[i + 1]])
          }
          if (steps.length === 0) steps = players[player].path.concat(newSteps)
        }
        G.players[player].path = steps
      },
      redact: true,
    },
    setHoveredArea: {
      move: (G, ctx, playerID, area) => {
        G.players[playerID].hoveredArea = area
      },
      redact: true,
    },
  },

  turn: {
    activePlayers: { all: Stage.NULL },
    stages: {
      drawPath: {
        moves: {
          drawPath: {
            move: (G, ctx, player, from, to) => {
              let steps = []
              const { players } = G
              const startingPosition = players[ctx.currentPlayer].positionOnMap
              const areaInPath = players[player].path.findIndex((step) => step.includes(to))
              if (to === startingPosition)
                // Player clicked on starting position
                to = null
              else if (areaInPath > -1)
                // Player clicked on an area already in path, remove path after it
                steps = players[player].path.slice(0, areaInPath + 1)
              else {
                // Player clicked on a new area, extend path
                from = from || startingPosition
                const path = tiles.dijkstra.shortestPath(tiles.graph.vertices[from], tiles.graph.vertices[to], {
                  OUT: { heuristic: (n) => distance(n, to) },
                  IN: { heuristic: (n) => distance(n, from) },
                })
                const newSteps = path.map((step) => [parseInt(step.from.data.id), parseInt(step.to.data.id)])
                if (players[player].path.length > 0) {
                  // If there was already a path drawn
                  const oldTo = [startingPosition].concat(players[player].path.map((step) => step[1]))
                  const newTo = newSteps.map((step) => step[1])
                  let newToList = []
                  for (let i = 0; i < oldTo.length && newToList.length === 0; i++) {
                    // If new path crosses existing path, replace where it crosses
                    const pos = newTo.indexOf(oldTo[i])
                    if (pos > -1) newToList = oldTo.slice(0, i).concat(newTo.slice(pos))
                  }
                  if (newToList.length > 0)
                    for (let i = 0; i < newToList.length - 1; i++) steps.push([newToList[i], newToList[i + 1]])
                }
                if (steps.length === 0) steps = players[player].path.concat(newSteps)
              }
              G.players[player].path = steps
            },
            redact: true,
          },
          setHoveredArea: {
            move: (G, playerID, area) => (G.players[playerID].hoveredArea = area),
          },
        },
      },
    },
  },

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
