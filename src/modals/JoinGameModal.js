import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Form, Modal } from 'semantic-ui-react'
import Axios from 'axios'
import { server, name } from '../common'
import Swal from 'sweetalert2'

const CreateGameModal = (props) => {
  const [id, setId] = useState('')
  const [error, setError] = useState(false)
  const history = useHistory()

  const handleSubmit = (event) => {
    event.preventDefault()
    const error = !(id && id.length > 0)
    setError(error)
    Axios.get(`${server}/games/${name}/${id}`)
      .then(() => {
        history.push(`/lobby/${id}`)
      })
      .catch(() =>
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'This game ID does not exist!',
        })
      )
    // history.push(`/lobby`)
  }

  return (
    <Modal className="join-game-modal" open={props.open} onClose={() => props.handleClose()} closeIcon>
      <Modal.Header>Join a Game</Modal.Header>
      <Modal.Content>
        <Form onSubmit={handleSubmit}>
          <Form.Input
            fluid
            label="Game ID"
            error={error}
            placeholder="Enter the game id here..."
            onChange={(e) => setId(e.target.value)}
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