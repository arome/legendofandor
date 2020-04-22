import LOA from '../game'

const hostname = window.location.hostname
const PORT = process.env.PORT || 8000
export const server = hostname === 'localhost' ? `http://${hostname}:${PORT}` : `https://${hostname}`
// export const server = 'https://legendofandor.herokuapp.com'
export const name = LOA.name
export const playersColor = ['red', 'blue', 'green', 'yellow']
export const heroesColor = {
  Archer_female: 'green',
  Archer_male: 'green',
  Dwarf_female: 'yellow',
  Dwarf_male: 'yellow',
  Warrior_male: 'blue',
  Warrior_female: 'blue',
  Mage_male: 'purple',
  Mage_female: 'purple',
}
export const separator = '@#@_@#@_@#@'
