import React, { Component } from 'react'
import ImageMapper from 'react-image-mapper'
import gameBoard from '../Andor_Board.jpg'
import character from '../archer.png'
import './Board.css'
import tiles from './tiles'
import swal from 'sweetalert'

export default class GameBoard extends Component {
  areas
  constructor(props) {
    super(props)
    this.areas = tiles.graph.vertices.map((vertice) => {
      return {
        name: vertice.data.id,
        shape: 'poly',
        coords: vertice.data.area,
        pendingMoveConfirmation: false,
        selectedDestination: null,
      }
    })
    this.state = { hoveredArea: null, windowWidth: window.innerWidth, pendingConfirm: false }
  }

  handleResize = () => this.setState({ windowWidth: window.innerWidth })

  componentDidMount() {
    window.addEventListener('resize', this.handleResize)
    var c = document.getElementsByTagName('canvas')[0]
    var ctx = c.getContext('2d')
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(1000, 500)
    ctx.stroke()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  enterArea(area) {
    this.setState({ hoveredArea: area })
  }

  clicked(area) {
    this.selectedDestination = parseInt(area.name)
    this.setState({ pendingConfirm: true })
  }

  leaveArea() {
    this.setState({ hoveredArea: null })
  }

  getTipPosition(area) {
    return { top: `${area.center[1]}px`, left: `${area.center[0]}px` }
  }

  getPlayerPosition(area) {
    const center = this.computeCenter(area)
    return {
      top: `${center[1] - this.getCharacterSize().heigth / 3}px`,
      left: `${center[0]}px`,
    }
  }

  getCharacterSize = () => {
    return {
      width: (155 * 2 * this.state.windowWidth) / 9861,
      heigth: (251 * 2 * this.state.windowWidth) / 9861,
    }
  }

  resetMove = () => {
    this.setState({ pendingConfirm: false })
    this.selectedDestination = null
  }

  confirmMove = () => {
    this.setState({ pendingConfirm: false })
    this.props.moves.move(this.selectedDestination)
    this.selectedDestination = null
  }

  computeCenter(area) {
    if (!area) return [0, 0]
    const scaledCoords = area.coords.map((coord) => (coord * this.state.windowWidth) / 9861)
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

  drawLine(areaFromId, areaToId) {
    const areaFrom = this.areas[areaFromId]
    const areaTo = this.areas[areaToId]
    const point1 = this.computeCenter(areaFrom)
    const point2 = this.computeCenter(areaTo)
    return (
      <g key={areaToId}>
        <line
          strokeDasharray="6,6"
          x1={point1[0]}
          y1={point1[1]}
          x2={point2[0]}
          y2={point2[1]}
          className="line"
        />
        <circle
          cx={point2[0]}
          cy={point2[1]}
          r={(15 * this.state.windowWidth) / 9861}
          stroke="red"
          strokeWidth="3"
          fill="red"
        />
      </g>
    )
  }

  showPopup = () => {
    swal('Confirm move?', {
      buttons: {
        cancel: 'Cancel',
        confirm: {
          text: 'Confirm',
          confirm: true,
        },
      },
    }).then((value) => {
      console.log('value', value)
      if (value) {
        this.confirmMove()
      } else {
        this.resetMove()
      }
    })
  }

  renderPlayers() {}

  render() {
    const MAP = {
      name: 'my-map',
      areas: this.areas,
    }

    return (
      <div className="container">
        <ImageMapper
          src={gameBoard}
          map={MAP}
          width={this.state.windowWidth}
          imgWidth={9861}
          onClick={(area) => this.clicked(area)}
          onMouseEnter={(area) => this.enterArea(area)}
          onMouseLeave={() => this.leaveArea()}
          // onMouseMove={(area, _, evt) => this.moveOnArea(area, evt)}
          // onImageClick={(evt) => this.clickedOutside(evt)}
          // onImageMouseMove={(evt) => this.moveOnImage(evt)}
        />
        {this.state.hoveredArea && (
          <span className="tooltip" style={{ ...this.getTipPosition(this.state.hoveredArea) }}>
            {this.state.hoveredArea?.name}
          </span>
        )}
        {this.props.G.players.map((player, pos) => (
          <img
            key={pos}
            src={character}
            alt="character"
            className="character"
            style={{
              ...this.getPlayerPosition(this.areas[player.positionOnMap]),
              ...this.getCharacterSize(),
            }}
          />
        ))}
        {this.state.pendingConfirm && (
          <React.Fragment>
            <svg
              width={this.state.windowWidth}
              height={(6476 * this.state.windowWidth) / 9861}
              className="path">
              {tiles.dijkstra
                .shortestPath(
                  tiles.graph.vertices[
                    this.props.G.players[this.props.ctx.currentPlayer].positionOnMap
                  ],
                  tiles.graph.vertices[this.selectedDestination]
                )
                .map((step) =>
                  this.drawLine(parseInt(step.from.data['id']), parseInt(step.to.data['id']))
                )}
            </svg>
            {this.showPopup()}
          </React.Fragment>
        )}
      </div>
    )
  }
}
