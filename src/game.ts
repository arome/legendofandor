import tiles from './pages/tiles'
import { heroes, name } from './common'
import { Character, Hero, HeroType, Monster } from './models/Character'
import { Ctx } from 'boardgame.io'
import { IG, ItemType } from './models/Game'
import { UsableToken, FarmerToken } from './models/Token'

function distance(from: any, to: any) {
  var iDiff = from.data.i - to.data.i
  var jDiff = from.data.j - to.data.j
  return Math.sqrt(iDiff * iDiff + jDiff * jDiff)
}

const numberOfDice = (character: Character) => {
  const level = character.willpower >= 14 ? 2 : character.willpower >= 7 ? 1 : 0
  return character.numDice[level]
}

const currentPlayer = (G: IG, ctx: Ctx) => G.players[ctx.currentPlayer]

const allPlayersMove = {
  drawPath: {
    move: (G: IG, ctx: Ctx, from: number, to: number) => {
      let steps: number[][] = []
      const player = ctx.playerID ?? 0
      const { players } = G
      const startingPosition = players[ctx.currentPlayer].position
      const hoursPassed = players[ctx.currentPlayer].hoursPassed
      const willpower = players[ctx.currentPlayer].willpower
      const currentPath = players[player].path
      const areaInPath = currentPath.findIndex((step) => step.includes(to))
      if (to !== startingPosition) {
        if (areaInPath > -1)
          // Player clicked on an area already in path, remove path after it
          steps = currentPath.slice(0, areaInPath + 1)
        else {
          // Player clicked on a new area, extend path
          const pathAndHour = currentPath.length + hoursPassed
          if (pathAndHour <= 10) {
            if (pathAndHour <= 7 || (pathAndHour > 7 && willpower >= 2 * Math.min(pathAndHour - 7, currentPath.length))) {
              from = from || startingPosition
              let path = tiles.dijkstra.shortestPath(tiles.graph.vertices[from], tiles.graph.vertices[to], {
                OUT: { heuristic: (n: any) => distance(n, to) },
                IN: { heuristic: (n: any) => distance(n, from) },
              })
              if (path) {
                if (currentPath.length + path.length + hoursPassed > 10) {
                  path = path.slice(0, 10 - currentPath.length - hoursPassed)
                }
                const newSteps = path.map((step: any) => [parseInt(step.from.data.id), parseInt(step.to.data.id)])
                if (currentPath.length > 0) {
                  // If there was already a path drawn
                  const oldTo = [startingPosition].concat(players[player].path.map((step) => step[1]))
                  const newTo = newSteps.map((step: any) => step[1])
                  let newToList: number[] = []
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
      }
      G.players[player].path = steps
    },
    noLimit: true,
    redact: true,
  },
  setHoveredArea: {
    move: (G: IG, ctx: Ctx, area: any) => {
      G.players[ctx.playerID ?? 0].hoveredArea = area
    },
    noLimit: true,
    redact: true,
  },
  drink(G: IG, ctx: Ctx, index: number, bonus: boolean) {
    G.status = { id: 'drink well', data: { player: G.players[ctx.playerID ?? 0], bonus } }
    G.players[ctx.playerID ?? 0].willpower += bonus ? 5 : 3
    G.tokens.well[index].used = true
  },
  pickFarmer(G: IG, ctx: Ctx, index: number) {
    G.status = { id: 'farmer picked', data: { player: ctx.playerID } }
    G.tokens.farmer[index].picked = true;
    G.players[ctx.playerID ?? 0].pickedFarmers.push(G.tokens.farmer[index].id)
  },
  dropFarmer(G: IG, ctx: Ctx, index: number) {
    const position = G.players[ctx.playerID ?? 0].position
    G.status = { id: 'farmer dropped', data: { position } }
    const farmer = G.tokens.farmer[index]
    G.players[ctx.playerID ?? 0].pickedFarmers.splice(G.players[ctx.playerID ?? 0].pickedFarmers.indexOf(farmer.id), 1)
    if (position === 0) {
      G.castleDefense += 1
      G.tokens.farmer.splice(index, 1)
    } else {
      G.tokens.farmer[index].picked = false;
    }
  },
  clearStatus: {
    move: (G: IG, ctx: Ctx, endTurn: boolean) => {
      if (endTurn) {
        G.fight = {}
        // @ts-ignore
        ctx.events?.endTurn();
      }
      G.status = { id: '', data: null }
    },
    noLimit: true,
    redact: true
  }
}

const LegendOfAndor = {
  name,
  minPlayers: 2,
  maxPlayers: 4,

  setup: (ctx: Ctx, setupData: any) => {
    let monsters: Monster[] = []
    const positionsOfGors = [8, 20, 21, 26, 48]
    positionsOfGors.forEach((position) =>
      monsters.push({
        type: 'Gor',
        numDice: [2, 3, 3],
        willpower: 4,
        strength: 2,
        rewards: {
          gold: 2,
          willpower: 2,
        },
        id: position,
        position,
      })
    )
    monsters.push({
      type: 'Skrall',
      numDice: [2, 3, 3],
      willpower: 6,
      rewards: {
        gold: 4,
        willpower: 4,
      },
      strength: 6,
      id: 19,
      position: 19,
    })

    let difficulty = setupData ? setupData.difficulty : 'easy'
    let fogTokens: UsableToken[] = []
    for (const position in tiles.fogAreas) {
      fogTokens.push({
        position: parseInt(position),
        used: false,
      })
    }
    const wellTokens: UsableToken[] = []
    for (const position in tiles.wellAreas) {
      wellTokens.push({
        position: parseInt(position),
        used: false,
      })
    }
    const farmerTokens: FarmerToken[] = []
    farmerTokens.push({
      id: 24,
      position: 24,
      picked: false,
    })
    if (difficulty === 'easy') {
      farmerTokens.push({
        id: 36,
        position: 36,
        picked: false,
      })
    }

    return {
      difficulty,
      rollingDices: [],
      round: 0,
      legend: 1,
      letter: 'A',
      tokens: {
        fog: fogTokens,
        well: wellTokens,
        farmer: farmerTokens
      },
      monsters,
      fight: {},
      status: '',
      castleDefense: 5 - ctx.numPlayers,
      resources: {},
      init: false,
    }
  },

  moves: {
    ...allPlayersMove,
    setupData: {
      move: (G: IG, ctx: Ctx, heroeslist: HeroType[], namelist: string[]) => {
        const players: { [key: number]: Hero } = {}
        for (let i = 0; i < ctx.numPlayers; i++) {
          const type = heroeslist[i]
          const { position, numDice, specialAbility } = heroes[type]
          players[i] = {
            id: i,
            type,
            hoursPassed: 0,
            specialAbilities: { bait: false, proxyAttack: false, wellPower: false, flipDice: false },
            strength: 2,
            willpower: 7,
            pickedFarmers: [],
            items: {
              gold: 0,
              wineskin: 0
            },
            position,
            endDay: false,
            hoveredArea: null,
            path: [],
            numDice,
            name: namelist[i]
          }
          players[i].specialAbilities[specialAbility] = true
        }
        G.players = players;
        G.resources.total = { gold: 5, wineskin: 2 }
        let tempSplit: { [key: number]: { [key: string]: number } } = {}
        for (let i = 0; i < ctx.numPlayers; i++) {
          let initObject: { [key: string]: number } = {}
          for (const type in G.resources.total)
            initObject[type] = 0
          tempSplit[i] = initObject
        }
        G.resources.current = tempSplit
        G.init = true
        //@ts-ignore
        ctx.events?.setActivePlayers({ all: 'splitresource' })
      },
      redact: true,
      noLimit: true
    },
    move: {
      move: (G: IG, ctx: Ctx, to: number) => {
        const player = currentPlayer(G, ctx)
        G.players[ctx.currentPlayer].position = to
        if (player.pickedFarmers.length > 0) {
          const newFarmers = G.tokens.farmer.map((farmer) => {
            if (player.pickedFarmers.includes(farmer.id)) farmer.position = to
            return farmer
          })
          G.tokens.farmer = newFarmers
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
        const fogIndex = G.tokens.fog.findIndex(fog => fog.position === to);
        if (fogIndex > -1) {
          G.tokens.fog.splice(fogIndex, 1)
          // Object.keys(G.players).forEach(playerID => {
          //   G.players[playerID].willpower += 1
          // })
          console.log('activating fog effect')
        }
        // @ts-ignore
        ctx.events?.endTurn()
      },
      redact: false,
      noLimit: false
    },
    skipTurn(G: IG, ctx: Ctx) {
      if (G.players[ctx.playerID ?? 0].hoursPassed === 10) {
        G.players[ctx.playerID ?? 0].endDay = true
      } else G.players[ctx.playerID ?? 0].hoursPassed += 1
      // @ts-ignore
      ctx.events?.endTurn()
    },
    endTurn(G: IG, ctx: Ctx) {
      // @ts-ignore
      ctx.events?.endTurn()
    },
    endDay(G: IG, ctx: Ctx) {
      G.players[ctx.currentPlayer].endDay = true
      G.players[ctx.currentPlayer].hoursPassed = 0
    },
    startFight: (G: IG, ctx: Ctx, id: number) => {
      G.fight = { turn: 'player', monster: { id } }
      G.rollingDices = ctx.random?.D6(numberOfDice(currentPlayer(G, ctx))) ?? []
    },
    monsterAttack: {
      move: (G: IG, ctx: Ctx) => {
        const monster = G.monsters.filter((monster) => monster.id === G.fight.monster.id)[0]
        let newValue = G.rollingDices
        if (currentPlayer(G, ctx).specialAbilities.flipDice) {
          newValue = [G.rollingDices[0] < 4 ? 7 - G.rollingDices[0] : G.rollingDices[0]]
        }
        G.fight['player'] = newValue
        G.fight['turn'] = 'monster'
        G.rollingDices = ctx.random?.D6(numberOfDice(monster)) as number[]
      },
      redact: true,
      noLimit: true
    },
    endFight: {
      move: (G: IG, ctx: Ctx) => {
        let summary = ''
        const monsterIndex = G.monsters.findIndex((monster) => monster.id === G.fight.monster.id)
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
          monster.position = 80
          G.letter = String.fromCharCode(G.letter.charCodeAt(0) + 1)
          if (G.letter === 'C') {
            let newMonsters = G.monsters
            const position = 32
            newMonsters.push({
              type: 'Gor',
              numDice: [2, 3, 3],
              willpower: 4,
              strength: 2,
              rewards: {
                gold: 2,
                willpower: 2,
              },
              id: position,
              position,
            })
            newMonsters.push({
              type: 'Skrall',
              numDice: [2, 3, 3],
              willpower: 6,
              rewards: {
                gold: 4,
                willpower: 4,
              },
              strength: 6,
              id: 39,
              position: 39,
            })
            if (G.difficulty !== 'easy') {
              newMonsters.push({
                type: 'Gor',
                numDice: [2, 3, 3],
                willpower: 4,
                strength: 2,
                rewards: {
                  gold: 2,
                  willpower: 2,
                },
                id: 43,
                position: 43,
              })
            }
            G.monsters = newMonsters
          }
          G.players[ctx.currentPlayer].items.gold += monster.rewards.gold
          G.players[ctx.currentPlayer].willpower += monster.rewards.willpower
          summary += `<p>The ${monster.type} has been defeated!</p>
        <p>${currentPlayer(G, ctx).name} received ${monster.rewards.gold} golds and ${
            monster.rewards.willpower
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
        G.status = {
          id: 'fight summary', data: {
            player: { ...currentPlayer(G, ctx), attack: playerAttack },
            monster: { ...monster, attack: monsterAttack },
            summary,
          }
        }
        G.fight = {}
        G.rollingDices = []
      },
      redact: true,
      noLimit: true
    },
  },

  turn: {
    // Called at the beginning of a turn.
    onBegin: (G: IG, ctx: Ctx) => {
      // @ts-ignore
      ctx.events?.setActivePlayers({ others: 'displayMapInput', currentPlayer: 'play' })
    },
    onEnd: (G: IG, ctx: Ctx) => {
      Object.keys(G.players).map((playerID) => (G.players[playerID].path = []))
      if (
        Object.keys(G.players).every((playerID) => {
          return G.players[playerID].endDay
        })
      ) {
        G.status = { id: 'new day', data: null }
        // moveMonsters
        const gors = G.monsters.filter((monster) => monster.type === 'Gor')
        let newGors: Monster[] = []
        gors.forEach((gor) => {
          let pos = gor.position
          do {
            pos = tiles.nextTile[pos]
          } while (pos !== 0 && pos !== 80 && G.monsters.map((monster) => monster.position).includes(pos))
          if (pos === 0) {
            G.castleDefense--
            if (G.castleDefense < 0) {
              G.status = { id: 'game over', data: null }
            }
          } else {
            gor.position = pos
            let farmerIndex = G.tokens.farmer.findIndex((token) => token.position === pos)
            if (farmerIndex > -1) {
              G.tokens.farmer.splice(farmerIndex, 1)
            }
            newGors.push(gor)
          }
        })
        const skralls = G.monsters.filter((monster) => monster.type === 'Skrall')
        let newSkralls: Monster[] = []
        skralls.forEach((skrall) => {
          let pos = skrall.position
          do {
            pos = tiles.nextTile[pos]
          } while (pos !== 0 && G.monsters.map((monster) => monster.position).includes(pos))
          if (pos === 0) {
            G.castleDefense--
            if (G.castleDefense < 0) {
              G.status = { id: 'game over', data: null }
            }
          } else {
            skrall.position = pos
            let farmerIndex = G.tokens.farmer.findIndex((token) => token.position === pos)
            if (farmerIndex > -1) {
              G.tokens.farmer.splice(farmerIndex, 1)
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
            rewards: {
              gold: 2,
              willpower: 2,
            },
            id: 32,
            position: 32,
          })
          monsters.push({
            type: 'Skrall',
            numDice: [2, 3, 3],
            willpower: 6,
            rewards: {
              gold: 4,
              willpower: 4,
            },
            strength: 6,
            id: 39,
            position: 39,
          })
          if (G.difficulty !== 'easy') {
            monsters.push({
              type: 'Gor',
              numDice: [2, 3, 3],
              willpower: 4,
              strength: 2,
              rewards: {
                gold: 2,
                willpower: 2,
              },
              id: 43,
              position: 43,
            })
          }
          G.monsters = monsters
        }
        // refill wells
        const charactersPosition = Object.keys(G.players).map((playerID) => G.players[playerID].position)
        for (const index in G.tokens.well) {
          if (!charactersPosition.includes(G.tokens.well[index].position))
            G.tokens.well[index].used = false
        }
        // reset day
        for (const playerID in G.players)
          G.players[playerID].endDay = false
      } else {
        G.status = { id: 'next turn', data: null }
      }
    },
    endIf: (G: IG, ctx: Ctx) => G.players[ctx.currentPlayer].endDay,
    stages: {
      splitresource: {
        moves: {
          add: {
            move: (G: IG, ctx: Ctx, type: ItemType, quantity: number, playerID: string) => {
              G.resources.current[playerID][type] = (G.resources.current[playerID][type] ?? 0) + quantity
            },
            redact: true,
            noLimit: true
          },
          splitResource: {
            move: (G: IG, ctx: Ctx) => {
              for (const playerID in G.resources.current) {
                const resources = G.resources.current[playerID]
                for (const type in resources)
                  G.players[playerID]['items'][type as ItemType] += resources[type as ItemType] ?? 0
              }
              G.resources.current = {}
              G.resources.total = {}
              // @ts-ignore
              ctx.events?.setActivePlayers({ others: 'displayMapInput', currentPlayer: 'play' })
            },
            redact: true,
            noLimit: true
          }
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

  endIf: (G: IG) => {
    if (G.castleDefense < 0) {
      return 'You have lost the game'
    }
    if (G.letter === 'N') {
      if (G.monsters.filter((monster) => monster.type === 'Skrall').length > 0) return 'You have lost the game'
      else return 'You have won the game'
    }
  },
}

export default LegendOfAndor
