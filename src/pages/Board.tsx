import React, { Component } from 'react'
import ImageMapper, { Area } from 'react-image-mapper'
import gameBoard from '../assets/images/Andor_Board.jpg'
import './Board.scss'
import tiles from './tiles'
import Swal from 'sweetalert2'
import { css } from '@emotion/core'
import { Icon } from 'semantic-ui-react'
import { ClockLoader } from 'react-spinners'
import { Fab, Action } from 'react-tiny-fab'
import { heroes, chatApiKey, heroColor } from '../common'
import { RiSwordLine, RiHandCoinLine } from 'react-icons/ri'
import { IoIosWater } from 'react-icons/io'
import DiceWindow from '../modals/DiceWindow'
import ResourceSplit from '../modals/ResourceSplit'
import { BsSkipForwardFill } from 'react-icons/bs'
import 'react-tiny-fab/dist/styles.css'
import narratorToken from '../assets/images/tokens/narrator.png'
import { GiFarmer } from 'react-icons/gi'
import { Widget, addResponseMessage, addUserMessage } from 'react-chat-widget'
import Cookies from 'react-cookies'
import { CometChat } from '@cometchat-pro/chat'
import { HeroType } from '../models/Character'
import { Ctx } from 'boardgame.io'
import { IG } from '../models/Game'
import { TokenType } from '../models/Token'
import { GameMetadata } from './Lobby'

interface GameBoardProps {
  G: IG
  ctx: Ctx
  moves: any
  gameMetadata: GameMetadata[]
  playerID: string
  gameID: string
}

interface GameBoardState {
  windowWidth: number
  windowHeight: number
  loadingImage: boolean
  openDice: boolean
  uid?: string
}
export default class GameBoard extends Component<GameBoardProps, GameBoardState> {
  MAP: any
  playerCharacters: any
  monsterCharacters: any
  tokens: any
  playersColor: heroColor[]
  playersToken: string[]
  originalImgHeight: number = 6476
  originalImgWidth: number = 9861

  constructor(props: GameBoardProps) {
    super(props)
    this.playerCharacters = {}
    this.monsterCharacters = {}
    this.tokens = {}
    this.playersColor = []
    const monsterTypes = ['Gor', 'Skrall']
    const tokenTypes = ['fog', 'well', 'farmer', 'empty-well']

    for (let i = 0; i < props.ctx.numPlayers; i++) {
      const heroName = props.gameMetadata[i].data.hero as HeroType
      this.playerCharacters[i] = require(`../assets/images/characters/pawns/${heroName}.png`)
      this.playersColor.push(heroes[heroName].color)
    }

    monsterTypes.forEach(
      (monsterType) =>
        (this.monsterCharacters[monsterType] = require(`../assets/images/characters/pawns/monsters/${monsterType}.png`))
    )
    tokenTypes.forEach((tokenType) => (this.tokens[tokenType] = require(`../assets/images/tokens/${tokenType}.png`)))
    this.playersToken = []
    this.playersColor.map(
      (color, index: number) => (this.playersToken[index] = require(`../assets/images/tokens/${color}.png`))
    )
    this.MAP = {
      name: 'my-map',
      areas: tiles.graph.vertices.map((vertice) => {
        return {
          name: vertice.data.id,
          shape: 'poly',
          coords: vertice.data.area,
        }
      }),
    }

    document.oncontextmenu = function (e) {
      if (e.button === 2) {
        e.preventDefault()
        return false
      }
    }

    this.state = {
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      loadingImage: true,
      openDice: false,
    }

    !this.props.G.init && this.init(props)
  }

  init = (props: GameBoardProps) => {
    const heroeslist = []
    let namelist = []
    for (let i = 0; i < props.ctx.numPlayers; i++) {
      const heroName = props.gameMetadata[i].data.hero as HeroType
      heroeslist.push(heroName)
      namelist.push(this.props.gameMetadata[i].name)
    }

    this.isActivePlayer() && this.props.moves.setupData(heroeslist, namelist)
  }

  handleResize = () =>
    this.setState({
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
    })

