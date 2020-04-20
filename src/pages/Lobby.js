import React, { useEffect, useState } from 'react'
import background from '../assets/images/Lobby.jpg'
import Cookies from 'react-cookies'
import Axios from 'axios'
import { server, name } from '../common'
import { useParams } from 'react-router-dom'
import './Lobby.scss'
import { Button } from 'semantic-ui-react'
import PlayerNameModal from '../modals/PlayerNameModal'
import character from '../assets/images/characters/pictures/Warrior_male.jpg'

export default () => {
  const { gameID } = useParams()
  const [playerName, setPlayerName] = useState('')
  const [players, setPlayers] = useState([])
  const [playerCredentials, setPlayerCredentials] = useState('')
  const [setupData, setSetupData] = useState({})
  const [openPlayerName, setOpenPlayerName] = useState(false)
  const [selectedPlayer, setSelectedPlayer] = useState(null)
  const [cookie, setCookie] = useState({})
  const handleClosePlayerName = () => {
    setOpenPlayerName(false)
    setSelectedPlayer(null)
  }

  const getPlayerName = (playerID) => {
    setSelectedPlayer(playerID)
    setOpenPlayerName(true)
  }

  const joinGame = (playerID, playerName) => {
    setOpenPlayerName(false)

    Axios.post(`${server}/games/${name}/${gameID}/join`, { playerID, playerName }).then((res) => {
      const playerCredentials = res.data
      setPlayerCredentials(playerCredentials)
      setPlayerName(playerName)
      let newCookie = cookie
      newCookie[gameID] = {
        playerName,
        playerCredentials,
      }
      setCookie(newCookie)
      Cookies.save('lobby', cookie, { path: '/' })
    })
  }

  useEffect(() => {
    const browserCookie = Cookies.load('lobby') || {}
    setCookie(browserCookie)
    setPlayerName(gameID in browserCookie ? browserCookie[gameID].playerName : '')
    setPlayerCredentials(gameID in browserCookie ? browserCookie[gameID].playerCredentials : '')
    const interval = setInterval(() => {
      Axios.get(`${server}/games/${name}/${gameID}`).then((res) => {
        setPlayers(res.data.players)
        setSetupData(res.data.setupData)
      })
    }, 1000)
    return () => {
      clearInterval(interval)
    }
  }, [])

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
            return (
              <div className="player" key={key}>
                <div style={{ display: 'block', position: 'relative' }}>
                  <img className="character-image" alt="character" src={character}></img>
                  {playerName === player.name && (
                    <Button onClick={() => characterSelection(player.id)}>Choose Character</Button>
                  )}
                </div>
                {'name' in player ? (
                  <h3>{player.name}</h3>
                ) : !playerName ? (
                  <Button style={{ marginTop: '15px' }} onClick={() => getPlayerName(player.id)}>
                    Join as player {player.id + 1}
                  </Button>
                ) : (
                  <h3>Waiting for others...</h3>
                )}
              </div>
            )
          })}
        </div>
      </div>
      <PlayerNameModal
        open={openPlayerName}
        handleClose={handleClosePlayerName}
        joinGame={joinGame}
        playerID={selectedPlayer}
      />
    </div>
  )
}
