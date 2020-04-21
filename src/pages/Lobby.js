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
import { Icon } from 'semantic-ui-react'
import { ClockLoader } from 'react-spinners'

export default () => {
  const { gameID } = useParams()
  const history = useHistory()
  const [playerName, setPlayerName] = useState('')
  const [playerID, setPlayerID] = useState(null)
  const [players, setPlayers] = useState([])
  const [credentials, setCredentials] = useState('')
  const [setupData, setSetupData] = useState({})
  const [openPlayerName, setOpenPlayerName] = useState(false)
  const [openHeroSelection, setOpenHeroSelection] = useState(false)
  const [selectedHero, setSelectedHero] = useState(null)
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
      updateCookie({ credentials, playerID })
    })
  }

  const updateHero = (newHero) => {
    selectedHero !== newHero
      ? Axios.post(`${server}/games/${name}/${gameID}/setHero`, { playerID, credentials, newHero })
          .then(() => {
            setSelectedHero(newHero)
            updateCookie({ newHero })
            setTimeout(() => setHeroLoader(false), 0.45 * 1000)
          })
          .catch((e) => console.log('error', e))
      : setHeroLoader(false)
  }

  useEffect(() => {
    const browserCookie = Cookies.load('lobby') || {}
    if (gameID in browserCookie) {
      setPlayerName(browserCookie[gameID].playerName)
      setCredentials(browserCookie[gameID].credentials)
      setSelectedHero(browserCookie[gameID].newHero)
      setPlayerID(browserCookie[gameID].playerID)
    }
    const interval = setInterval(() => {
      Axios.get(`${server}/games/${name}/${gameID}/moreData`).then((res) => {
        setPlayers(res.data.players)
        setSetupData(res.data.setupData)
        setLoading(false)
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
        {loading ? (
          <ClockLoader size={100} color={'white'} loading={loading} />
        ) : (
          <React.Fragment>
            <div className="players">
              {players.map((player, key) => {
                const characterImage =
                  'hero' in player ? require(`../assets/images/characters/pictures/${player.hero}.jpg`) : character
                return (
                  <div className="player" key={key}>
                    <div style={{ display: 'block', position: 'relative' }}>
                      <img className="player-image" alt="character" src={characterImage}></img>
                      {playerID === player.id && (
                        <Button
                          loading={heroLoader}
                          className="choose-character-button"
                          onClick={() => setOpenHeroSelection(true)}
                        >
                          {selectedHero ? 'Switch' : 'Choose'} Hero
                        </Button>
                      )}
                    </div>
                    <div className="player-footer">
                      {'name' in player ? (
                        <React.Fragment>
                          <h3>{player.name}</h3>
                          <Icon name="circle" size="tiny" color={['red', 'blue', 'green', 'yellow'][player.id]} />
                        </React.Fragment>
                      ) : playerID === null ? (
                        <Button style={{ marginTop: '15px' }} onClick={() => getPlayerName(player.id)}>
                          Join as player {player.id + 1}
                          <Icon name="circle" size="tiny" color={['red', 'blue', 'green', 'yellow'][player.id]} />
                        </Button>
                      ) : (
                        <React.Fragment>
                          <h3>Waiting for others...</h3>
                          <Icon name="circle" size="tiny" color={['red', 'blue', 'green', 'yellow'][player.id]} />
                        </React.Fragment>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
            {playerID !== null ? (
              selectedHero ? (
                <Button
                  className="start-game-button"
                  onClick={() =>
                    history.push('/start-game', {
                      playerID,
                      gameID,
                      credentials,
                      numPlayers: players.length,
                      selectedHero,
                    })
                  }
                >
                  Start Game
                </Button>
              ) : (
                <h2>Please Select Your Hero</h2>
              )
            ) : (
              <h2>Please Select Your Player</h2>
            )}
          </React.Fragment>
        )}
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
