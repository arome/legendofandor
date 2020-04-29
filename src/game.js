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
      const hoursPassed = players[ctx.currentPlayer].hoursPassed
      const willpower = players[ctx.currentPlayer].willpower
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
        const pathAndHour = currentPath.length + hoursPassed
        if (pathAndHour <= 10) {
          if (pathAndHour <= 7 || (pathAndHour > 7 && willpower >= 2 * (pathAndHour - 7))) {
            from = from || startingPosition
            let path = tiles.dijkstra.shortestPath(tiles.graph.vertices[from], tiles.graph.vertices[to], {
              OUT: { heuristic: (n) => distance(n, to) },
              IN: { heuristic: (n) => distance(n, from) },
            })
            if (path) {
              if (currentPath.length + path.length + hoursPassed > 10) {
                path = path.slice(0, 10 - currentPath.length - hoursPassed)
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
  drink(G, ctx) {
    const currentPos = G.players[ctx.playerID].positionOnMap
    const fogTokenIndex = G.tokens.findIndex((token) => token.type === 'well' && token.positionOnMap === currentPos)
    if (fogTokenIndex > -1) {
      let tokens = G.tokens
      let well = tokens.splice(fogTokenIndex, 1)[0]
      if (!well.used) {
        well.used = true
        G.players[ctx.playerID].willpower += 3
        tokens.push(well)
        G.tokens = tokens
      }
    }
  },
}

const LegendOfAndor = {
  name,
  minPlayers: 2,
  maxPlayers: 4,

  setup: (ctx, setupData) => {
    let monsters = []
    const positionsOfGors = [8, 20, 21, 26, 48]
    positionsOfGors.forEach((position) =>
      monsters.push({
        type: 'Gor',
        numDice: [2, 3, 3],
        willpower: 4,
        strength: 2,
        startingPos: position,
        positionOnMap: position,
      })
    )
    monsters.push({
      type: 'Skrall',
      numDice: [2, 3, 3],
      willpower: 6,
      strength: 6,
      startingPos: 19,
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
        dayEnd: false,
        hoveredArea: null,
        path: [],
      }
    }
    let difficulty = setupData ? setupData.difficulty : 'easy'
    let tokens = []
    Object.keys(tiles.fogAreas).forEach((positionOnMap) =>
      tokens.push({
        type: 'fog',
        positionOnMap: parseInt(positionOnMap),
        used: false,
      })
    )
    Object.keys(tiles.wellAreas).forEach((positionOnMap) =>
      tokens.push({
        type: 'well',
        positionOnMap: parseInt(positionOnMap),
        used: false,
      })
    )
    tokens.push({
      type: 'farmer',
      positionOnMap: 24,
      used: false,
    })
    if (difficulty === 'easy') {
      tokens.push({
        type: 'farmer',
        positionOnMap: 36,
        used: false,
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
      castleDefense: 5 - ctx.numPlayers,
      splittableResource: [],
      tempSplit: {},
      init: false,
    }
  },

  moves: {
    ...allPlayersMove,
    setupData: {
      move: (G, ctx, heroeslist) => {
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
          G.init = true
          ctx.events.setActivePlayers({ all: 'splitresource' })
        })
      },
      redact: true,
    },
    move(G, ctx, to) {
      const player = currentPlayer(G, ctx)
      G.players[ctx.currentPlayer].positionOnMap = to
      let newTotalHours = G.players[ctx.currentPlayer].hoursPassed + player.path.length
      if (newTotalHours > 7) {
        G.players[ctx.currentPlayer].willpower -= 2 * Math.min(newTotalHours - 7, player.path.length)
      }
      if (newTotalHours === 10) {
        G.players[ctx.currentPlayer].endDay = true
        newTotalHours = 0
      }
      G.players[ctx.currentPlayer].hoursPassed = newTotalHours
      Object.keys(G.players).map((playerID) => (G.players[playerID].path = []))
      if (Object.keys(tiles.fogAreas).indexOf(to + '') > -1) {
        let tokens = G.tokens
        const fogTokenIndex = tokens.findIndex((token) => token.type === 'fog' && token.positionOnMap === to)
        tokens.splice(fogTokenIndex, 1)
        G.tokens = tokens
        console.log('activating fog effect')
      }
      ctx.events.endTurn()
    },
    fight(G, ctx, id) {},
    skipTurn(G, ctx) {
      if (G.players[ctx.playerID].hoursPassed === 10) console.log('end day')
      else G.players[ctx.playerID].hoursPassed += 1
      ctx.events.endTurn()
    },
    endTurn(G, ctx) {
      ctx.events.endTurn()
    },
    endDay(G, ctx) {
      G.players[ctx.currentPlayer].endDay = true
      G.players[ctx.currentPlayer].hoursPassed = 0
      ctx.events.endTurn()
    },
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
      ctx.events.setActivePlayers({ others: 'displayMapInput', currentPlayer: 'play' })
    },
    onEnd: (G, ctx) => {
      if (Object.keys(G.players).every((playerID) => G.players[playerID].endDay)) {
        // moveMonsters
        const gors = G.monsters.filter((monster) => monster.type === 'Gor')
        let newGors = []
        gors.forEach((gor) => {
          let pos = gor.positionOnMap
          do {
            pos = tiles.nextTile[pos]
          } while (pos !== 0 && G.monsters.map((monster) => monster.positionOnMap).includes(pos))
          if (pos === 0) {
            G.castleDefense--
            if (G.castleDefense < 0) ctx.events.endGame()
          } else {
            gor.positionOnMap = pos
            let farmerPos = G.tokens.findIndex((token) => token.type === 'farmer' && token.positionOnMap === pos)
            if (farmerPos > -1) {
              G.tokens.splice(farmerPos, 1)
            }
            newGors.push(gor)
          }
        })
        const skralls = G.monsters.filter((monster) => monster.type === 'Skrall')
        let newSkralls = []
        skralls.forEach((skrall) => {
          let pos = skrall.positionOnMap
          do {
            pos = tiles.nextTile[pos]
          } while (pos !== 0 && G.monsters.map((monster) => monster.positionOnMap).includes(pos))
          if (pos === 0) {
            G.castleDefense--
            if (G.castleDefense < 0) ctx.events.endGame()
          } else {
            skrall.positionOnMap = pos
            let farmerPos = G.tokens.findIndex((token) => token.type === 'farmer' && token.positionOnMap === pos)
            if (farmerPos > -1) {
              G.tokens.splice(farmerPos, 1)
            }
            newSkralls.push(skrall)
          }
        })
        G.monsters = newGors.concat(newSkralls)
        // increment narrator
        G.letter = String.fromCharCode(G.letter.charCodeAt(0) + 1)
        // refill wells
        let tokens = G.tokens
        const charactersPos = Object.keys(G.players).map((playerID) => G.players[playerID].positionOnMap)
        const wellTokens = tokens.filter((token) => token.type === 'well')
        const nonWellTokens = tokens.filter((token) => token.type !== 'well')
        const newWellTokens = wellTokens.map((well) => {
          if (!charactersPos.includes(well.positionOnMap)) well.used = false
          return well
        })
        G.tokens = nonWellTokens.concat(newWellTokens)
        // reset day
        Object.keys(G.players).forEach((playerID) => (G.players[playerID].endDay = false))
      }
    },
    endIf: (G, ctx) => G.players[ctx.currentPlayer].endDay,
    stages: {
      splitresource: {
        moves: {
          add(G, ctx, type, quantity, playerID) {
            const totalRes = G.splittableResource.filter((res) => res.type === type).length
            let currentTotal = 0
            Object.keys(G.tempSplit).forEach((key) => (currentTotal += G.tempSplit[key][type]))
            if (G.tempSplit[playerID][type] + quantity >= 0 && currentTotal + quantity <= totalRes)
              G.tempSplit[playerID][type] += quantity
          },
          splitResource(G, ctx) {
            Object.keys(G.tempSplit).forEach((key) => {
              const res = G.tempSplit[key]
              Object.keys(res).map((type) => (G.players[key][type] += res[type]))
            })
            G.tempSplit = {}
            G.splittableResource = []
            ctx.events.setActivePlayers({ others: 'displayMapInput', currentPlayer: 'play' })
          },
        },
      },
      play: {},
      displayMapInput: {
        moves: {
          ...allPlayersMove,
        },
      },
    },
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
