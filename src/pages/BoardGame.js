import React from 'react'
import { Client } from 'boardgame.io/react'
import { SocketIO, Local } from 'boardgame.io/multiplayer'
import game from '../game'
import board from './Board'
import { server } from '../common'

import logger from 'redux-logger'
import { applyMiddleware } from 'redux'

export default (props) => {
  const { playerID, playerCredentials, gameID, numPlayers } = props

  const App = Client({
    game,
    board,
    numPlayers,
    debug: true,
    enhancer: applyMiddleware(logger),
    multiplayer: server.includes('localhost') ? Local() : SocketIO({ server }),
  })

  return <App playerID={playerID} gameID={gameID} credentials={playerCredentials} />
}
