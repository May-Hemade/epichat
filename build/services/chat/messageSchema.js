"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema, model } = mongoose_1.default;
const chatMessageSchema = new Schema({
    sender: { type: String, required: true },
    timestamp: { type: Number, default: (new Date()).getTime() },
    content: {
        text: { type: String },
        media: { type: String },
    }
}, {
    timestamps: true,
});
const ChatMessageModel = model("ChatMessage", chatMessageSchema);
exports.default = ChatMessageModel;
