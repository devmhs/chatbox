import { Router } from 'express'

import ChatController from './app/controllers/ChatController'

import auth from './app/middlewares/auth'

export const routes = new Router()

routes.get('/', auth, ChatController.start)

export default routes
