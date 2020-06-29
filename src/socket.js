import socketio from 'socket.io'
import Chat from './app/schemas/Chat'
import randomColor from './app/utils/randomColor'
import addslashes from './app/utils/addslashes'

const messages = []

const setupSocket = (server) => {
    const io = socketio(server)

    io.on('connection', async(socket) => {
        const { user_id, name, live_id } = socket.handshake.query
        let user_color = socket.handshake.query.user_color
        const savedMessages = await Chat.find().where({ live_id: live_id })

        const user_active = savedMessages.find(
            (message) => parseInt(message.user_id) === parseInt(user_id)
        )
        user_color = user_active ? user_active.user_color : randomColor()

        io.to(socket.id).emit('savedMessages', savedMessages)

        socket.on('chat message' + live_id, async({ user_id, message }) => {
            const mongoMessage = await Chat.create({
                name,
                user_id,
                message: addslashes(message),
                user_color,
                live_id
            })

            io.emit('chat message' + live_id, {
                _id: mongoMessage._id,
                name,
                user_id,
                message: addslashes(message),
                user_color
            })
        })
    })

    return io
}

export { messages, setupSocket }