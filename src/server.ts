import LegendOfAndor from './game'
// @ts-ignore
import { Server } from 'boardgame.io/server'
import path from 'path'
import serve from 'koa-static'

const PORT = parseInt(process.env.PORT ?? '8000')
const server = Server({ games: [LegendOfAndor] })

const root = path.resolve(__dirname, '../build')
server.app.use(serve(root))

server.run(PORT, () => {
  // @ts-ignore
  server.app.use(async (ctx, next) => await serve(root)(Object.assign(ctx, { path: 'index.html' }), next))
})
