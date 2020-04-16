import React, { Component } from 'react'
import ImageMapper from 'react-image-mapper'
import gameBoard from '../assets/images/Andor_Board.jpg'
import character from '../assets/images/archer.png'
import './Board.css'
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
    this.props.moves.setHoveredArea(this.props.playerID, area)
  }

  clicked(area) {
    const to = parseInt(area.name)
    const myPath = this.props.G.paths[this.props.playerID]
    const lastSelected = myPath.length > 0 ? myPath[myPath.length - 1][1] : null
    if (lastSelected === to) {
      if (this.props.playerID === this.props.ctx.currentPlayer)
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
              this.props.moves.drawPath(
                this.props.playerID,
                lastSelected,
                this.props.G.players[this.props.playerID].positionOnMap
              )
        })
    } else {
      this.props.moves.drawPath(this.props.playerID, lastSelected, to)
    }
  }

  leaveArea() {
    this.props.moves.setHoveredArea(this.props.playerID, null)
  }

  getTipPosition(area) {
    return { top: `${area.center[1]}px`, left: `${area.center[0]}px` }
  }

  getPlayerPosition(area, pos, numOccurence) {
    const center = this.computeCenter(area)
    return {
      top: `${center[1] - this.getCharacterSize().heigth / 3}px`,
      left: `${center[0] - (Math.pow(-1, pos) * (numOccurence - 1) * this.getCharacterSize().width) / 2}px`,
    }
  }

  getCharacterSize = () => {
    const scale = (2 * this.state.windowWidth) / this.originalImgWidth
    return {
      width: 155 * scale,
      heigth: 251 * scale,
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
    const pathsLength = this.props.G.paths.length
    const paths = []
    for (let i = 0; i < pathsLength; i++)
      if (i !== parseInt(this.props.playerID))
        paths.push({
          circle: { color: colors[i], radius: 10 },
          line: { color: colors[i] },
          steps: this.props.G.paths[i],
        })
    paths.push({
      circle: { color: colors[this.props.playerID], radius: 10 },
      line: { color: colors[this.props.playerID] },
      steps: this.props.G.paths[this.props.playerID],
    })
    return paths
  }

  getHoveredAreas(colors) {
    const hoveredAreasLength = this.props.G.hoveredAreas.length
    const hoveredAreas = []
    for (let i = 0; i < hoveredAreasLength; i++) {
      const hoveredArea = this.props.G.hoveredAreas[i]
      if (i !== parseInt(this.props.playerID) && hoveredArea)
        hoveredAreas.push({ ...hoveredArea, strokeColor: colors[i], _id: i })
    }
    const myHoveredArea = this.props.G.hoveredAreas[this.props.playerID]
    myHoveredArea &&
      hoveredAreas.push({ ...myHoveredArea, strokeColor: colors[this.props.playerID], _id: this.props.playerID })
    return hoveredAreas
  }

  renderPlayers = () => {
    const positions = this.props.G.players.map((player) => player.positionOnMap)
    return this.props.G.players.map((player, pos) => {
      const numOccurence = positions.filter((v) => v === player.positionOnMap).length
      return (
        <img
          key={pos}
          src={character}
          alt="character"
          className="character"
          style={{
            ...this.getPlayerPosition(this.MAP.areas[player.positionOnMap], pos, numOccurence),
            ...this.getCharacterSize(),
          }}
        />
      )
    })
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
      </div>
    )
  }
}