import React, { Component } from 'react'
import BoardGameClient from './BoardGame'

export default class Game extends Component {
  render() {
    return (
      <div>
        <BoardGameClient playerID="1" />
      </div>
    )
  }
}
