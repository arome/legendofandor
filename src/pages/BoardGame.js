import { Client } from 'boardgame.io/react'
import { SocketIO } from 'boardgame.io/multiplayer'
import LegendOfAndor from '../game'
import Board from './Board'

export default Client({
  game: LegendOfAndor,
  board: Board,
  debug: true,
  multiplayer: SocketIO({ server: `http://localhost:8080` }),
})
