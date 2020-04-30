const hostname = typeof window !== 'undefined' && window.location.hostname
const PORT = process.env.PORT || 8000
export const server = hostname === 'localhost' ? `http://${hostname}:${PORT}` : `https://${hostname}`
export const name = 'legend-of-andor'
export const heroes = {
  Archer_female: {
    color: 'green',
    numDice: [3, 4, 5],
    specialAbility: 'proxyAttack',
    positionOnMap: 25,
  },
  Archer_male: {
    color: 'green',
    numDice: [3, 4, 5],
    specialAbility: 'proxyAttack',
    positionOnMap: 25,
  },
  Dwarf_female: {
    color: 'yellow',
    numDice: [1, 2, 3],
    specialAbility: 'bait',
    positionOnMap: 7,
  },
  Dwarf_male: {
    color: 'yellow',
    numDice: [1, 2, 3],
    specialAbility: 'bait',
    positionOnMap: 7,
  },
  Warrior_male: {
    color: 'blue',
    numDice: [2, 3, 4],
    specialAbility: 'wellPower',
    positionOnMap: 14,
  },
  Warrior_female: {
    color: 'blue',
    numDice: [2, 3, 4],
    specialAbility: 'wellPower',
    positionOnMap: 14,
  },
  Mage_male: {
    color: 'purple',
    numDice: [1, 1, 1],
    specialAbility: 'flipDice',
    positionOnMap: 34,
  },
  Mage_female: {
    color: 'purple',
    numDice: [1, 1, 1],
    specialAbility: 'flipDice',
    positionOnMap: 34,
  },
}
export const separator = '@#@_@#@_@#@'
