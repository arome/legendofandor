import React from 'react'
import { Modal } from 'semantic-ui-react'
import { RiCoinLine } from 'react-icons/ri'
import { IoMdWine } from 'react-icons/io'
import './ResourceSplit.scss'
import { Button } from 'semantic-ui-react'
import { ResourceSplitProps } from '../models/Modal'

export default (props: ResourceSplitProps) => {
  let goldSelected = 0
  let wineskinSelected = 0
  for (const playerID in props.current) {
    const player = props.current[playerID]
    goldSelected += player.gold ?? 0
    wineskinSelected += player.wineskin ?? 0
  }
  const remainingGold = (props.total?.gold ?? 0) - goldSelected
  const remainingWineskin = (props.total?.wineskin ?? 0) - wineskinSelected
  return (
    <Modal size="mini" open={props.open} closeOnDimmerClick={false} closeIcon={false}>
      <Modal.Header>Ressource Splitter</Modal.Header>
      <Modal.Content>
        <div className="total-resource">
          {remainingGold > 0 && (
            <span>
              {remainingGold}
              <RiCoinLine />
            </span>
          )}
          {remainingWineskin > 0 && (
            <span>
              {remainingWineskin}
              <IoMdWine />
            </span>
          )}
        </div>

        {props.names.map((name, index) => {
          const player = (props.current && props.current[index]) ?? { gold: 0, wineskin: 0 }
          return (
            <div className="player-row" key={index}>
              <h3>{name}</h3>
              <div className="money">
                <RiCoinLine />
                <div className="button-group">
                  <button onClick={() => (player.gold ?? 0) > 0 && props.add('gold', -1, index)}>-</button>
                  <button onClick={() => remainingGold > 0 && props.add('gold', 1, index)}>+</button>
                </div>
                <span>{player.gold}</span>
              </div>
              <div>
                <IoMdWine />
                <div className="button-group">
                  <button onClick={() => (player.wineskin ?? 0) && props.add('wineskin', -1, index)}>-</button>
                  <button onClick={() => remainingWineskin > 0 && props.add('wineskin', 1, index)}>+</button>
                </div>
                <span>{player.wineskin}</span>
              </div>
            </div>
          )
        })}
        <Button
          onClick={() => {
            props.total?.gold === goldSelected && props.total?.wineskin === wineskinSelected && props.splitResource()
          }}
        >
          Split Resources
        </Button>
      </Modal.Content>
    </Modal>
  )
}
