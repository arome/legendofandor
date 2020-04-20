import LegendOfAndor from './src/game'
import { Server } from 'boardgame.io/server'
import path from 'path'
import Koa from 'koa'
import serve from 'koa-static'
import mount from 'koa-mount'
import Router from 'koa-router'
import koaBody from 'koa-body'
import cors from '@koa/cors'

const PORT = process.env.PORT || 8000
const server = Server({ games: [LegendOfAndor] })

const FRONTEND_APP_BUILD_PATH = path.resolve(__dirname, './build')
const static_pages = new Koa()
static_pages.use(serve(FRONTEND_APP_BUILD_PATH)) //serve the build directory
server.app.use(mount('/', static_pages)) //serve the build directory

const router = new Router()
router.post('/games/:name/:id/setHero', koaBody(), async (ctx) => {
  console.log("I'm here!", ctx.request.body)
  const gameID = ctx.params.id
  const playerID = ctx.request.body.playerID
  const credentials = ctx.request.body.credentials
  const newHero = ctx.request.body.newHero
  const { metadata } = await server.db.fetch(gameID, {
    metadata: true,
  })
  if (typeof playerID === 'undefined') {
    ctx.throw(403, 'playerID is required')
  }
  if (!newHero) {
    ctx.throw(403, 'newHero is required')
  }
  if (!metadata) {
    ctx.throw(404, 'Game ' + gameID + ' not found')
  }
  if (!metadata.players[playerID]) {
    ctx.throw(404, 'Player ' + playerID + ' not found')
  }
  if (credentials !== metadata.players[playerID].credentials) {
    ctx.throw(403, 'Invalid credentials ' + credentials)
  }

  metadata.players[playerID].hero = newHero
  await server.db.setMetadata(gameID, metadata)
  ctx.body = {}
})

router.get('/games/:name/:id/moreData', async (ctx) => {
  const gameID = ctx.params.id
  const { metadata } = await server.db.fetch(gameID, {
    metadata: true,
  })
  if (!metadata) {
    ctx.throw(404, 'Room ' + gameID + ' not found')
  }
  const strippedRoom = {
    roomID: gameID,
    players: Object.values(metadata.players).map((player) => {
      return { id: player.id, name: player.name, hero: player.hero }
    }),
    setupData: metadata.setupData,
  }
  ctx.body = strippedRoom
})

server.app.use(cors())
server.app.use(router.routes()).use(router.allowedMethods())
server.run(PORT, () => {
  server.app.use(
    async (ctx, next) => await serve(FRONTEND_APP_BUILD_PATH)(Object.assign(ctx, { path: 'index.html' }), next)
  )
})
