import path from 'path'

class ChatController {
  async start(req, res, next) {
    res.sendFile(path.resolve(__dirname, '..', '..', 'index.html'))
  }
}

export default new ChatController()
