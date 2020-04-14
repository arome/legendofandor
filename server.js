const Server = require('boardgame.io/server').Server
const LegendOfAndor = require('./src/game')

const PORT = process.env.PORT || 8080
const server = Server({ games: [LegendOfAndor] })
server.run(PORT, () => {
  console.log(`Serving at: http://localhost:${PORT}/`)
})
