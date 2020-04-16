import { Client } from 'boardgame.io/react'
import { SocketIO, Local } from 'boardgame.io/multiplayer'
import LegendOfAndor from '../game'
import Board from './Board'

const hostname = window.location.hostname
const PORT = process.env.PORT || 8000

export default Client({
  game: LegendOfAndor,
  board: Board,
  debug: true,
  multiplayer: SocketIO({ server: `${hostname}:${PORT}` }),
})
