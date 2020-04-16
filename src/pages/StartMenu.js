import React, { useState } from 'react'
import logo from '../assets/images/LOA_icon.png'
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
        <h1>
          Welcome to the
          <br />
          Legend of Andor
        </h1>
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
