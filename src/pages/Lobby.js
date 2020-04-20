import React, { useEffect, useState } from 'react'
import background from '../assets/images/Lobby.jpg'
import Axios from 'axios'
import { server, name } from '../common'
import { useParams } from 'react-router-dom'
import './Lobby.scss'
import { Button } from 'semantic-ui-react'
import PlayerNameModal from '../modals/PlayerNameModal'
import character from '../assets/images/characters/pictures/Warrior_male.jpg'

export default () => {
  const { gameID } = useParams()
  const [playerNames, setPlayerNames] = useState([])
  const [players, setPlayers] = useState([])
  const [playerCredentials, setPlayerCredentials] = useState('')
  const [setupData, setSetupData] = useState({})
  const [error, setError] = useState(false)
  const [openPlayerName, setOpenPlayerName] = useState(false)
  const [selectedPlayer, setSelectedPlayer] = useState(null)

  const handleSubmit = (playerID) => (event) => {
    event.preventDefault()
    const playerName = playerNames[playerID]
    const error = !(playerName && playerName.length > 0)
    setError(error)
    !error && joinGame(playerID, playerName)
  }

  const handleClosePlayerName = () => setOpenPlayerName(false)

  const getPlayerName = (playerID) => {
    setSelectedPlayer(playerID)
    setOpenPlayerName(true)
  }

  const joinGame = (playerID, playerName) => {
    setOpenPlayerName(false)
    Axios.post(`${server}/games/${name}/${gameID}/join`, { playerID, playerName }).then((res) => {
      const playerCredentials = res.data
      setPlayerCredentials(playerCredentials)
    })
  }

  useEffect(() => {
    const interval = setInterval(() => {
      Axios.get(`${server}/games/${name}/${gameID}`).then((res) => {
        setPlayers(res.data.players)
        setPlayerNames(Array(players.length).fill(null))
        setSetupData(res.data.setupData)
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [gameID, players.length])

  const divStyle = {
    width: '100vw',
    height: '100vh',
    backgroundImage: `url(${background})`,
    backgroundSize: '100% 100%',
  }

  const characterSelection = (playerID) => {}

  return (
    <div className="lobby" style={divStyle}>
      <div className="header">
        <h1>Room ID : {gameID}</h1>
      </div>
      <div className="content">
        <div className="players">
          {players.map((player, key) => {
            console.log('player', player)

            return (
              <div className="player" key={key}>
                <div style={{ display: 'block', position: 'relative' }}>
                  <img className="character-image" alt="character" src={character}></img>
                  {'name' in player && <Button onClick={() => characterSelection(player.id)}>Choose Character</Button>}
                </div>
                {'name' in player ? (
                  <h3>{player.name}</h3>
                ) : (
                  <Button style={{ marginTop: '15px' }} onClick={() => getPlayerName(player.id)}>
                    Join as player {player.id + 1}
                  </Button>
                )}
              </div>
            )
          })}
        </div>
      </div>
      <PlayerNameModal
        open={openPlayerName}
        handleClose={handleClosePlayerName}
        playerID={selectedPlayer}
        joinGame={joinGame}
      />
    </div>
  )
}
