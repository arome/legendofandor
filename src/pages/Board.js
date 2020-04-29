import React, { Component } from 'react'
import ImageMapper from 'react-image-mapper'
import gameBoard from '../assets/images/Andor_Board.jpg'
import './Board.scss'
import tiles from './tiles'
import Swal from 'sweetalert2'
import { css } from '@emotion/core'
import { Icon } from 'semantic-ui-react'
import { ClockLoader } from 'react-spinners'
import { Fab, Action } from 'react-tiny-fab'
import { separator, heroes } from '../common'
import { RiSwordLine, RiHandCoinLine } from 'react-icons/ri'
import { IoIosWater } from 'react-icons/io'
import DicesWindow from '../modals/DiceWindow'
import ResourceSplit from '../modals/ResourceSplit'
import { BsSkipForwardFill } from 'react-icons/bs'
import 'react-tiny-fab/dist/styles.css'
import narratorToken from '../assets/images/tokens/narrator.png'

export default class GameBoard extends Component {
  MAP
  areas
  originalImgHeight = 6476
  originalImgWidth = 9861
  constructor(props) {
    super(props)
    const heroeslist = []
    this.playerCharacters = {}
    this.monsterCharacters = {}
    this.tokens = {}
    this.playersColor = []
    Object.keys(this.props.gameMetadata).forEach((player) => {
      const heroName = this.props.gameMetadata[player].name.split(separator)[1]
      heroeslist.push(heroName)
      this.playerCharacters[player] = require(`../assets/images/characters/pawns/${heroName}.png`)
      this.playersColor.push(heroes[heroName].color)
    })
    const monsterTypes = ['Gor', 'Skrall']
    const tokenTypes = ['fog', 'well', 'farmer', 'empty-well']

    monsterTypes.forEach(
      (monsterType) =>
        (this.monsterCharacters[monsterType] = require(`../assets/images/characters/pawns/monsters/${monsterType}.png`))
    )
    tokenTypes.forEach((tokenType) => (this.tokens[tokenType] = require(`../assets/images/tokens/${tokenType}.png`)))
    this.playersToken = {}
    this.playersColor.map(
      (color, index) => (this.playersToken[index] = require(`../assets/images/tokens/${color}.png`))
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

    this.loadingImage = true
    this.state = {
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      loadingImage: true,
      openDice: false,
    }

    !this.props.G.init && this.props.moves.setupData(heroeslist)
  }

  handleResize = () =>
    this.setState({
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
    })

  componentDidMount() {
    window.addEventListener('resize', this.handleResize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  enterArea(area) {
    this.props.moves.setHoveredArea(area)
  }

  isActivePlayer = () => this.props.playerID === this.props.ctx.currentPlayer

  clicked(area) {
    const to = parseInt(area.name)
    const myPath = this.props.G.players[this.props.playerID].path
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
            : result.dismiss === 'cancel' &&
              this.props.moves.drawPath(lastSelected, this.props.G.players[this.props.playerID].positionOnMap)
        })
      : this.props.moves.drawPath(lastSelected, to)
  }

  leaveArea() {
    this.props.moves.setHoveredArea(null)
  }

  getTipPosition(area) {
    return { top: `${area.center[1]}px`, left: `${area.center[0]}px` }
  }

  getPlayerPosition(position, id) {
    const center = this.computeCenter(this.MAP.areas[position])
    const monstersInArea = this.props.G.monsters.filter((monster) => monster.positionOnMap === position)
    const heroesInArea = Object.keys(this.props.G.players).filter(
      (playerID) => this.props.G.players[playerID].positionOnMap === position
    )
    const charactersInArea = heroesInArea.concat(monstersInArea)
    console.log('charactersInArea', charactersInArea)
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

  getTokenPosition(area) {
    const center = this.computeCenter(area)
    const horizontalTranslation = this.getCharacterSize().width / 2
    const veritcalTranslation = (this.getCharacterSize().heigth * 2) / 5
    let topPosition = center[1]
    let leftPosition = center[0]
    return {
      top: `${topPosition}px`,
      left: `${leftPosition}px`,
    }
  }

  getTokenSize = (type) => {
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

  computeCenter(area) {
    if (!area) return [0, 0]
    const scaledCoords = area.coords.map((coord, index) =>
      index % 2 === 1
        ? (coord * this.state.windowHeight) / this.originalImgHeight
        : (coord * this.state.windowWidth) / this.originalImgWidth
    )
    // Calculate centroid
    if (scaledCoords.length === 3) {
      const [x, y, radius] = scaledCoords
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
    const numPlayers = Object.keys(this.props.G.players).length
    const paths = []
    for (let i = 0; i < numPlayers; i++)
      if (i !== parseInt(this.props.playerID))
        paths.push({
          circle: { color: this.playersColor[i], radius: 10 },
          line: { color: this.playersColor[i] },
          steps: this.props.G.players[i].path,
        })
    paths.push({
      circle: { color: this.playersColor[this.props.playerID], radius: 10 },
      line: { color: this.playersColor[this.props.playerID] },
      steps: this.props.G.players[this.props.playerID].path,
    })
    return paths
  }

  getHoveredAreas() {
    const numPlayers = this.props.G.players.length
    const hoveredAreas = []
    for (let i = 0; i < numPlayers; i++) {
      const hoveredArea = this.props.G.players[i].hoveredArea
      if (i !== parseInt(this.props.playerID) && hoveredArea)
        hoveredAreas.push({ ...hoveredArea, strokeColor: this.playersColor[i], _id: i })
    }
    const myHoveredArea = this.props.G.players[this.props.playerID].hoveredArea
    myHoveredArea &&
      hoveredAreas.push({
        ...myHoveredArea,
        strokeColor: this.playersColor[this.props.playerID],
        _id: this.props.playerID,
      })
    return hoveredAreas
  }

  rollDices = () => {
    if (this.isActivePlayer()) {
      this.props.moves.startRollDices()
      this.setState({ openDice: true })
    }
  }

  renderPlayers = () => {
    const players = this.props.G.players
    return Object.keys(players).map((playerID) => {
      const positionOnMap = players[playerID].positionOnMap
      return (
        <img
          key={playerID}
          src={this.playerCharacters[playerID]}
          alt="character"
          className="character"
          style={{
            ...this.getPlayerPosition(positionOnMap, playerID),
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
            ...this.getPlayerPosition(monster.positionOnMap, monster.startingPos),
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
          src={this.playersToken[playerID]}
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
    const tokens = this.props.G.tokens
    return tokens.map((token, key) => {
      let coords = this.MAP.areas[token.positionOnMap].coords
      if (token.type === 'fog') {
        coords = tiles.fogAreas[token.positionOnMap]
      } else if (token.type === 'well') {
        coords = tiles.wellAreas[token.positionOnMap]
      }
      const tokenType = token.type === 'well' ? (token.used ? 'empty-well' : 'well') : token.type
      return (
        <img
          key={key}
          alt={token.type}
          src={this.tokens[tokenType]}
          className="character"
          style={{
            ...this.getTokenPosition({ coords }),
            ...this.getTokenSize(token.type),
          }}
        />
      )
    })
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
            onClick={(area) => this.clicked(area)}
            onMouseEnter={(area) => this.enterArea(area)}
            onMouseLeave={() => this.leaveArea()}
            strokeColor={this.playersColor[this.props.playerID]}
            lineWidth={5}
            hoveredAreas={this.getHoveredAreas()}
            paths={this.getPaths()}
          />
          {this.state.hoveredArea && (
            <span className="tooltip" style={{ ...this.getTipPosition(this.state.hoveredArea) }}>
              {this.state.hoveredArea?.name}
            </span>
          )}
          {this.renderTokens()}
          {this.renderPlayers()}
          {this.renderMonsters()}
          {this.renderHoursToken()}
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
            mainButtonStyles={{ backgroundColor: this.playersColor[this.props.playerID] }}
            actionButtonStyles={{ backgroundColor: this.playersColor[this.props.playerID] }}
            position={{ bottom: 50, right: 50 }}
            icon={<Icon name="add" />}
            alwaysShowTitle={true}
          >
            <Action text="Drink" onClick={() => this.props.moves.drink()}>
              <IoIosWater />
            </Action>
            <Action text="Collect" onClick={() => console.log('collecting coins')}>
              <RiHandCoinLine />
            </Action>
            <Action text="Fight" onClick={() => this.rollDices()}>
              <RiSwordLine />
            </Action>
            <Action text="Skip Turn" onClick={() => this.props.moves.skipTurn()}>
              <BsSkipForwardFill />
            </Action>
            <Action text="End Turn" onClick={() => this.props.moves.endTurn()}>
              <Icon name="flag checkered" />
            </Action>
            <Action text="End Day" onClick={() => this.props.moves.endDay()}>
              <Icon name="bed" />
            </Action>
          </Fab>
        </React.Fragment>
        <DicesWindow
          open={this.state.openDice}
          handleClose={() => this.setState({ openDice: false })}
          color={this.playersColor[this.props.playerID]}
          rollingDices={this.props.G.rollingDices}
          onFinishRoll={() => this.props.moves.finishRollDices()}
        />
        <ResourceSplit
          splitResource={this.props.moves.splitResource}
          resources={this.props.G.splittableResource}
          add={this.props.moves.add}
          tempSplit={this.props.G.tempSplit}
          open={this.props.G.splittableResource.length > 0}
          names={this.props.gameMetadata.map((player) => player.name.split(separator)[0])}
        />
      </div>
    )
  }
}
