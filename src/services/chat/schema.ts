import mongoose from "mongoose"
const { Schema, model } = mongoose;
import { Chat } from "../../types";

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

const ChatModel = model("Chat", chatSchema)

export default ChatModel;