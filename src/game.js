import tiles from './pages/tiles'
import { Stage } from 'boardgame.io/core'
import { heroes, name } from './common'

function distance(from, to) {
  var iDiff = from.data.i - to.data.i
  var jDiff = from.data.j - to.data.j
  return Math.sqrt(iDiff * iDiff + jDiff * jDiff)
}

const allPlayersMove = {
  drawPath: {
    move: (G, ctx, from, to) => {
      let steps = []
      const player = ctx.playerID
      const { players } = G
      const startingPosition = players[ctx.currentPlayer].positionOnMap
      const currentPath = players[player].path
      const areaInPath = currentPath.findIndex((step) => step.includes(to))
      if (to === startingPosition)
        // Player clicked on starting position
        to = null
      else if (areaInPath > -1)
        // Player clicked on an area already in path, remove path after it
        steps = currentPath.slice(0, areaInPath + 1)
      else {
        // Player clicked on a new area, extend path
        if (currentPath.length < 10) {
          from = from || startingPosition
          let path = tiles.dijkstra.shortestPath(tiles.graph.vertices[from], tiles.graph.vertices[to], {
            OUT: { heuristic: (n) => distance(n, to) },
            IN: { heuristic: (n) => distance(n, from) },
          })
          if (path) {
            if (currentPath.length + path.length > 10) {
              path = path.slice(0, 10 - currentPath.length)
            }
            const newSteps = path.map((step) => [parseInt(step.from.data.id), parseInt(step.to.data.id)])
            if (currentPath.length > 0) {
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
          } else {
            steps = currentPath
          }
        } else {
          steps = currentPath
        }
      }
      G.players[player].path = steps
    },
    redact: true,
  },
  setHoveredArea: {
    move: (G, ctx, area) => {
      G.players[ctx.playerID].hoveredArea = area
    },
    redact: true,
  },
}

const LegendOfAndor = {
  name,
  minPlayers: 2,
  maxPlayers: 4,

  setup: (ctx, setupData) => {
    const players = {}
    for (let i = 0; i < ctx.numPlayers; i++) {
      players[i] = {
        hoursPassed: 0,
        numDice: 2,
        specialAbilities: { Bait: false, ProxyAttack: false, WellPower: false, FlipDice: false },
        strength: 1,
        willpower: 7,
        positionOnMap: 0,
        hoveredArea: null,
        path: [],
      }
    }

    return {
      difficulty: setupData && setupData.difficulty,
      round: 0,
      legend: 1,
      letter: 'A',
      players,
      init: false
    }
  },

  moves: {
    ...allPlayersMove,
    move(G, ctx, to) {
      G.players[ctx.currentPlayer].positionOnMap = to
      G.players[ctx.currentPlayer].hoursPassed += G.players[ctx.currentPlayer].path.length
      Object.keys(G.players).map((playerID) => (G.players[playerID].path = []))
      ctx.events.endTurn()
    },
    fight(G, ctx, id) {},
    drink(G, ctx, id) {},
    setupData(G, ctx, setupData) {},
  },

  turn: {
    // Called at the beginning of a turn.
    onBegin: (G, ctx) => {
      ctx.events.setActivePlayers({ others: 'displayMapInput', currentPlayer: Stage.NULL })
    },

    stages: {
      displayMapInput: {
        moves: {
          ...allPlayersMove,
        },
      },
    },
  },

  phases: {
    initialisation: {
      moves: {
        setupData(G, ctx, heroeslist) {
          Object.keys(G.players).forEach((pos) => {
            const hero = heroes[heroeslist[pos]]
            G.players[pos].numDice = hero.numDice
            G.players[pos].specialAbilities[hero.specialAbility] = true
            G.init = true
          })
        },
      },
      endIf: (G) => G.init,
      next: 'play',
      start: true,
    },

    play: {},
  },

  endIf: (G, ctx) => {
    if (G.letter === 'N') {
      return { winner: ctx.currentPlayer }
    }
  },

  ai: {
    enumerate: (G) => {
      let moves = []
      return moves
    },
  },
}

export default LegendOfAndor
