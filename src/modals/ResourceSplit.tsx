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
  for (const playerID in props.tempSplit) {
    const player = props.tempSplit[playerID]
    goldSelected += player.gold ?? 0
    wineskinSelected += player.wineskin ?? 0
  }
  const remainingGold = (props.resources.gold ?? 0) - goldSelected
  const remainingWineskin = (props.resources.wineskin ?? 0) - wineskinSelected
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
          return (
            <div className="player-row" key={index}>
              <h3>{name}</h3>
              <div className="money">
                <RiCoinLine />
                <div className="button-group">
                  <button onClick={() => props.add('gold', -1, index)}>-</button>
                  <button onClick={() => props.add('gold', 1, index)}>+</button>
                </div>
                <span>{props.tempSplit[index]?.gold}</span>
              </div>
              <div>
                <IoMdWine />
                <div className="button-group">
                  <button onClick={() => props.add('wineskin', -1, index)}>-</button>
                  <button onClick={() => props.add('wineskin', 1, index)}>+</button>
                </div>
                <span>{props.tempSplit[index]?.wineskin}</span>
              </div>
            </div>
          )
        })}
        <Button
          onClick={() => {
            if (props.resources.gold === goldSelected && props.resources.wineskin === wineskinSelected)
              props.splitResource()
          }}
        >
          Split Resources
        </Button>
      </Modal.Content>
    </Modal>
  )
}
