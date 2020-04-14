import React, { Component } from 'react'
import ImageMapper from 'react-image-mapper'
import gameBoard from '../Andor_Board.jpg'
import character from '../archer.png'
import './Board.css'
import tiles from './tiles'
import swal from 'sweetalert'

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
          pendingMoveConfirmation: false,
          lastSelected: null,
        }
      }),
    }

    this.state = {
      hoveredArea: null,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      pendingConfirm: false,
      path: { steps: [] },
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
    this.setState({ hoveredArea: area })
  }

  distance(from, to) {
    var iDiff = from.data.i - to.data.i
    var jDiff = from.data.j - to.data.j
    return Math.sqrt(iDiff * iDiff + jDiff * jDiff)
  }

  clicked(area) {
    const to = parseInt(area.name)
    if (this.lastSelected === to) {
      this.showPopup()
    } else if (!this.state.path.steps.some((step) => step.includes(to))) {
      const from = this.lastSelected || this.props.G.players[this.props.ctx.currentPlayer].positionOnMap
      const path = tiles.dijkstra.shortestPath(tiles.graph.vertices[from], tiles.graph.vertices[to], {
        OUT: {
          heuristic: function heuristic(n) {
            return this.distance(n, to)
          },
        },
        IN: {
          heuristic: function heuristic(n) {
            return this.distance(n, from)
          },
        },
      })
      this.lastSelected = to
      let steps = []
      const newSteps = path.map((step) => [parseInt(step.from.data.id), parseInt(step.to.data.id)])
      if (this.state.path.steps.length > 0) {
        let newTo = newSteps.map((step) => step[1])
        let oldTo = [this.state.path.steps[0][0]].concat(this.state.path.steps.map((step) => step[1]))
        let newList = []
        for (let i = 0; i < oldTo.length && newList.length === 0; i++) {
          const pos = newTo.indexOf(oldTo[i])
          if (pos > -1) {
            newTo = newTo.slice(pos)
            newList = oldTo.slice(0, i).concat(newTo)
          }
          if (newList.length > 0) {
            steps = []
            for (let i = 0; i < newList.length - 1; i++) {
              steps.push([newList[i], newList[i + 1]])
            }
          }
        }
      }
      if (steps.length === 0) steps = this.state.path.steps.concat(newSteps)
      this.setState({ path: { circle: { radius: 10 }, steps } })
    }
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
    const scale = (2 * this.state.windowWidth) / this.originalImgWidth
    return {
      width: 155 * scale,
      heigth: 251 * scale,
    }
  }

  resetMove = () => {
    this.lastSelected = null
    this.setState({ path: { steps: [] } })
  }

  confirmMove = () => {
    this.props.moves.move(this.lastSelected)
    this.resetMove()
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

  showPopup = () => {
    swal('Confirm move?', {
      buttons: {
        cancel: 'Cancel',
        clear: { text: 'Clear', value: 'clear' },
        confirm: { text: 'Confirm', value: 'confirm' },
      },
    }).then((value) => {
      value === 'confirm' && this.confirmMove()
      value === 'clear' && this.resetMove()
    })
  }

  renderPlayers() {}

  render() {
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
          strokeColor="#c49a2d"
          lineWidth={5}
          path={this.state.path}
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
              ...this.getPlayerPosition(this.MAP.areas[player.positionOnMap]),
              ...this.getCharacterSize(),
            }}
          />
        ))}
      </div>
    )
  }
}
