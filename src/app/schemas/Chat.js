import mongoose from 'mongoose'

const ChatSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    user_color: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    live_id: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

export default mongoose.model('Chat', ChatSchema)