import React from 'react'
import logo from '../logo.svg'
import { AwesomeButton } from 'react-awesome-button'
import styles from 'react-awesome-button/src/styles/themes/theme-blue'
import './Lobby.css'
import { Link } from 'react-router-dom'

function Lobby() {
  return (
    <div>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Welcome to the game Legend of Andor</p>
        <Link to="/start-game">
          <AwesomeButton cssmodule={styles} type="primary">
            Play
          </AwesomeButton>
        </Link>
        <AwesomeButton cssmodule={styles} type="primary">
          Option
        </AwesomeButton>
      </header>
    </div>
  )
}

export default Lobby
