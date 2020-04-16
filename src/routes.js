import React from 'react'
import Lobby from './pages/Lobby'
import TestLobby from './pages/TestLobby'
import Game1 from './pages/Game1'
import Game2 from './pages/Game2'
// import BoardGame from './pages/BoardGame'
import StartMenu from './pages/StartMenu'
import { Switch, Route } from 'react-router-dom'

export const routes = [
  { path: 'start-game-1', component: Game1 },
  { path: 'start-game-2', component: Game2 },
  { path: 'lobby', component: Lobby },
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
