import { HeroType, SpecialAbility } from "../models/Character"

const hostname = typeof window !== 'undefined' && window.location.hostname
const PORT = process.env.PORT || 8000
export const chatApiKey = '413f2ac736e535cb958bc3bebf4442d2ed7c83fe'
export const appId = '180435fc778afec'
export const server = hostname === 'localhost' ? `http://${hostname}:${PORT}` : `https://${hostname}`
export const name = 'legend-of-andor'

export type heroColor = 'green' | 'yellow' | 'purple' | 'blue';
export const heroes: { [key in HeroType]: { color: heroColor, numDice: number[], specialAbility: SpecialAbility, positionOnMap: number } } = {
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
