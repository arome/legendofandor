import React, { useEffect, useState } from 'react'
import background from '../assets/images/Lobby.jpg'
import Cookies from 'react-cookies'
import Axios from 'axios'
import { server, name, separator } from '../common'
import { useParams, useHistory } from 'react-router-dom'
import './Lobby.scss'
import { Button } from 'semantic-ui-react'
import PlayerNameModal from '../modals/PlayerNameModal'
import HeroSelectionModal from '../modals/HeroSelectionModal'
import character from '../assets/images/characters/pictures/no_character.png'
import { Icon } from 'semantic-ui-react'
import { ClockLoader } from 'react-spinners'
import { Widget, addResponseMessage } from 'react-chat-widget'
import 'react-chat-widget/lib/styles.css'
import socketIOClient from 'socket.io-client'

export default () => {
  const { gameID } = useParams()
  const history = useHistory()
  const [socket, setSocket] = useState(null)
  const [playerName, setPlayerName] = useState('')
  const [playerID, setPlayerID] = useState(null)
  const [players, setPlayers] = useState([])
  const [credentials, setCredentials] = useState('')
  const [openPlayerName, setOpenPlayerName] = useState(false)
  const [openHeroSelection, setOpenHeroSelection] = useState(false)
  const [loading, setLoading] = useState(true)
  const [heroLoader, setHeroLoader] = useState(false)

  const handleClosePlayerName = () => {
    setOpenPlayerName(false)
    setPlayerID(null)
  }

  const handleCloseHeroSelection = () => {
    setOpenHeroSelection(false)
  }

  const getPlayerName = (pid) => {
    setPlayerID(pid)
    setOpenPlayerName(true)
  }

  const updateCookie = (fieldsToUpdate) => {
    let newCookie = Cookies.load('lobby') || {}
    if (!(gameID in newCookie)) newCookie[gameID] = {}
    for (const key in fieldsToUpdate) newCookie[gameID][key] = fieldsToUpdate[key]
    Cookies.save('lobby', newCookie, { path: '/' })
  }

  const joinGame = (playerID, playerName) => {
    setOpenPlayerName(false)
    Axios.post(`${server}/games/${name}/${gameID}/join`, { playerID, playerName }).then((res) => {
      const credentials = res.data.playerCredentials
      setCredentials(credentials)
      setPlayerName(playerName)
      updateCookie({ credentials, playerID, playerName })
    })
  }

  const updateHero = (newHero) => {
    const [name, hero] = playerName.split(separator)
    if (hero !== newHero) {
      const newName = `${name}${separator}${newHero}`
      Axios.post(`${server}/games/${name}/${gameID}/rename`, {
        playerID,
        credentials,
        newName,
      })
        .then(() => {
          setPlayerName(newName)
          updateCookie({ playerName: newName })
          setTimeout(() => setHeroLoader(false), 0.45 * 1000)
        })
        .catch((e) => console.log('error', e))
    } else setHeroLoader(false)
  }

  const startGame = () => {
    const newName = `${playerName}${separator}yes`
    Axios.post(`${server}/games/${name}/${gameID}/rename`, {
      playerID,
      credentials,
      newName,
    })
      .then(() => {
        setPlayerName(newName)
        updateCookie({ playerName: newName })
      })
      .catch((e) => console.log('error', e))
  }

  useEffect(() => {
    const socket = socketIOClient(server)
    socket.on('new message', (data) => {
      addResponseMessage(`__${data.username}__: ${data.message}`)
    })
    setSocket(socket)
  }, [])

  useEffect(() => {
    const browserCookie = Cookies.load('lobby') || {}
    if (gameID in browserCookie) {
      setPlayerName(browserCookie[gameID].playerName)
      setCredentials(browserCookie[gameID].credentials)
      setPlayerID(browserCookie[gameID].playerID)
    }
    const interval = setInterval(() => {
      Axios.get(`${server}/games/${name}/${gameID}`).then((res) => {
        const players = res.data.players
        const playersReady = players.map((player) => player.name && player.name.split(separator).length === 3)
        let ready = playersReady.length > 0 && playersReady.every((v) => v)

        setPlayers(players)
        setLoading(false)

        ready &&
          history.push('/start-game', {
            playerID,
            gameID,
            credentials,
            numPlayers: players.length,
          })
      })
    }, 1000)
    return () => {
      clearInterval(interval)
    }
  }, [playerID, credentials, gameID, history])

  const divStyle = {
    width: '100vw',
    height: '100vh',
    backgroundImage: `url(${background})`,
    backgroundSize: '100% 100%',
  }

  const displayPlayerFooter = (id, name, ready) => {
    let footer
    if (name)
      footer = (
        <React.Fragment>
          <h3>{name}</h3>
          <Icon name="circle" size="tiny" color={ready ? 'green' : 'red'} />
        </React.Fragment>
      )
    else if (playerID === null)
      footer = (
        <Button style={{ marginTop: '15px' }} onClick={() => getPlayerName(id)}>
          Join as player {id + 1}
        </Button>
      )
    else
      footer = (
        <React.Fragment>
          <h3>Waiting for others...</h3>
          <Icon name="circle" size="tiny" color={ready ? 'green' : 'red'} />
        </React.Fragment>
      )
    return footer
  }

  const displayStatus = () => {
    let status
    if (playerID !== null) {
      if (playerName.split(separator).length >= 2) {
        status = (
          <Button
            loading={playerName.split(separator).length === 3}
            className="start-game-button"
            onClick={() => startGame()}
          >
            Start Game
          </Button>
        )
      } else status = <h1>Please Select Your Hero</h1>
    } else status = <h1>Please Select Your Player</h1>
    return status
  }

  const newMessage = (message) => {
    socket.emit('new message', { username: playerName.split(separator)[0] || 'Spectator', message })
  }

  return (
    <div className="lobby" style={divStyle}>
      <div className="header">
        <h1>Room ID : {gameID}</h1>
      </div>
      <div className="content">
        {loading ? (
          <ClockLoader size={100} color={'white'} loading={loading} />
        ) : (
          <React.Fragment>
            <div className="players">
              {players.map((player) => {
                const [name, hero, ready] =
                  'name' in player ? player.name.split(separator) : [undefined, undefined, undefined]
                const characterImage = hero ? require(`../assets/images/characters/pictures/${hero}.jpg`) : character
                return (
                  <div className="player" key={player.id}>
                    <div style={{ display: 'block', position: 'relative' }}>
                      <img className="player-image" alt="character" src={characterImage}></img>
                      {playerID === player.id && (
                        <Button
                          loading={heroLoader}
                          className="choose-character-button"
                          onClick={() => setOpenHeroSelection(true)}
                        >
                          {hero ? 'Switch' : 'Choose'} Hero
                        </Button>
                      )}
                    </div>
                    <div className="player-footer">{displayPlayerFooter(player.id, name, ready)}</div>
                  </div>
                )
              })}
            </div>
            {displayStatus()}
          </React.Fragment>
        )}
        <Widget
          title={`${players.filter((player) => player.name).length} player${
            players.filter((player) => player.name).length > 1 ? 's' : ''
          } joined`}
          subtitle=""
          handleNewUserMessage={newMessage}
        />
      </div>
      <PlayerNameModal
        open={openPlayerName}
        handleClose={handleClosePlayerName}
        joinGame={joinGame}
        playerID={playerID}
      />
      <HeroSelectionModal
        open={openHeroSelection}
        handleClose={handleCloseHeroSelection}
        selectHero={updateHero}
        setHeroLoader={setHeroLoader}
      />
    </div>
  )
}
