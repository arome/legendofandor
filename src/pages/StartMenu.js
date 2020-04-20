import React, { useState } from 'react'
import logo from '../assets/images/LOA_icon_small.png'
import { AwesomeButton } from 'react-awesome-button'
import styles from 'react-awesome-button/src/styles/themes/theme-blue'
import './StartMenu.scss'
import CreateGameModal from '../modals/CreateGameModal'
import JoinGameModal from '../modals/JoinGameModal'

function StartMenu() {
  const [openCreate, setOpenCreate] = useState(false)
  const [openJoin, setOpenJoin] = useState(false)

  const handleShowCreate = () => setOpenCreate(true)
  const handleCloseCreate = () => setOpenCreate(false)

  const handleShowJoin = () => setOpenJoin(true)
  const handleCloseJoin = () => setOpenJoin(false)

  return (
    <div className="start-menu">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>
          Welcome to the
          <br />
          Legend of Andor
        </h1>
        <div className="buttons">
          <AwesomeButton onPress={handleShowCreate} className="button-start" cssmodule={styles} type="primary">
            Create Game
          </AwesomeButton>
          <AwesomeButton onPress={handleShowJoin} cssmodule={styles} type="primary">
            Join Game
          </AwesomeButton>
        </div>
      </header>
      <CreateGameModal open={openCreate} handleClose={handleCloseCreate} />
      <JoinGameModal open={openJoin} handleClose={handleCloseJoin} />
    </div>
  )
}

export default StartMenu
