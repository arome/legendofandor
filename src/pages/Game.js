import React, { Component } from 'react'
import BoardGameClient from './BoardGame'
import { withRouter } from 'react-router-dom'
class Game extends Component {
  constructor(props) {
    super(props)
    this.state = props.location.state
  }
  render() {
    const { playerID, playerCredentials, gameID } = this.state
    return (
      <div>
        <BoardGameClient playerID={playerID.toString()} credentials={playerCredentials} gameID={gameID} />
      </div>
    )
  }
}

export default withRouter(Game)
