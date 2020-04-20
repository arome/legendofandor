import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Form, Modal } from 'semantic-ui-react'
import './CreateGameModal.scss'
import axios from 'axios'
import LOA from '../game'
import { server } from '../common'

const CreateGameModal = (props) => {
  const [difficulty, setDifficulty] = useState('easy')
  const [numPlayers, setNumPlayers] = useState(2)
  const history = useHistory()

  const handleSubmit = (event) => {
    event.preventDefault()
    const setupData = { difficulty }
    axios.post(`${server}/games/${LOA.name}/create`, { numPlayers, setupData }).then((res) => {
      const { gameID } = res.data
      history.push(`/lobby/${gameID}`)
    })
  }

  return (
    <Modal className="create-game-modal" open={props.open} onClose={() => props.handleClose()} closeIcon>
      <Modal.Header>Create a New Game</Modal.Header>
      <Modal.Content>
        <Form onSubmit={handleSubmit}>
          <Form.Select
            defaultValue={numPlayers}
            onChange={(d, e) => setNumPlayers(e.value)}
            fluid
            label="# of Players"
            options={[
              { key: '2', text: '2', value: 2 },
              { key: '3', text: '3', value: 3 },
              { key: '4', text: '4', value: 4 },
            ]}
            placeholder="How many players?"
          />
          <Form.Group inline>
            <label>Difficulty</label>
            <Form.Radio
              label="Easy"
              value="easy"
              checked={difficulty === 'easy'}
              onChange={(e) => setDifficulty('easy')}
            />
            <Form.Radio
              label="Hard"
              value="hard"
              checked={difficulty === 'hard'}
              onChange={(e) => setDifficulty('hard')}
            />
          </Form.Group>
          <Form.Group>
            <Form.Button>Create Game</Form.Button>
          </Form.Group>
        </Form>
      </Modal.Content>
    </Modal>
  )
}

export default CreateGameModal