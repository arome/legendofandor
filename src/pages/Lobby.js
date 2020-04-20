import React, { useEffect, useState } from 'react'
import background from '../assets/images/Lobby.jpg'
import Cookies from 'react-cookies'
import Axios from 'axios'
import { server, name } from '../common'
import { useParams, useHistory } from 'react-router-dom'
import './Lobby.scss'
import { Button } from 'semantic-ui-react'
import PlayerNameModal from '../modals/PlayerNameModal'
import HeroSelectionModal from '../modals/HeroSelectionModal'
import character from '../assets/images/characters/pictures/no_character.png'

export default () => {
  const { gameID } = useParams()
  const history = useHistory()
  const [playerName, setPlayerName] = useState('')
  const [playerID, setPlayerID] = useState(null)
  const [players, setPlayers] = useState([])
  const [playerCredentials, setPlayerCredentials] = useState('')
  const [setupData, setSetupData] = useState({})
  const [openPlayerName, setOpenPlayerName] = useState(false)
  const [openHeroSelection, setOpenHeroSelection] = useState(false)
  const [selectedHero, setSelectedHero] = useState(null)
  const [cookie, setCookie] = useState({})

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

  const updateCookie = () => {
    let newCookie = cookie
    newCookie[gameID] = {
      selectedHero,
      playerID,
      playerName,
      playerCredentials,
    }
    setCookie(newCookie)
    Cookies.save('lobby', cookie, { path: '/' })
  }

  const joinGame = (playerID, playerName) => {
    setOpenPlayerName(false)

    Axios.post(`${server}/games/${name}/${gameID}/join`, { playerID, playerName }).then((res) => {
      const playerCredentials = res.data.playerCredentials
      setPlayerCredentials(playerCredentials)
      setPlayerName(playerName)
      updateCookie()
    })
  }

  const updateHero = (hero) => {
    setSelectedHero(hero)
    let newCookie = cookie
    newCookie[gameID] = {
      selectedHero: hero,
      playerID,
      playerName,
      playerCredentials,
    }
    setCookie(newCookie)
    Cookies.save('lobby', cookie, { path: '/' })
  }

  useEffect(() => {
    const browserCookie = Cookies.load('lobby') || {}
    setCookie(browserCookie)
    if (gameID in browserCookie) {
      setPlayerName(browserCookie[gameID].playerName)
      setPlayerCredentials(browserCookie[gameID].playerCredentials)
      setSelectedHero(browserCookie[gameID].selectedHero)
      setPlayerID(browserCookie[gameID].playerID)
    }
    const interval = setInterval(() => {
      Axios.get(`${server}/games/${name}/${gameID}`).then((res) => {
        setPlayers(res.data.players)
        setSetupData(res.data.setupData)
      })
    }, 1000)
    return () => {
      clearInterval(interval)
    }
  }, [gameID])

  const divStyle = {
    width: '100vw',
    height: '100vh',
    backgroundImage: `url(${background})`,
    backgroundSize: '100% 100%',
  }

  return (
    <div className="lobby" style={divStyle}>
      <div className="header">
        <h1>Room ID : {gameID}</h1>
      </div>
      <div className="content">
        <div className="players">
          {players.map((player, key) => {
            const characterImage =
              selectedHero && player.id === playerID
                ? require(`../assets/images/characters/pictures/${selectedHero}.jpg`)
                : character

            return (
              <div className="player" key={key}>
                <div style={{ display: 'block', position: 'relative' }}>
                  <img className="character-image" alt="character" src={characterImage}></img>
                  {playerID === player.id && (
                    <Button onClick={() => setOpenHeroSelection(true)}>Choose Character</Button>
                  )}
                </div>
                {'name' in player ? (
                  <h3>{player.name}</h3>
                ) : playerID === null ? (
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
        {selectedHero && (
          <Button
            className="start-game-button"
            onClick={() =>
              history.push('/start-game', { playerID, gameID, playerCredentials, numPlayers: players.length })
            }
          >
            Start Game
          </Button>
        )}
      </div>
      <PlayerNameModal
        open={openPlayerName}
        handleClose={handleClosePlayerName}
        joinGame={joinGame}
        playerID={playerID}
      />
      <HeroSelectionModal open={openHeroSelection} handleClose={handleCloseHeroSelection} selectHero={updateHero} />
    </div>
  )
}
