import mongoose from "mongoose"
const { Schema, model } = mongoose;
import { ChatMessage } from "../../types";

const chatMessageSchema = new Schema<ChatMessage>(
    {
        sender: { type: String, required: true },
        timestamp: { type: Number, default: (new Date()).getTime() },
        content: {
            text: { type: String },
            media: { type: String },
        }
    },
    {
        timestamps: true,
    }
)

const ChatMessageModel = model("ChatMessage", chatMessageSchema)

export default ChatMessageModel;