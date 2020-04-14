import React, { useState } from 'react'
import logo from '../logo.svg'
import { AwesomeButton } from 'react-awesome-button'
import styles from 'react-awesome-button/src/styles/themes/theme-blue'
import './StartMenu.css'
import CreateGameModal from '../components/CreateGameModal'

function StartMenu() {
  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  return (
    <div>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Welcome to the game Legend of Andor</p>
        <div className="buttons">
          <AwesomeButton onPress={handleShow} className="button-start" cssmodule={styles} type="primary">
            Create Game
          </AwesomeButton>
          <AwesomeButton cssmodule={styles} type="primary">
            Join Game
          </AwesomeButton>
        </div>
      </header>
      <CreateGameModal show={show} handleClose={handleClose} />
    </div>
  )
}

export default StartMenu
