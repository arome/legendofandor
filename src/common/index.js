import LOA from '../game'

const hostname = window.location.hostname
const PORT = process.env.PORT || 8000
export const server = hostname === 'localhost' ? `http://${hostname}:${PORT}` : `https://${hostname}`
export const name = LOA.name
