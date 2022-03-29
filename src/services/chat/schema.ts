import mongoose from "mongoose"
const { Schema, model } = mongoose;
import { Chat } from "../../types"

const chatSchema = new Schema<Chat>(
    {

        members: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],

        messages: [{
            type: Schema.Types.ObjectId,
            ref: 'ChatMessage'
        }]
    }
)

chatSchema.methods.toJSON = function () {
    console.log(this)
    const chatDocument = this
    const chatObject = chatDocument.toObject()

    delete chatObject.__v
    return chatObject
}

const ChatModel = model("Chat", chatSchema)

export default ChatModel;