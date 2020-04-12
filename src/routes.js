import React from 'react'
import Lobby from './pages/Lobby'
import BoardGame from './pages/BoardGame'
import { Switch, Route } from 'react-router-dom'

export const routes = [
  { path: 'start-game', component: BoardGame },
  { path: '/', component: Lobby },
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
