import React, { Component } from 'react'
import ImageMapper from 'react-image-mapper'
import gameBoard from '../assets/images/Andor_Board.jpg'
import character from '../assets/images/characters/pawns/Archer_male.png'
import './Board.scss'
import tiles from './tiles'
import Swal from 'sweetalert2'

export default class GameBoard extends Component {
  MAP
  areas
  originalImgHeight = 6476
  originalImgWidth = 9861
  constructor(props) {
    super(props)
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

  getPaths(colors) {
    const numPlayers = this.props.G.players.length
    const paths = []
    for (let i = 0; i < numPlayers; i++)
      if (i !== parseInt(this.props.playerID))
        paths.push({
          circle: { color: colors[i], radius: 10 },
          line: { color: colors[i] },
          steps: this.props.G.players[i].path,
        })
    paths.push({
      circle: { color: colors[this.props.playerID], radius: 10 },
      line: { color: colors[this.props.playerID] },
      steps: this.props.G.players[this.props.playerID].path,
    })
    return paths
  }

  getHoveredAreas(colors) {
    const numPlayers = this.props.G.players.length
    const hoveredAreas = []
    for (let i = 0; i < numPlayers; i++) {
      const hoveredArea = this.props.G.players[i].hoveredArea
      if (i !== parseInt(this.props.playerID) && hoveredArea)
        hoveredAreas.push({ ...hoveredArea, strokeColor: colors[i], _id: i })
    }
    const myHoveredArea = this.props.G.players[this.props.playerID].hoveredArea
    myHoveredArea &&
      hoveredAreas.push({
        ...myHoveredArea,
        strokeColor: colors[this.props.playerID],
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
    // const positions = this.props.G.players.map((player) => player.hous)
  }

  render() {
    const colors = ['red', 'blue', 'green', 'yellow']
    return (
      <div className="container">
        <ImageMapper
          src={gameBoard}
          map={this.MAP}
          width={this.state.windowWidth}
          imgWidth={this.originalImgWidth}
          height={this.state.windowHeight}
          imgHeight={this.originalImgHeight}
          onClick={(area) => this.clicked(area)}
          onMouseEnter={(area) => this.enterArea(area)}
          onMouseLeave={() => this.leaveArea()}
          strokeColor={colors[this.props.playerID]}
          lineWidth={5}
          hoveredAreas={this.getHoveredAreas(colors)}
          paths={this.getPaths(colors)}
        />
        {this.state.hoveredArea && (
          <span className="tooltip" style={{ ...this.getTipPosition(this.state.hoveredArea) }}>
            {this.state.hoveredArea?.name}
          </span>
        )}
        {this.renderPlayers()}
        {this.renderHoursToken()}
      </div>
    )
  }
}
