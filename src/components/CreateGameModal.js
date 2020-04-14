import React, { useState } from 'react'
import { Modal, Button, Form, Col, Row } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'

const CreateGameModal = (props) => {
  const [name, setName] = useState('')
  const [difficulty, setDifficulty] = useState('easy')
  const [numPlayers, setNumPlayers] = useState(2)

  const handleSubmit = (event) => {
    event.preventDefault()
    useHistory.push(`/lobby/${name}`)
  }

  return (
    <Modal show={props.show} onHide={props.handleClose} backdrop="static" centered>
      <Modal.Header closeButton>
        <Modal.Title>Modal heading</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group as={Row} controlId="formHorizontalEmail">
            <Form.Label column sm={2}>
              Name
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                type="text"
                placeholder="Game Name"
                onChange={(e) => {
                  setName(e.target.value)
                }}
              />
            </Col>
          </Form.Group>
          <fieldset>
            <Form.Group as={Row}>
              <Form.Label as="difficulty" column sm={2}>
                Difficulty
              </Form.Label>
              <Form.Check
                type="radio"
                label="Easy"
                checked={difficulty === 'easy'}
                onChange={() => setDifficulty('easy')}
                name="formHorizontalRadios"
                id="formHorizontalRadios1"
              />
              <Form.Check
                type="radio"
                label="Hard"
                checked={difficulty === 'hard'}
                onChange={() => setDifficulty('hard')}
                name="formHorizontalRadios"
                id="formHorizontalRadios2"
              />
            </Form.Group>
          </fieldset>
          <Form.Group controlId="exampleForm.ControlSelect1">
            <Form.Label>Number of Players</Form.Label>
            <Form.Control as="select" onChange={(e) => setNumPlayers(e.target.value)}>
              <option>2</option>
              <option>3</option>
              <option>4</option>
            </Form.Control>
          </Form.Group>

          <Form.Group as={Row}>
            <Col>
              <Button type="submit">Create Game</Button>
            </Col>
            <Col>
              <Button type="cancel">Cancel</Button>
            </Col>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  )
}

export default CreateGameModal
