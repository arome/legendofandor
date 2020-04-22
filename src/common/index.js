const hostname = typeof window !== 'undefined' && window.location.hostname
const PORT = process.env.PORT || 8000
export const server = hostname === 'localhost' ? `http://${hostname}:${PORT}` : `https://${hostname}`
// export const server = 'https://legendofandor.herokuapp.com'
export const name = 'legend-of-andor'
export const heroes = {
  Archer_female: {
    color: 'green',
    numDice: [3, 4, 5],
    specialAbility: 'ProxyAttack',
  },
  Archer_male: {
    color: 'green',
    numDice: [3, 4, 5],
    specialAbility: 'ProxyAttack',
  },
  Dwarf_female: {
    color: 'yellow',
    numDice: [1, 2, 3],
    specialAbility: 'Bait',
  },
  Dwarf_male: {
    color: 'yellow',
    numDice: [1, 2, 3],
    specialAbility: 'Bait',
  },
  Warrior_male: {
    color: 'blue',
    numDice: [2, 3, 4],
    specialAbility: 'WellPower',
  },
  Warrior_female: {
    color: 'blue',
    numDice: [2, 3, 4],
    specialAbility: 'WellPower',
  },
  Mage_male: {
    color: 'purple',
    numDice: [1, 1, 1],
    specialAbility: 'FlipDice',
  },
  Mage_female: {
    color: 'purple',
    numDice: [1, 1, 1],
    specialAbility: 'FlipDice',
  },
}
export const separator = '@#@_@#@_@#@'
