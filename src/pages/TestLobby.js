import React from 'react'
import { Lobby } from 'boardgame.io/react'
import { default as BoardLOA } from './Board'
import GameLOA from '../game'
import './Lobby.css'

const hostname = window.location.hostname
const PORT = process.env.PORT || 8000
const url = `http${hostname === 'localhost' ? '' : 's'}://${hostname}:${PORT}`
const importedGames = [{ game: GameLOA, board: BoardLOA }]

const LobbyView = () => (
  <div>
    <h1>Lobby</h1>
    <Lobby gameServer={url} lobbyServer={url} gameComponents={importedGames} />
  </div>
)

export default LobbyView
