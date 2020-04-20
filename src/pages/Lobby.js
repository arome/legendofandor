import React, { useEffect, useState } from 'react'
import background from '../assets/images/Lobby.jpg'
import Axios from 'axios'
import { server, name } from '../common'
import { useParams } from 'react-router-dom'
import './Lobby.scss'
import { AwesomeButton } from 'react-awesome-button'
import styles from 'react-awesome-button/src/styles/themes/theme-amber'
import { Form, Button } from 'semantic-ui-react'
import character from '../assets/images/characters/pictures/no_character.png'

export default () => {
  const { gameID } = useParams()
  const [playerNames, setPlayerNames] = useState([])
  const [players, setPlayers] = useState([])
  const [playerCredentials, setPlayerCredentials] = useState('')
  const [setupData, setSetupData] = useState({})
  const [error, setError] = useState(false)

  const handleSubmit = (playerID) => (event) => {
    event.preventDefault()
    const playerName = playerNames[playerID]
    const error = !(playerName && playerName.length > 0)
    setError(error)
    !error && joinGame(playerID, playerName)
  }

  const joinGame = (playerID, playerName) => {
    Axios.post(`${server}/games/${name}/${gameID}/join`, { playerID, playerName }).then((res) => {
      const playerCredentials = res.data
      setPlayerCredentials(playerCredentials)
    })
  }

  useEffect(() => {
    Axios.get(`${server}/games/${name}/${gameID}`).then((res) => {
      setPlayers(res.data.players)
      setPlayerNames(Array(players.length).fill(null))
      setSetupData(res.data.setupData)
    })
  }, [gameID, players.length])
  const divStyle = {
    width: '100vw',
    height: '100vh',
    backgroundImage: `url(${background})`,
    backgroundSize: '100% 100%',
  }

  const characterSelection = (playerID) => {
    
  }

  const viewWhenJoined = (player) => (
    <h2>
      Player {player.name} joined as player {player.id + 1}
    </h2>
  )

  const viewWhenNotJoined = (player) => (
    <Form onSubmit={handleSubmit(player.id)}>
      <Form.Input
        className="input-player"
        fluid
        error={error}
        label={`Player ${player.id + 1} name`}
        placeholder="Enter the your name here..."
        onChange={(e) => {
          const newPlayerNames = playerNames
          newPlayerNames[player.id] = e.target.value
          setPlayerNames(newPlayerNames)
        }}
        icon="user"
        iconPosition="left"
        action={`Join as player ${player.id + 1}`}
      />
    </Form>
  )

  return (
    <div className="lobby" style={divStyle}>
      <div className="header">
        <h1>Room ID : {gameID}</h1>
      </div>
      <div className="content">
        <div className="players">
          {players.map((player, key) => (
            <div className="player" key={key}>
              <div style={{ display: 'block', position: 'relative' }}>
                <img className="character-image" alt="character" src={character}></img>
                <Button onClick={() => characterSelection(player.id)}>Choose Character</Button>
              </div>
              <Button style={{ marginTop: '15px' }}>Join as player {player.id + 1}</Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
