import LegendOfAndor from './src/game'
import { Server } from 'boardgame.io/server'
import path from 'path'
import Koa from 'koa'
import serve from 'koa-static'
import mount from 'koa-mount'

const PORT = process.env.PORT || 8000
const server = Server({ games: [LegendOfAndor] })

const FRONTEND_APP_BUILD_PATH = path.resolve(__dirname, './build')
const static_pages = new Koa()
static_pages.use(serve(FRONTEND_APP_BUILD_PATH)) //serve the build directory
server.app.use(mount('/', static_pages)) //serve the build directory
server.run(PORT, () => {
  console.log(`Serving at: http://localhost:${PORT}/`)
  server.app.use(
    async (ctx, next) => await serve(FRONTEND_APP_BUILD_PATH)(Object.assign(ctx, { path: 'index.html' }), next)
  )
})
