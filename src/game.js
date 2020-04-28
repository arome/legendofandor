import tiles from './pages/tiles'
import { Stage } from 'boardgame.io/core'
import { heroes, name } from './common'

function distance(from, to) {
  var iDiff = from.data.i - to.data.i
  var jDiff = from.data.j - to.data.j
  return Math.sqrt(iDiff * iDiff + jDiff * jDiff)
}

const numberOfDice = (player) => {
  const level = player.willpower >= 14 ? 2 : player.willpower >= 7 ? 1 : 0
  return player.numDice[level]
}

const currentPlayer = (G, ctx) => G.players[ctx.currentPlayer]

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
    let monsters = []
    const positionsOfGores = [8, 20, 21, 26, 48]
    positionsOfGores.forEach((position) =>
      monsters.push({ type: 'Gore', numDice: [2, 3, 3], willpower: 4, strength: 2, positionOnMap: position })
    )
    monsters.push({
      type: 'Skrull',
      numDice: [2, 3, 3],
      willpower: 6,
      strength: 6,
      positionOnMap: 19,
    })

    const players = {}
    for (let i = 0; i < ctx.numPlayers; i++) {
      players[i] = {
        hoursPassed: 0,
        numDice: 2,
        specialAbilities: { Bait: false, ProxyAttack: false, WellPower: false, FlipDice: false },
        strength: 2,
        willpower: 7,
        gold: 0,
        wineskin: 0,
        positionOnMap: 0,
        hoveredArea: null,
        path: [],
      }
    }
    let difficulty = setupData ? setupData.difficulty : 'easy'
    let tokens = []
    const fogPositions = [8, 11, 12, 13, 16, 32, 42, 44, 46, 47, 48, 49, 56, 63, 64]
    const wellPositions = [5, 35, 55, 45]
    fogPositions.forEach((positionOnMap) =>
      tokens.push({
        type: 'fog',
        positionOnMap,
      })
    )
    wellPositions.forEach((positionOnMap) =>
      tokens.push({
        type: 'well',
        positionOnMap,
      })
    )
    tokens.push({
      type: 'farmer',
      positionOnMap: 24,
    })
    if (difficulty === 'easy') {
      tokens.push({
        type: 'farmer',
        positionOnMap: 36,
      })
    }

    return {
      difficulty,
      rollingDices: null,
      dices: [0, 0],
      round: 0,
      legend: 1,
      letter: 'A',
      tokens,
      monsters,
      players,
      splittableResource: [],
      tempSplit: {},
      init: false,
    }
  },

  moves: {
    ...allPlayersMove,
    move(G, ctx, to) {
      const player = currentPlayer(G, ctx)
      G.players[ctx.currentPlayer].positionOnMap = to
      G.players[ctx.currentPlayer].hoursPassed += player.path.length
      Object.keys(G.players).map((playerID) => (G.players[playerID].path = []))
      ctx.events.endTurn()
    },
    fight(G, ctx, id) {},
    drink(G, ctx, id) {},
    setupData(G, ctx, setupData) {},
    startRollDices: (G, ctx) => {
      return { ...G, rollingDices: ctx.random.D6(numberOfDice(currentPlayer(G, ctx))) }
    },
    finishRollDices: (G) => {
      return { ...G, dices: G.rollingDices, rollingDices: null }
    },
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
            G.players[pos].positionOnMap = hero.positionOnMap
            G.splittableResource = [
              { type: 'gold' },
              { type: 'gold' },
              { type: 'gold' },
              { type: 'gold' },
              { type: 'gold' },
              { type: 'wineskin' },
              { type: 'wineskin' },
            ]
            G.init = true
          })
        },
      },
      endIf: (G) => G.init,
      next: 'splitresource',
      start: true,
    },

    splitresource: {
      onBegin: (G, ctx) => {
        let distinctTypes = []
        for (let i = 0; i < G.splittableResource.length; i++) {
          if (!(G.splittableResource[i].type in distinctTypes)) {
            distinctTypes.push(G.splittableResource[i].type)
          }
        }
        let tempSplit = {}
        Object.keys(G.players).forEach((key) => {
          let initObject = {}
          distinctTypes.forEach((type) => (initObject[type] = 0))
          tempSplit[key] = initObject
        })
        G.tempSplit = tempSplit
      },
      moves: {
        add(G, ctx, type, quantity, playerID) {
          const totalRes = G.splittableResource.filter((res) => res.type === type).length
          let currentTotal = 0
          Object.keys(G.tempSplit).forEach((key) => (currentTotal += G.tempSplit[key][type]))
          if (G.tempSplit[playerID][type] + quantity >= 0 && currentTotal + quantity <= totalRes)
            G.tempSplit[playerID][type] += quantity
        },
        splitResource(G, ctx) {
          Object.keys(G.tempSplit).map((key) => {
            const res = G.tempSplit[key]
            /*
            {
              'gold': 3,
              'wineskin':1
            }
            */
            Object.keys(res).map((type) => (G.players[key][type] += res[type]))
          })
          G.tempSplit = {}
          G.splittableResource = []
        },
      },
      endIf: (G) => G.splittableResource.length === 0,
      next: 'play',
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
