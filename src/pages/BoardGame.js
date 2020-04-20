import { Client } from 'boardgame.io/react'
import { SocketIO, Local } from 'boardgame.io/multiplayer'
import LegendOfAndor from '../game'
import Board from './Board'
import { server } from '../common'

import logger from 'redux-logger'
import { applyMiddleware } from 'redux'

export default Client({
  game: LegendOfAndor,
  board: Board,
  debug: true,
  enhancer: applyMiddleware(logger),
  multiplayer: Local(), //SocketIO({ server }),
})
