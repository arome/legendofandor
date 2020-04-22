import React, { Component } from 'react'
import ImageMapper from 'react-image-mapper'
import gameBoard from '../assets/images/Andor_Board.jpg'
import character from '../assets/images/characters/pawns/Archer_male.png'
import './Board.scss'
import tiles from './tiles'
import Swal from 'sweetalert2'
import { css } from '@emotion/core'
import { Icon } from 'semantic-ui-react'
import { ClockLoader } from 'react-spinners'
import { Fab, Action } from 'react-tiny-fab'
import { playersColor } from '../common'
import 'react-tiny-fab/dist/styles.css'

export default class GameBoard extends Component {
  MAP
  areas
  originalImgHeight = 6476
  originalImgWidth = 9861
  constructor(props) {
    super(props)
    this.playersToken = {}
    playersColor.map((color, index) => (this.playersToken[index] = require(`../assets/images/tokens/${color}.png`)))
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
    }
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

  clicked(area) {
    const to = parseInt(area.name)
    const myPath = this.props.G.players[this.props.playerID].path
    const lastSelected = myPath.length > 0 ? myPath[myPath.length - 1][1] : null
    lastSelected === to
      ? this.props.playerID === this.props.ctx.currentPlayer &&
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

  getPlayerPosition(area, playerID, duplicates) {
    const center = this.computeCenter(area)
    const horizontalTranslation = this.getCharacterSize().width / 2
    const veritcalTranslation = (this.getCharacterSize().heigth * 2) / 5
    let topPosition = center[1]
    let leftPosition = center[0]
    const pos = duplicates.indexOf(playerID)
    if (duplicates.length > 1) {
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

  getTokenPosition(area, playerID) {
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

  getTokenSize = () => {
    const scale = (2 * this.state.windowWidth) / this.originalImgWidth
    return {
      width: 50 * scale,
      heigth: 50 * scale,
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
    const n = scaledCoords.length / 2
    const { y, x } = scaledCoords.reduce(
      ({ y, x }, val, idx) => {
        return !(idx % 2) ? { y, x: x + val / n } : { y: y + val / n, x }
      },
      { y: 0, x: 0 }
    )
    return [x, y]
  }

  getPaths(playersColor) {
    const numPlayers = Object.keys(this.props.G.players).length
    const paths = []
    for (let i = 0; i < numPlayers; i++)
      if (i !== parseInt(this.props.playerID))
        paths.push({
          circle: { color: playersColor[i], radius: 10 },
          line: { color: playersColor[i] },
          steps: this.props.G.players[i].path,
        })
    paths.push({
      circle: { color: playersColor[this.props.playerID], radius: 10 },
      line: { color: playersColor[this.props.playerID] },
      steps: this.props.G.players[this.props.playerID].path,
    })
    return paths
  }

  getHoveredAreas(playersColor) {
    const numPlayers = this.props.G.players.length
    const hoveredAreas = []
    for (let i = 0; i < numPlayers; i++) {
      const hoveredArea = this.props.G.players[i].hoveredArea
      if (i !== parseInt(this.props.playerID) && hoveredArea)
        hoveredAreas.push({ ...hoveredArea, strokeColor: playersColor[i], _id: i })
    }
    const myHoveredArea = this.props.G.players[this.props.playerID].hoveredArea
    myHoveredArea &&
      hoveredAreas.push({
        ...myHoveredArea,
        strokeColor: playersColor[this.props.playerID],
        _id: this.props.playerID,
      })
    return hoveredAreas
  }

  renderPlayers = () => {
    const players = this.props.G.players
    return Object.keys(players).map((playerID) => {
      const positionOnMap = players[playerID].positionOnMap
      const duplicates = Object.keys(players).filter((pplayerID) => players[pplayerID].positionOnMap === positionOnMap)
      return (
        <img
          key={playerID}
          src={character}
          alt="character"
          className="character"
          style={{
            ...this.getPlayerPosition(this.MAP.areas[positionOnMap], playerID, duplicates),
            ...this.getCharacterSize(),
          }}
        />
      )
    })
  }

  renderHoursToken = () => {
    const players = this.props.G.players
    return Object.keys(players).map((playerID) => {
      const hoursPassed =
        players[playerID].hoursPassed +
        (this.props.playerID === this.props.ctx.currentPlayer ? players[playerID].path.length : 0)
      return (
        <img
          key={playerID}
          alt="player token"
          src={this.playersToken[playerID]}
          className="character"
          style={{
            ...this.getTokenPosition({ coords: tiles.hours[hoursPassed] }, playerID),
            ...this.getTokenSize(),
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
            strokeColor={playersColor[this.props.playerID]}
            lineWidth={5}
            hoveredAreas={this.getHoveredAreas(playersColor)}
            paths={this.getPaths(playersColor)}
          />
          {this.state.hoveredArea && (
            <span className="tooltip" style={{ ...this.getTipPosition(this.state.hoveredArea) }}>
              {this.state.hoveredArea?.name}
            </span>
          )}
          {this.renderPlayers()}
          {this.renderHoursToken()}
          <Fab
            mainButtonStyles={{ backgroundColor: playersColor[this.props.playerID] }}
            actionButtonStyles={{ backgroundColor: playersColor[this.props.playerID] }}
            position={{ bottom: 50, right: 50 }}
            icon={<Icon name="add" />}
            // event={event}
            alwaysShowTitle={true}
            // onClick={someFunctionForTheMainButton}
          >
            <Action text="Drink" onClick={() => console.log('drinking')}>
              <Icon name="glass martini" />
            </Action>
            <Action text="Collect" onClick={() => console.log('collecting coins')}>
              <Icon name="usd" />
            </Action>
            <Action text="End Turn" onClick={() => console.log('ending turn')}>
              <Icon name="flag checkered" />
            </Action>
            <Action text="End Day" onClick={() => console.log('ending day')}>
              <Icon name="bed" />
            </Action>
          </Fab>
        </React.Fragment>
      </div>
    )
  }
}
