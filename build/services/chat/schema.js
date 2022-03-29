"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema, model } = mongoose_1.default;
const chatSchema = new Schema({
    members: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
    messages: [{
            type: Schema.Types.ObjectId,
            ref: 'ChatMessage'
        }]
});
chatSchema.methods.toJSON = function () {
    console.log(this);
    const chatDocument = this;
    const chatObject = chatDocument.toObject();
    delete chatObject.__v;
    return chatObject;
};
const ChatModel = model("Chat", chatSchema);
exports.default = ChatModel;
