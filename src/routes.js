import React from 'react'
import Lobby from './pages/Lobby'
import BoardGame from './pages/BoardGame'
import StartMenu from './pages/StartMenu'
import { Switch, Route } from 'react-router-dom'

export const routes = [
  { path: 'start-game', component: BoardGame },
  { path: 'lobby', component: Lobby },
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
