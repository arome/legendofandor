import React, { Component } from 'react'

import { Modal } from 'semantic-ui-react'
import Dices3d, { DICE_TYPES } from '../libs/react-dice-3d'
import './DiceWindow.scss'
import { heroColor } from '../common'

interface DiceWindowProps {
  rollingDices: number[]
  handleClose: any
  onFinishRoll: any
  open: boolean
  fight: any
  color: heroColor
}

class DicesWindow extends Component<DiceWindowProps> {
  componentDidUpdate(prevPros: DiceWindowProps) {
    if (this.props.open) {
      setTimeout(() => {
        this.props.handleClose()
        this.props.onFinishRoll()
      }, 3000)
    }
  }

  render() {
    const { rollingDices, open, fight } = this.props
    let color = 'player' in fight ? 'red' : this.props.color
    const dices =
      rollingDices &&
      rollingDices.map((die) => {
        return {
          type: DICE_TYPES.D6,
          backColor: color,
          fontColor: color === 'yellow' ? 'black' : 'white',
          value: die,
        }
      })
    return (
      <div className="dice-modal">
        <Modal basic open={open}>
          {/* Dice component is mounted again when dialog is open 
          cause of required dice init logic in componentDidMount */}
          {rollingDices && <Dices3d dices={dices} />}
        </Modal>
      </div>
    )
  }
}
export default DicesWindow
