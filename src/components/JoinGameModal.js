import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Form, Modal } from 'semantic-ui-react'

const CreateGameModal = (props) => {
  const [name, setName] = useState('')
  const history = useHistory()

  const handleSubmit = (event) => {
    event.preventDefault()
    const valid = name.length > 0
    // history.push(`/lobby`)
  }

  return (
    <Modal className="join-game-modal" open={props.open} onClose={() => props.handleClose()} closeIcon>
      <Modal.Header>Join a Game</Modal.Header>
      <Modal.Content>
        <Form onSubmit={handleSubmit}>
          <Form.Input
            fluid
            label="Game name"
            placeholder="Type your text here..."
            onChange={(e) => setName(e.target.value)}
            icon="game"
            iconPosition="left"
            action="Join Game"
          />
        </Form>
      </Modal.Content>
    </Modal>
  )
}

export default CreateGameModal
