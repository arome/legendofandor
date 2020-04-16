import LegendOfAndor from './src/game'
import { Server } from 'boardgame.io/server'

const PORT = process.env.PORT || 8000
const server = Server({ games: [LegendOfAndor] })
server.run(PORT, () => {
  console.log(`Serving at: http://localhost:${PORT}/`)
})
