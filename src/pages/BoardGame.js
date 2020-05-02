import React from 'react'
import { Client } from 'boardgame.io/react'
import { SocketIO } from 'boardgame.io/multiplayer'
import game from '../game'
import board from './Board'
import { server } from '../common'
import { useLocation } from 'react-router-dom'

// import logger from 'redux-logger'
// import { applyMiddleware } from 'redux'

export default () => {
  const location = useLocation()
  const { playerID, credentials, gameID, numPlayers } = location.state

  const App = Client({
    game,
    board,
    numPlayers,
    debug: true,
    // enhancer: applyMiddleware(logger),
    multiplayer: SocketIO({ server }),
  })

  return <App playerID={playerID.toString()} gameID={gameID} credentials={credentials} />
}
