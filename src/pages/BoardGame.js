import { Client } from 'boardgame.io/react'
import LegendOfAndor from './game'
import Board from './Board'

export default Client({
  game: LegendOfAndor,
  board: Board,
})
