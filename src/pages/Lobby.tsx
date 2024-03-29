import React, { useEffect, useState } from 'react'
import background from '../assets/images/Lobby.jpg'
import Cookies from 'react-cookies'
import Axios from 'axios'
import { server, name, chatApiKey } from '../common'
import { useHistory } from 'react-router-dom'
import './Lobby.scss'
import { Button } from 'semantic-ui-react'
import PlayerNameModal from '../modals/PlayerNameModal'
import HeroSelectionModal from '../modals/HeroSelectionModal'
import character from '../assets/images/characters/pictures/no_character.png'
import { Icon } from 'semantic-ui-react'
import { ClockLoader } from 'react-spinners'
import { Widget, addResponseMessage, addUserMessage } from 'react-chat-widget'
import 'react-chat-widget/lib/styles.css'
import { CometChat } from '@cometchat-pro/chat'
import { HeroType } from '../models/Character'

export interface GameMetadata {
  id: number
  name: string
  data: { hero: HeroType; ready: boolean }
}

export default () => {
  const history = useHistory()
  const { gameID } = history.location.state as { gameID: string }
  const [playerID, setPlayerID] = useState<number | null>(null)
  const [players, setPlayers] = useState<any[]>([])
  const [uid, setUid] = useState<string | null>(null)
  const [credentials, setCredentials] = useState('')
  const [openPlayerName, setOpenPlayerName] = useState(false)
  const [openHeroSelection, setOpenHeroSelection] = useState(false)
  const [loading, setLoading] = useState(true)
  const [heroLoader, setHeroLoader] = useState(false)
  const CUSTOMER_MESSAGE_LISTENER_KEY = 'client-listener'
  const defaultData = { hero: '', ready: false }

  const handleClosePlayerName = () => {
    setOpenPlayerName(false)
    setPlayerID(null)
  }

  const handleCloseHeroSelection = () => {
    setOpenHeroSelection(false)
  }

  const getPlayerName = (pid: number) => {
    setPlayerID(pid)
    setOpenPlayerName(true)
  }

  const updateCookie = (fieldsToUpdate: { [key: string]: any }) => {
    let newCookie = Cookies.load('lobby') || {}
    if (!(gameID in newCookie)) newCookie[gameID] = {}
    for (const key in fieldsToUpdate) newCookie[gameID][key] = fieldsToUpdate[key]
    Cookies.save('lobby', newCookie, { path: '/' })
  }

  const joinGame = (playerID: number, playerName: string) => {
    setOpenPlayerName(false)
    const data = defaultData
    Axios.post(`${server}/games/${name}/${gameID}/join`, { playerID, playerName, data }).then((res) => {
      const credentials = res.data.playerCredentials
      setCredentials(credentials)
      updateCookie({ credentials, playerID })

      // const uid = `player${playerID}`
      const uid = new Date().getTime().toString()
      var user = new CometChat.User(uid)
      user.setName(playerName)
      CometChat.createUser(user, chatApiKey)
        .then(() => {
          CometChat.login(uid, chatApiKey).then(() =>
            CometChat.joinGroup('legendofandor', CometChat.GROUP_TYPE.PUBLIC).then(() => {
              setUid(uid)
              updateCookie({ uid })
              createMessageListener()
              fetchPreviousMessages(uid)
            })
          )
        })
        .catch((e) => console.log('user creation failed e:', e))
    })
  }

  const updateHero = (newHero: HeroType) => {
    const { hero, ready } = getPlayer()
    if (hero !== newHero) {
      const data = { hero: newHero, ready }
      Axios.post(`${server}/games/${name}/${gameID}/update`, {
        playerID,
        credentials,
        data,
      })
        .then(() => {
          setTimeout(() => setHeroLoader(false), 0.45 * 1000)
        })
        .catch((e) => console.log('error', e))
    } else setHeroLoader(false)
  }

  const startGame = (hero: HeroType) => {
    const ready = true
    const data = { hero, ready }
    Axios.post(`${server}/games/${name}/${gameID}/update`, {
      playerID,
      credentials,
      data,
    }).catch((e) => console.log('error', e))
  }

  const createMessageListener = () => {
    CometChat.addMessageListener(
      CUSTOMER_MESSAGE_LISTENER_KEY,
      new CometChat.MessageListener({
        onTextMessageReceived: (message: any) => {
          addResponseMessage(message.text)
        },
      })
    )
  }

  const fetchPreviousMessages = (uid: string) => {
    var messagesRequest = new CometChat.ConversationsRequestBuilder().setLimit(50).setConversationType('group').build()
    messagesRequest.fetchNext().then((conversationList) => {
      const message = conversationList[0].getLastMessage()
      if (message.text) {
        if (message.sender.uid !== uid) {
          addResponseMessage(message.text)
        } else {
          addUserMessage(message.text)
        }
      }
    })
  }

  useEffect(() => {
    const browserCookie = Cookies.load('lobby') || {}
    if (gameID in browserCookie) {
      setCredentials(browserCookie[gameID].credentials)
      setPlayerID(browserCookie[gameID].playerID)
      const uid = browserCookie[gameID].uid?.toString()
      setUid(uid)
      if (uid) {
        CometChat.login(uid, chatApiKey).then(() => {
          createMessageListener()
          fetchPreviousMessages(uid)
        })
      }
    }
  }, [gameID])

  useEffect(() => {
    const interval = setInterval(() => {
      Axios.get(`${server}/games/${name}/${gameID}`).then((res) => {
        const players = res.data.players as GameMetadata[]
        const ready = players.length > 0 && players.every((player: any) => player.data?.ready)
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

  const displayPlayerFooter = (id: number, name: string, ready: boolean) => {
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

  const getPlayer = () => {
    let result = { name: '', ...defaultData }
    let player
    if (playerID !== null) {
      player = players.find((player) => player.id === playerID)
      result.name = player.name
      result.ready = player.data?.ready ?? false
      result.hero = player.data?.hero ?? ''
    }
    return result
  }

  const displayStatus = () => {
    let status
    if (playerID !== null) {
      const { hero, ready } = getPlayer()
      if (hero) {
        status = (
          <Button loading={ready} className="start-game-button" onClick={() => startGame(hero as HeroType)}>
            Start Game
          </Button>
        )
      } else status = <h1>Please Select Your Hero</h1>
    } else status = <h1>Please Select Your Player</h1>
    return status
  }

  const handleNewUserMessage = (newMessage: string) => {
    const { name } = getPlayer()
    var textMessage = new CometChat.TextMessage(
      'legendofandor',
      `${name}: ${newMessage}`,
      CometChat.RECEIVER_TYPE.GROUP
    )
    CometChat.sendMessage(textMessage)
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
                const { id, name, data } = player
                const { hero, ready } = data ?? { hero: '', ready: false }
                const characterImage = hero ? require(`../assets/images/characters/pictures/${hero}.jpg`) : character
                return (
                  <div className="player" key={player.id}>
                    <div style={{ display: 'block', position: 'relative' }}>
                      <img className="player-image" alt="character" src={characterImage}></img>
                      {playerID === id && (
                        <Button
                          loading={heroLoader}
                          className="choose-character-button"
                          onClick={() => setOpenHeroSelection(true)}
                        >
                          {hero ? 'Switch' : 'Choose'} Hero
                        </Button>
                      )}
                    </div>
                    <div className="player-footer">{displayPlayerFooter(id, name, ready)}</div>
                  </div>
                )
              })}
            </div>
            {displayStatus()}
          </React.Fragment>
        )}
        {uid && (
          <Widget
            title={`${players.filter((player) => player.name).length} player${
              players.filter((player) => player.name).length > 1 ? 's' : ''
            } joined`}
            subtitle=""
            handleNewUserMessage={handleNewUserMessage}
          />
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
