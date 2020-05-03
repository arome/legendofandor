import React, { useState } from 'react'
import logo from '../assets/images/LOA_icon_small.png'
import './StartMenu.scss'
import CreateGameModal from '../modals/CreateGameModal'
import JoinGameModal from '../modals/JoinGameModal'
import { Button } from 'semantic-ui-react'

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
          <Button onClick={handleShowCreate} className="button-start">
            Create Game
          </Button>
          <Button onClick={handleShowJoin} className="button-join">
            Join Game
          </Button>
        </div>
      </header>
      <CreateGameModal open={openCreate} handleClose={handleCloseCreate} />
      <JoinGameModal open={openJoin} handleClose={handleCloseJoin} />
    </div>
  )
}

export default StartMenu
