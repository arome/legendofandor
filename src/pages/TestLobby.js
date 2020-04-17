import React from 'react'
import { Lobby } from 'boardgame.io/react'
import { default as BoardLOA } from './Board'
import GameLOA from '../game'
import './Lobby.css'

const api = 'https://legendofandor.herokuapp.com'
const importedGames = [{ game: GameLOA, board: BoardLOA }]

const LobbyView = () => (
  <div>
    <h1>Lobby</h1>
    <Lobby gameServer={api} lobbyServer={api} gameComponents={importedGames} />
  </div>
)

export default LobbyView
