import React from 'react'
import { Lobby } from 'boardgame.io/react'
import { default as BoardLOA } from './Board'
import GameLOA from '../game'
import './Lobby.scss'
import { server } from '../common'

const importedGames = [{ game: GameLOA, board: BoardLOA }]

const LobbyView = () => (
  <div>
    <h1>Lobby</h1>
    <Lobby gameServer={server} lobbyServer={server} gameComponents={importedGames} />
  </div>
)

export default LobbyView
