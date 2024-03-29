import React, { useState } from 'react'
import { Form, Modal } from 'semantic-ui-react'
import { PlayerNameModalProps } from '../models/Modal'

export default (props: PlayerNameModalProps) => {
  const [playerName, setPlayerName] = useState('')
  const [error, setError] = useState(false)

  const handleSubmit = (event: any) => {
    event.preventDefault()
    const error = !(playerName && playerName.length > 0)
    setError(error)
    !error && props.joinGame(props.playerID, playerName)
  }

  return (
    <Modal size="mini" className="player-name-modal" open={props.open} onClose={() => props.handleClose()} closeIcon>
      <Modal.Header>Player Name</Modal.Header>
      <Modal.Content>
        <Form onSubmit={handleSubmit}>
          <Form.Input
            fluid
            label="Player name"
            error={error}
            placeholder="Enter the your name here..."
            onChange={(e) => setPlayerName(e.target.value)}
            icon="user"
            iconPosition="left"
            action="Join Game"
          />
        </Form>
      </Modal.Content>
    </Modal>
  )
}
