import React, { useState } from 'react'
import { Modal } from 'semantic-ui-react'
import { RiCoinLine } from 'react-icons/ri'
import { IoMdWine } from 'react-icons/io'
import './ResourceSplit.scss'
import { Button } from 'semantic-ui-react'

export default (props) => {
  return (
    <Modal size="mini" open={props.open} closeOnDimmerClick={false} closeIcon={false}>
      <Modal.Header>Ressource Splitter</Modal.Header>
      <Modal.Content>
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
        <Button onClick={() => props.splitResource()}>Split Resources</Button>
      </Modal.Content>
    </Modal>
  )
}
