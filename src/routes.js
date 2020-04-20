import React from 'react'
import Lobby from './pages/Lobby'
import TestLobby from './pages/TestLobby'
import StartMenu from './pages/StartMenu'
import { Switch, Route } from 'react-router-dom'
import BoardGame from './pages/BoardGame'

export const routes = [
  { path: 'start-game', component: BoardGame },
  { path: 'lobby/:gameID', component: Lobby },
  { path: 'test-lobby', component: TestLobby },
  { path: '/', component: StartMenu },
]

export default function Routes() {
  return (
    <Switch>
      {routes.map((route) => (
        <Route key={route.path} path={`/${route.path}`} component={route.component} />
      ))}
    </Switch>
  )
}
