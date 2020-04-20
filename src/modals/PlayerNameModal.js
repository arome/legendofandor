import React, { useState } from 'react'
import { Form, Modal } from 'semantic-ui-react'

export default (props) => {
  const [playerName, setPlayerName] = useState('')
  const [error, setError] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    const error = !(playerName && playerName.length > 0)
    setError(error)
    !error && props.joinGame(props.playerID, playerName)
  }

  return (
    <Modal className="player-name-modal" open={props.open} onClose={() => props.handleClose()} closeIcon>
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
