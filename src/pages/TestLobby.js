import React from 'react'
import { Lobby } from 'boardgame.io/react'
import { default as BoardLOA } from './Board'
import GameLOA from '../game'
import './Lobby.css'

const hostname = window.location.hostname
const importedGames = [{ game: GameLOA, board: BoardLOA }]

const LobbyView = () => (
  <div>
    <h1>Lobby</h1>

    <Lobby
      gameServer={`http://${hostname}:8000`}
      lobbyServer={`http://${hostname}:8000`}
      gameComponents={importedGames}
    />
  </div>
)

export default LobbyView
