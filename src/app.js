import 'dotenv/config'

import express from 'express'
import http from 'http'

import { setupSocket, messages } from './socket'

import routes from './routes'

import './database'

const app = express()

const server = http.createServer(app)

class App {
  constructor() {
    this.app = app
    this.server = server
    this.messages = messages

    this.middlewares()
    this.routes()
    this.io = this.socket()
  }

  middlewares() {
    this.app.use(express.json())
    this.app.use(express.static('public/'))
    this.app.use((req, res, next) => {
      req.io = this.io
      req.messages = this.messages
      next()
    })
  }

  socket() {
    const io = setupSocket(this.server)
    return io
  }

  routes() {
    this.app.use(routes)
  }
}

export default new App().server
