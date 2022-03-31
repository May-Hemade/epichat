import express from 'express'
import mongoose from 'mongoose'
import listEndpoints from 'express-list-endpoints'
import cors from "cors"
import passport from "passport";
import usersRouter from './services/users'
import googleStrategy, { gitHubStrategy } from './services/auth/oauth';
import chatRouter from './services/chat';

import { createServer } from "http";
import { Server } from "socket.io";
import { verifyJWTToken } from './services/auth/GenerateToken';
import { ChatMessage, OnlineUser, SocketChatMessage } from './types';
import ChatMessageModel from './services/chat/messageSchema';
import { genericErrorHandler } from './errorHandlers';
import ChatModel from './services/chat/schema';



const server = express()
const port = process.env.PORT || 3001
process.env.TS_NODE_DEV && require("dotenv").config()

passport.use("google", googleStrategy)
passport.use("github", gitHubStrategy)
server.use(express.json());
server.use(cors())
server.use(passport.initialize())

server.use('/users', usersRouter)
server.use('/chat', chatRouter)

const httpServer = createServer(server);
const io = new Server(httpServer, { /* options */ });


let onlineUsers: OnlineUser[] = []

// created an api to return  all  online users
server.get('/online-users', (req, res) => {
  res.send({ onlineUsers })
})

const allUserRoom = "lobby"



io.use((socket, next) => {
  next()
})


// when a client connects to th socket 
io.on("connection", async (socket) => {
  let token = socket.handshake.query.token
  if (!token) {
    socket.emit("error", { message: "need token" })
    return
  }


  const user = await verifyJWTToken(token as string)
  const userId = user._id
  const socketId = socket.id
  const onlineUser: OnlineUser = { userId, socketId }
  onlineUsers.push(onlineUser)

  socket.join(allUserRoom)

  // for the user to know he is logged in 
  socket.emit("loggedin")

  // for all online users to know there is a new connection 
  socket.broadcast.emit("new-connection")

  // this should only be reached if the user already created a chat in the database else their should be a post to create a chat and than we can reach this point.
  socket.on("outgoing-msg", async (message: SocketChatMessage) => {

    try {
      console.log(message)

      const chatMessage = new ChatMessageModel({
        sender: message.sender,
        content: message.content,
      });
      const chatMessageDocument = await chatMessage.save();
      if (chatMessageDocument) {
        const updatedChat = await ChatModel.findByIdAndUpdate(message.chatId, { $push: { messages: chatMessageDocument._id } })
        if (updatedChat) {
          //check if recipient is online
          let recipient = onlineUsers.find(user => user.userId === message.recipientId)

          if (recipient) {
            socket.to(recipient.socketId).emit("incoming-msg", message)
          }
        }

      }
    } catch (error) {
      console.log(error)

    }

  })

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id)
    socket.broadcast.emit("disconnectedUser")
  })

  // using the user id, you may want to keep an array of online users....
  // onlineUsers.push({ userId: decodedToken._id, socket: socket })
  // ...
});


if (!process.env.MONGO_CONNECTION) {
  throw Error("Url is undefined!")
}
mongoose.connect(process.env.MONGO_CONNECTION)

mongoose.connection.on("connected", () => {
  console.log("Successfully connected to Mongo!")
  httpServer.listen(port, () => {
    console.table(listEndpoints(server))
    console.log("Server runnning on port: ", 3001)
  })
})