import tiles from './pages/tiles'
import { Stage } from 'boardgame.io/core'
import { heroes, name } from './common'

function distance(from, to) {
  var iDiff = from.data.i - to.data.i
  var jDiff = from.data.j - to.data.j
  return Math.sqrt(iDiff * iDiff + jDiff * jDiff)
}

const numberOfDice = (character) => {
  const level = character.willpower >= 14 ? 2 : character.willpower >= 7 ? 1 : 0
  return character.numDice[level]
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
          if (pathAndHour <= 7 || (pathAndHour > 7 && willpower >= 2 * Math.min(pathAndHour - 7, currentPath.length))) {
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
  drink(G, ctx, wellTokenIndex, willpower) {
    let tokens = G.tokens
    let well = tokens.splice(wellTokenIndex, 1)[0]
    well.used = true
    G.players[ctx.playerID].willpower += willpower
    tokens.push(well)
    G.tokens = tokens
  },
  pickFarmer(G, ctx, farmerTokenIndex) {
    let tokens = G.tokens
    let farmer = tokens.splice(farmerTokenIndex, 1)[0]
    farmer.picked = true
    G.players[ctx.playerID].pickedFarmer.push(farmer.startingPos)
    tokens.push(farmer)
    G.tokens = tokens
  },
  dropFarmer(G, ctx, farmerTokenIndex) {
    let tokens = G.tokens
    let farmer = tokens.splice(farmerTokenIndex, 1)[0]
    farmer.picked = false
    let currentPickedFarmer = G.players[ctx.playerID].pickedFarmer
    currentPickedFarmer.splice(currentPickedFarmer.indexOf(farmer.startingPos), 1)
    G.players[ctx.playerID].pickedFarmer = currentPickedFarmer
    if (G.players[ctx.playerID].positionOnMap === 0) {
      G.castleDefense += 1
    } else {
      tokens.push(farmer)
    }
    G.tokens = tokens
  },
  clearStatus: (G, ctx, endTurn) => {
    if (endTurn) {
      G.fight = {}
      ctx.events.endTurn()
    }
    G.status = null
  },
  sendMessage(G, ctx, message) {
    G.messages.push(message)
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
        reward: {
          gold: 2,
          willpower: 2,
        },
        startingPos: position,
        positionOnMap: position,
      })
    )
    monsters.push({
      type: 'Skrall',
      numDice: [2, 3, 3],
      willpower: 6,
      reward: {
        gold: 4,
        willpower: 4,
      },
      strength: 6,
      startingPos: 19,
      positionOnMap: 19,
    })

    const players = {}
    for (let i = 0; i < ctx.numPlayers; i++) {
      players[i] = {
        hoursPassed: 0,
        numDice: 2,
        specialAbilities: { bait: false, proxyAttack: false, wellPower: false, flipDice: false },
        strength: 2,
        willpower: 7,
        pickedFarmer: [],
        gold: 0,
        wineskin: 0,
        positionOnMap: 0,
        endDay: false,
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
      startingPos: 24,
      positionOnMap: 24,
      picked: false,
    })
    if (difficulty === 'easy') {
      tokens.push({
        type: 'farmer',
        startingPos: 36,
        positionOnMap: 36,
        picked: false,
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
      messages: [],
      fight: {},
      status: null,
      castleDefense: 5 - ctx.numPlayers,
      splittableResource: {},
      tempSplit: {},
      init: false,
    }
  },

  moves: {
    ...allPlayersMove,
    setupData: {
      move: (G, ctx, heroeslist, namelist) => {
        Object.keys(G.players).forEach((pos) => {
          const hero = heroes[heroeslist[pos]]
          G.players[pos].numDice = hero.numDice
          G.players[pos].specialAbilities[hero.specialAbility] = true
          G.players[pos].positionOnMap = hero.positionOnMap
          G.players[pos].name = namelist[pos]
          G.splittableResource = { gold: 5, wineskin: 2 }
          let tempSplit = {}
          Object.keys(G.players).forEach((key) => {
            let initObject = {}
            Object.keys(G.splittableResource).forEach((type) => {
              initObject[type] = 0
            })
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
      if (player.pickedFarmer.length > 0) {
        const farmers = G.tokens.filter((token) => token.type === 'farmer')
        const nonFarmers = G.tokens.filter((token) => token.type !== 'farmer')
        const newFarmers = farmers.map((farmer) => {
          if (player.pickedFarmer.includes(farmer.startingPos)) farmer.positionOnMap = to
          return farmer
        })
        G.tokens = nonFarmers.concat(newFarmers)
      }
      let newTotalHours = G.players[ctx.currentPlayer].hoursPassed + player.path.length
      if (newTotalHours > 7) {
        G.players[ctx.currentPlayer].willpower -= 2 * Math.min(newTotalHours - 7, player.path.length)
      }
      if (newTotalHours === 10) {
        G.players[ctx.currentPlayer].endDay = true
        newTotalHours = 0
      }
      G.players[ctx.currentPlayer].hoursPassed = newTotalHours
      if (Object.keys(tiles.fogAreas).indexOf(to + '') > -1) {
        let tokens = G.tokens
        const fogTokenIndex = tokens.findIndex((token) => token.type === 'fog' && token.positionOnMap === to)
        tokens.splice(fogTokenIndex, 1)
        G.tokens = tokens

        // Object.keys(G.players).forEach(playerID => {
        //   G.players[playerID].willpower += 1
        // })
        console.log('activating fog effect')
      }
      ctx.events.endTurn()
    },
    skipTurn(G, ctx) {
      if (G.players[ctx.playerID].hoursPassed === 10) {
        G.players[ctx.playerID].endDay = true
      } else G.players[ctx.playerID].hoursPassed += 1
      ctx.events.endTurn()
    },
    endTurn(G, ctx) {
      ctx.events.endTurn()
    },
    endDay(G, ctx) {
      G.players[ctx.currentPlayer].endDay = true
      G.players[ctx.currentPlayer].hoursPassed = 0
    },
    startFight: (G, ctx, position) => {
      return {
        ...G,
        fight: { monster: { position } },
        rollingDices: ctx.random.D6(numberOfDice(currentPlayer(G, ctx))),
      }
    },
    monsterAttack: (G, ctx) => {
      const monster = G.monsters.filter((monster) => monster.positionOnMap === G.fight.monster.position)[0]
      let newValue = G.rollingDices
      if (currentPlayer(G, ctx).specialAbilities.flipDice) {
        newValue = [G.rollingDices[0] < 4 ? 7 - G.rollingDices[0] : G.rollingDices[0]]
      }
      let fight = G.fight
      fight['player'] = newValue
      return { ...G, fight, rollingDices: ctx.random.D6(numberOfDice(monster)) }
    },
    endFight: (G, ctx) => {
      let summary = ''
      const position = currentPlayer(G, ctx).positionOnMap
      const monsterIndex = G.monsters.findIndex(
        (monster) =>
          monster.positionOnMap === position ||
          (currentPlayer(G, ctx).specialAbilities.proxyAttack &&
            tiles.neighbors[position].includes(monster.positionOnMap))
      )
      let monsters = G.monsters
      let monster = monsters.splice(monsterIndex, 1)[0]
      const playerAttack = Math.max(...G.fight.player) + currentPlayer(G, ctx).strength
      const monsterRoll = G.rollingDices
      const highestValues = monsterRoll.filter((die) => die === Math.max(...monsterRoll))
      const monsterAttack = highestValues.reduce((a, b) => a + b, 0) + monster.strength
      const fightResult = playerAttack - monsterAttack
      if (fightResult > 0) {
        monster.willpower -= fightResult
        summary += `<p>The ${monster.type} lost ${fightResult} willpower${fightResult > 1 ? 's' : ''}.</p>`
      } else if (fightResult < 0) {
        G.players[ctx.currentPlayer].willpower += fightResult
        summary += `<p>${currentPlayer(G, ctx).name} lost ${fightResult} willpower${fightResult > 1 ? 's' : ''}.</p>`
      } else {
        summary += `<p>The fight ended in a draw.</p>`
      }

      if (monster.willpower < 1) {
        monster.positionOnMap = 80
        G.letter = String.fromCharCode(G.letter.charCodeAt(0) + 1)
        if (G.letter === 'C') {
          let newMonsters = G.monsters
          newMonsters.push({
            type: 'Gor',
            numDice: [2, 3, 3],
            willpower: 4,
            strength: 2,
            reward: {
              gold: 2,
              willpower: 2,
            },
            startingPos: 32,
            positionOnMap: 32,
          })
          newMonsters.push({
            type: 'Skrall',
            numDice: [2, 3, 3],
            willpower: 6,
            reward: {
              gold: 4,
              willpower: 4,
            },
            strength: 6,
            startingPos: 39,
            positionOnMap: 39,
          })
          if (G.difficulty !== 'easy') {
            newMonsters.push({
              type: 'Gor',
              numDice: [2, 3, 3],
              willpower: 4,
              strength: 2,
              reward: {
                gold: 2,
                willpower: 2,
              },
              startingPos: 43,
              positionOnMap: 43,
            })
          }
          G.monsters = newMonsters
        }
        G.players[ctx.currentPlayer].gold += monster.reward.gold
        G.players[ctx.currentPlayer].willpower += monster.reward.willpower
        summary += `<p>The ${monster.type} has been defeated!</p>
        <p>${currentPlayer(G, ctx).name} received ${monster.reward.gold} golds and ${
          monster.reward.willpower
        } willpowers.</p>`
      } else if (G.players[ctx.currentPlayer].willpower < 1) {
        G.players[ctx.currentPlayer].willpower = 3
        G.players[ctx.currentPlayer].strength = Math.max(G.players[ctx.currentPlayer].strength - 1, 0)
        summary += `<p>${currentPlayer(G, ctx).name} has been defeated and now has ${Math.max(
          G.players[ctx.currentPlayer].strength - 1,
          0
        )} strength point. ${currentPlayer(G, ctx).name} willpower were reset to 3.</p>`
      }
      monsters.push(monster)
      G.monsters = monsters
      G.players[ctx.currentPlayer].hoursPassed += 1
      G.status = 'fight summary'
      G.fight = {
        result: {
          player: { name: currentPlayer(G, ctx).name, attack: playerAttack },
          monster: { name: monster.type, attack: monsterAttack },
          summary,
        },
      }
      G.dices = []
      G.rollingDices = null
    },
  },

  turn: {
    // Called at the beginning of a turn.
    onBegin: (G, ctx) => {
      ctx.events.setActivePlayers({ others: 'displayMapInput', currentPlayer: 'play' })
    },
    onEnd: (G, ctx) => {
      Object.keys(G.players).map((playerID) => (G.players[playerID].path = []))
      if (
        Object.keys(G.players).every((playerID) => {
          return G.players[playerID].endDay
        })
      ) {
        G.status = 'new day'
        // moveMonsters
        const gors = G.monsters.filter((monster) => monster.type === 'Gor')
        let newGors = []
        gors.forEach((gor) => {
          let pos = gor.positionOnMap
          do {
            pos = tiles.nextTile[pos]
          } while (pos !== 0 && pos !== 80 && G.monsters.map((monster) => monster.positionOnMap).includes(pos))
          if (pos === 0) {
            G.castleDefense--
            if (G.castleDefense < 0) {
              G.status = 'game over'
              ctx.events.endGame()
            }
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
            if (G.castleDefense < 0) {
              G.status = 'game over'
              ctx.events.endGame()
            }
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
        const newLetter = String.fromCharCode(G.letter.charCodeAt(0) + 1)
        G.letter = newLetter
        if (newLetter === 'C') {
          let monsters = G.monsters
          monsters.push({
            type: 'Gor',
            numDice: [2, 3, 3],
            willpower: 4,
            strength: 2,
            reward: {
              gold: 2,
              willpower: 2,
            },
            startingPos: 32,
            positionOnMap: 32,
          })
          monsters.push({
            type: 'Skrall',
            numDice: [2, 3, 3],
            willpower: 6,
            reward: {
              gold: 4,
              willpower: 4,
            },
            strength: 6,
            startingPos: 39,
            positionOnMap: 39,
          })
          if (G.difficulty !== 'easy') {
            monsters.push({
              type: 'Gor',
              numDice: [2, 3, 3],
              willpower: 4,
              strength: 2,
              reward: {
                gold: 2,
                willpower: 2,
              },
              startingPos: 43,
              positionOnMap: 43,
            })
          }
          G.monsters = monsters
        }
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
      } else {
        G.status = 'next turn'
      }
    },
    endIf: (G, ctx) => G.players[ctx.currentPlayer].endDay,
    stages: {
      splitresource: {
        moves: {
          add(G, ctx, type, quantity, playerID) {
            let currentTotal = 0
            Object.keys(G.tempSplit).forEach((key) => (currentTotal += G.tempSplit[key][type]))
            if (G.tempSplit[playerID][type] + quantity >= 0 && currentTotal + quantity <= G.splittableResource[type])
              G.tempSplit[playerID][type] += quantity
          },
          splitResource(G, ctx) {
            Object.keys(G.tempSplit).forEach((key) => {
              const res = G.tempSplit[key]
              Object.keys(res).map((type) => (G.players[key][type] += res[type]))
            })
            G.tempSplit = {}
            G.splittableResource = {}
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
      if (G.monsters.filter((monster) => monster.type === 'Skrall').length > 0) return 'You have lost the game'
      else return 'You have won the game'
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