  arrayEquals = (array1: any[], array2: any[]) => {
    if (!array1 || !array2) return false
    if (array1.length !== array2.length) return false
    return array1.every((val, index) => val === array2[index])
  }
  componentDidUpdate(prevProps: GameBoardProps) {
    if (this.props.G.init) {
      if (this.props.G.rollingDices.length > 0 && this.props.G.fight.turn !== prevProps.G.fight.turn) {
        this.setState({ openDice: true })
      }
      if (this.props.G.status.id && this.props.G.status.id !== prevProps.G.status.id) this.displayStatusMessage()
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize)
    const browserCookie = Cookies.load('lobby') || {}
    if (this.props.gameID in browserCookie) {
      const uid = browserCookie[this.props.gameID].uid
      this.setState({ uid })
      if (uid) {
        CometChat.login(uid, chatApiKey).then(() => {
          this.createMessageListener()
          this.fetchPreviousMessages(uid)
        })
      }
    }
  }

  createMessageListener = () => {
    CometChat.addMessageListener(
      'client-listener',
      new CometChat.MessageListener({
        onTextMessageReceived: (message: any) => {
          addResponseMessage(message.text)
        },
      })
    )
  }

  fetchPreviousMessages = (uid: string) => {
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

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  enterArea(area: Area) {
    this.props.moves.setHoveredArea(area)
  }

  isActivePlayer = () => this.props.playerID === this.props.ctx.currentPlayer
  getPlayer = (who: string | number) => {
    let player
    switch (who) {
      case 'me':
        player = this.props.G.players[this.props.playerID]
        break
      case 'turn':
      default:
        if (typeof who === 'number') {
          who = who >= 0 && who < this.props.ctx.numPlayers ? who : who < 0 ? 0 : this.props.ctx.numPlayers - 1
        } else who = this.props.ctx.currentPlayer
        player = this.props.G.players[who]
    }
    return player
  }

  clicked(area: Area) {
    const to = parseInt(area.name ?? '0')
    const myPath = this.getPlayer('me').path
    const lastSelected = myPath.length > 0 ? myPath[myPath.length - 1][1] : null
    lastSelected === to
      ? this.isActivePlayer() &&
        Swal.fire({
          title: 'Confirm move?',
          icon: 'question',
          showCancelButton: true,
          showCloseButton: true,
          cancelButtonText: 'Clear',
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Confirm',
          reverseButtons: true,
        }).then((result) => {
          'value' in result
            ? this.props.moves.move(to)
            : result.dismiss === Swal.DismissReason.cancel &&
              this.props.moves.drawPath(lastSelected, this.getPlayer('me').position)
        })
      : this.props.moves.drawPath(lastSelected, to)
  }

  leaveArea() {
    this.props.moves.setHoveredArea(null)
  }

  getTipPosition(area: Area) {
    return { top: `${area.center ? area.center[1] : 0}px`, left: `${area.center ? area.center[0] : 0}px` }
  }

  getPlayerPosition(position: number, id: any) {
    const center = this.computeCenter(this.MAP.areas[position])
    const monstersInArea = this.props.G.monsters.filter((monster) => monster.position === position)
    const heroesInArea: any[] = Object.keys(this.props.G.players).filter(
      (playerID) => this.getPlayer(parseInt(playerID)).position === position
    )
    const charactersInArea = heroesInArea.concat(monstersInArea)
    const pos = charactersInArea.findIndex((character) => {
      if (typeof character === 'string') {
        return character === id
      } else {
        return character.startingPos === id
      }
    })
    const horizontalTranslation = this.getCharacterSize().width / 2
    const veritcalTranslation = (this.getCharacterSize().heigth * 2) / 5
    let topPosition = center[1]
    let leftPosition = center[0]
    if (charactersInArea.length > 1) {
      switch (pos) {
        case 0:
        case 3:
          topPosition += (pos === 0 ? -1 : 1) * veritcalTranslation
          break
        case 1:
        case 2:
          leftPosition += Math.pow(-1, pos - 1) * horizontalTranslation
          break
        default:
      }
    }
    return {
      top: `${topPosition}px`,
      left: `${leftPosition}px`,
    }
  }

  getTokenPosition(area: Area) {
    const center = this.computeCenter(area)
    return {
      top: `${center[1]}px`,
      left: `${center[0]}px`,
    }
  }

  getTokenSize = (type?: TokenType) => {
    const scale = (2 * this.state.windowWidth) / this.originalImgWidth
    let width = 1
    let height = 1
    let ratio = 1
    switch (type) {
      case 'well':
        width = 182
        height = 207
        ratio = 182 / 3
        break
      case 'fog':
        ratio = 1 / 3
        break
      case 'farmer':
        ratio = 1 / 2
        break
      default:
        ratio = 1
    }
    return {
      width: (width * 50 * scale) / ratio,
      heigth: (height * 50 * scale) / ratio,
    }
  }

  getCharacterSize = () => {
    const scale = (2 * this.state.windowWidth) / this.originalImgWidth
    return {
      width: 100 * scale,
      heigth: 162 * scale,
    }
  }

  computeCenter(area: Area) {
    if (!area) return [0, 0]
    const scaledCoords = area.coords
      ? area.coords.map((coord, index) =>
          index % 2 === 1
            ? (coord * this.state.windowHeight) / this.originalImgHeight
            : (coord * this.state.windowWidth) / this.originalImgWidth
        )
      : []
    // Calculate centroid
    if (scaledCoords.length === 3) {
      const [x, y] = scaledCoords
      return [x, y]
    }
    const n = scaledCoords.length / 2
    const { y, x } = scaledCoords.reduce(
      ({ y, x }, val, idx) => {
        return !(idx % 2) ? { y, x: x + val / n } : { y: y + val / n, x }
      },
      { y: 0, x: 0 }
    )
    return [x, y]
  }

  getPaths() {
    const numPlayers = this.props.ctx.numPlayers
    const paths = []
    for (let i = 0; i < numPlayers; i++)
      if (i !== parseInt(this.props.playerID))
        paths.push({
          circle: { color: this.playersColor[i], radius: 10 },
          line: { color: this.playersColor[i] },
          steps: this.getPlayer(i).path,
        })
    paths.push({
      circle: { color: this.playersColor[parseInt(this.props.playerID)], radius: 10 },
      line: { color: this.playersColor[parseInt(this.props.playerID)] },
      steps: this.getPlayer('me').path,
    })
    return paths
  }

  getHoveredAreas() {
    const numPlayers = this.props.ctx.numPlayers
    const hoveredAreas = []
    for (let i = 0; i < numPlayers; i++) {
      const hoveredArea = this.getPlayer(i).hoveredArea
      if (i !== parseInt(this.props.playerID) && hoveredArea)
        hoveredAreas.push({ ...hoveredArea, strokeColor: this.playersColor[i], _id: i })
    }
    const myHoveredArea = this.getPlayer('me').hoveredArea
    myHoveredArea &&
      hoveredAreas.push({
        ...myHoveredArea,
        strokeColor: this.playersColor[parseInt(this.props.playerID)],
        _id: this.props.playerID,
      })
    return hoveredAreas
  }

  canPickFarmer = () => {
    const farmers = this.props.G.tokens.farmer.filter((farmer) => farmer.position === this.getPlayer('me').position)
    if (farmers.length > 0) {
      const farmersId = farmers.map((farmer) => farmer.id)
      return farmersId.some((farmerId) => {
        for (let i = 0; i < this.props.ctx.numPlayers; i++)
          if (this.getPlayer(i).pickedFarmers.includes(farmerId)) return false
        return true
      })
    } else {
      return false
    }
  }

  canDropFarmer = () => {
    return this.getPlayer('me').pickedFarmers.length > 0
  }

  pickDropFarmer = () => {
    if (this.canPickFarmer() && this.canDropFarmer()) {
      let inputOptions = { pick: 'Pick', drop: 'Drop' }
      Swal.fire({
        title: 'Would you like to pick or drop a farmer?',
        input: 'select',
        inputOptions,
        inputPlaceholder: 'Choose your action',
        showCancelButton: true,
      }).then((res) => {
        if ('value' in res) {
          const pickedFarmerId = this.getPlayer('me').pickedFarmers[0]
          const farmerToDrop = this.props.G.tokens.farmer.findIndex((farmer) => farmer.id === pickedFarmerId)
          const farmerToPick = this.props.G.tokens.farmer.findIndex((farmer) => farmer.id !== pickedFarmerId)
          res.value === 'pick' ? this.props.moves.pickFarmer(farmerToPick) : this.props.moves.dropFarmer(farmerToDrop)
        }
      })
    } else {
      const index = this.props.G.tokens.farmer.findIndex((farmer) => farmer.position === this.getPlayer('me').position)
      this.canPickFarmer() ? this.props.moves.pickFarmer(index) : this.props.moves.dropFarmer(index)
    }
  }

  canDrink = () => {
    const well = this.props.G.tokens.well.find((well) => well.position === this.getPlayer('me').position)
    return well && !well.used
  }

  drink = () => {
    const index = this.props.G.tokens.well.findIndex((well) => well.position === this.getPlayer('me').position)
    const bonus = this.getPlayer('me').specialAbilities.wellPower
    this.props.moves.drink(index, bonus)
  }

  canFight = () => {
    const position = this.getPlayer('turn').position
    const hoursPassed = this.getPlayer('turn').hoursPassed
    const monsters = this.props.G.monsters.filter(
      (monster) =>
        monster.position === position ||
        (this.getPlayer('turn').specialAbilities.proxyAttack && tiles.neighbors[position].includes(monster.position))
    )
    if (this.isActivePlayer() && monsters.length > 0 && hoursPassed < 10) {
      if (hoursPassed < 7 || (hoursPassed >= 7 && this.getPlayer('turn').willpower >= 3)) {
        return true
      }
    }
    return false
  }

  fight = () => {
    const monsters = this.props.G.monsters.filter(
      (monster) =>
        monster.position === this.getPlayer('turn').position ||
        (this.getPlayer('turn').specialAbilities.proxyAttack &&
          tiles.neighbors[this.getPlayer('turn').position].includes(monster.position))
    )
    if (monsters.length > 1) {
      let inputOptions: { [inputValue: string]: string } = {}
      monsters.forEach((monster) => (inputOptions[monster.id.toString()] = `${monster.position}: ${monster.type}`))
      Swal.fire({
        title: 'Which monster to attack',
        input: 'select',
        inputOptions,
        inputPlaceholder: 'Select a monster',
        showCancelButton: true,
      }).then((res) => {
        this.props.moves.startFight(parseInt(res.value))
      })
    } else {
      console.log('monsters', monsters)
      this.props.moves.startFight(monsters[0].id)
    }
  }

  finishRoll = () => {
    if (this.isActivePlayer() && this.props.G.rollingDices.length > 0) {
      if (this.props.G.fight.turn === 'player') this.props.moves.monsterAttack()
      else this.props.moves.endFight()
    }
  }

  renderPlayers = () => {
    const players = this.props.G.players
    return Object.keys(players).map((playerID) => {
      const position = players[playerID].position
      return (
        <img
          key={playerID}
          src={this.playerCharacters[playerID]}
          alt="character"
          className="character"
          style={{
            ...this.getPlayerPosition(position, playerID),
            ...this.getCharacterSize(),
          }}
        />
      )
    })
  }

  renderMonsters = () => {
    const monsters = this.props.G.monsters
    return monsters.map((monster, key) => {
      return (
        <img
          key={key}
          src={this.monsterCharacters[monster.type]}
          alt="monster"
          className="character"
          style={{
            ...this.getPlayerPosition(monster.position, monster.id),
            ...this.getCharacterSize(),
          }}
        />
      )
    })
  }

  renderHoursToken = () => {
    const players = this.props.G.players
    return Object.keys(players).map((playerID) => {
      const hoursPassed = players[playerID].hoursPassed + (this.isActivePlayer() ? players[playerID].path.length : 0)
      return (
        <img
          key={playerID}
          alt="player token"
          src={this.playersToken[parseInt(playerID)]}
          className="character"
          style={{
            ...this.getTokenPosition({ coords: tiles.hours[Math.min(hoursPassed, 10)] }),
            ...this.getTokenSize(),
          }}
        />
      )
    })
  }

  renderTokens = () => {
    const tokens = []
    for (let type in this.props.G.tokens) {
      const subtok = this.props.G.tokens[type as TokenType] as any[]
      tokens.push(
        subtok.map((token: any, key: number) => {
          let coords = this.MAP.areas[token.position].coords
          let tokenType = type
          if (type === 'fog') {
            coords = tiles.fogAreas[token.position]
          } else if (type === 'well') {
            coords = tiles.wellAreas[token.position]
            if (token.used) tokenType = 'empty-well'
          }

          return (
            <img
              key={key}
              alt={tokenType}
              src={this.tokens[tokenType]}
              className="character"
              style={{
                ...this.getTokenPosition({ coords }),
                ...this.getTokenSize(type as TokenType),
              }}
            />
          )
        })
      )
    }
    return tokens
  }

  handleNewUserMessage = (newMessage: string) => {
    var textMessage = new CometChat.TextMessage(
      'legendofandor',
      `${this.getPlayer('me').name}: ${newMessage}`,
      CometChat.RECEIVER_TYPE.GROUP
    )
    CometChat.sendMessage(textMessage)
  }

  displayStatusMessage() {
    const status = this.props.G.status
    if (status) {
      let title = ''
      let html = ''
      let timer = 1000
      let icon = 'info' as 'error' | 'question' | 'success' | 'warning' | 'info' | undefined
      if (status.id === 'new day') {
        title = 'A new day has started'
        timer = 6000
        html = `<div>
        <p>Castle health: ${this.props.G.castleDefense}</p>
        <p>Narrator: ${this.props.G.letter}</p>
        <p># of monsters remaining: ${this.props.G.monsters.filter((monster) => monster.position !== 80).length}</p>
        </div>`
      } else if (status.id === 'next turn') {
        title = `${this.props.G.players[this.props.ctx.currentPlayer].name} turn has started`
        timer = 1000
      } else if (status.id === 'farmer picked') {
        icon = 'success'
        title = 'Farmer picked!'
        html = 'Bring him to the castle to increase the castle defense.'
      } else if (status.id === 'farmer dropped') {
        title = 'Farmer dropped!'
        if (status.data.position === 0)
          html = `You brought the farmer to the castle! The castle defense has increased to ${
            this.props.G.castleDefense + 1
          }`
        else html = `You left the farmer at tile ${status.data.position}. If a monster reaches him, he's toast!`
      } else if (status.id === 'fight summary') {
        title = 'Fight Summary'
        const { monster, player, summary } = status.data
        html = `
        <div>
          <div>
            <div>${player.name}: ${player.attack}</div>
            <div>${monster.type}: ${monster.attack}</div>
          </div>
          <div>${summary}</div>
        </div>`
        timer = 6000
      } else if (status.id === 'drink well') {
        title = 'Yummy!'
        html = `<p>${status.data.player.name} drank from the well and gained 3 willpowers</p>`
        if (status.data.bonus)
          html += `<p>${status.data.player.name} gained an additional +2 willpowers due to his special ability!</p>`
      } else if (status.id === 'game over') {
        title = 'Game Over'
        html = 'You lost, loser.'
        timer = 10000000000
      }
      if (status.id === 'next turn' && this.getPlayer('turn').endDay) {
        this.props.moves.clearStatus()
      } else {
        Swal.fire({
          title,
          icon,
          html,
          timer,
          timerProgressBar: true,
          onBeforeOpen: () => {
            status.id !== 'game over' && Swal.showLoading()
          },
        }).then(() => {
          let endTurn = status.id === 'fight summary'
          status.id !== 'game over' && this.props.moves.clearStatus(endTurn)
        })
      }
    }
  }

  isEmpty(obj: any) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) return false
    }
    return true
  }

  render() {
    const override = css`
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      -ms-transform: translate(-50%, -50%);
      z-index: 100;
    `
    return (
      <div className="board">
        {this.props.G.init && (
          <React.Fragment>
            <ClockLoader css={override} size={100} color={'white'} loading={this.state.loadingImage} />
            <ImageMapper
              src={gameBoard}
              map={this.MAP}
              width={this.state.windowWidth}
              imgWidth={this.originalImgWidth}
              height={this.state.windowHeight}
              imgHeight={this.originalImgHeight}
              onLoad={() => this.state.loadingImage && this.setState({ loadingImage: false })}
              onClick={(area: Area) => this.clicked(area)}
              onMouseEnter={(area: Area) => this.enterArea(area)}
              onMouseLeave={() => this.leaveArea()}
              strokeColor={this.playersColor[parseInt(this.props.playerID)]}
              lineWidth={5}
              hoveredAreas={this.getHoveredAreas()}
              paths={this.getPaths()}
            />
            {this.getPlayer('me').hoveredArea && (
              <span className="tooltip" style={{ ...this.getTipPosition(this.getPlayer('me').hoveredArea) }}>
                {this.getPlayer('me').hoveredArea?.name}
              </span>
            )}

            {[this.renderTokens(), this.renderPlayers(), this.renderMonsters(), this.renderHoursToken()]}
            <img
              alt="narrator token"
              src={narratorToken}
              className="character"
              style={{
                ...this.getTokenPosition({ coords: tiles.narratorAreas[this.props.G.letter] }),
                ...this.getTokenSize(),
              }}
            />
            <Fab
              mainButtonStyles={{ backgroundColor: this.playersColor[parseInt(this.props.ctx.currentPlayer)] }}
              position={{ bottom: 50, right: 50 }}
              icon={<Icon name="add" />}
              alwaysShowTitle={true}
            >
              <Action
                text="Drink"
                onClick={() => this.canDrink() && this.drink()}
                style={this.canDrink() ? { backgroundColor: this.playersColor[parseInt(this.props.playerID)] } : {}}
              >
                <IoIosWater />
              </Action>
              <Action
                text="Collect"
                onClick={() => false && console.log('collecting coins')}
                style={false ? { backgroundColor: this.playersColor[parseInt(this.props.playerID)] } : {}}
              >
                <RiHandCoinLine />
              </Action>
              <Action
                text="Drop/Pick Farmer"
                onClick={() => (this.canPickFarmer() || this.canDropFarmer()) && this.pickDropFarmer()}
                style={
                  this.canPickFarmer() || this.canDropFarmer()
                    ? { backgroundColor: this.playersColor[parseInt(this.props.playerID)] }
                    : {}
                }
              >
                <GiFarmer />
              </Action>
              <Action
                text="Fight"
                onClick={() => this.isActivePlayer() && this.canFight() && this.fight()}
                style={
                  this.isActivePlayer() && this.canFight()
                    ? { backgroundColor: this.playersColor[parseInt(this.props.playerID)] }
                    : {}
                }
              >
                <RiSwordLine />
              </Action>
              <Action
                text="Skip Turn"
                onClick={() => this.isActivePlayer() && this.props.moves.skipTurn()}
                style={
                  this.isActivePlayer() ? { backgroundColor: this.playersColor[parseInt(this.props.playerID)] } : {}
                }
              >
                <BsSkipForwardFill />
              </Action>
              <Action
                text="End Day"
                onClick={() => this.isActivePlayer() && this.props.moves.endDay()}
                style={
                  this.isActivePlayer() ? { backgroundColor: this.playersColor[parseInt(this.props.playerID)] } : {}
                }
              >
                <Icon name="bed" />
              </Action>
            </Fab>
          </React.Fragment>
        )}
        <DiceWindow
          open={this.state.openDice}
          fight={this.props.G.fight}
          handleClose={() => this.setState({ openDice: false })}
          color={this.playersColor[parseInt(this.props.ctx.currentPlayer)]}
          rollingDices={this.props.G.rollingDices}
          onFinishRoll={() => this.finishRoll()}
        />
        <ResourceSplit
          splitResource={this.props.moves.splitResource}
          total={this.props.G.resources.total}
          add={this.props.moves.add}
          current={this.props.G.resources.current}
          open={!this.isEmpty(this.props.G.resources.total)}
          names={this.props.gameMetadata.map((player: any) => player.name)}
        />
        {this.state.uid && <Widget title="In Game Chat" subtitle="" handleNewUserMessage={this.handleNewUserMessage} />}
      </div>
    )
  }
}
