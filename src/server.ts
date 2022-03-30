import express from 'express'
import mongoose from 'mongoose'
import listEndpoints from 'express-list-endpoints'
import cors from "cors"
import passport from "passport";
import usersRouter from './services/users'
import googleStrategy, {gitHubStrategy } from './services/auth/oauth';
import chatRouter from './services/chat';

import { createServer } from "http";
import { Server } from "socket.io";



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

io.use((socket, next) => {
  console.log(socket.handshake.auth)
  next()
})

io.on("connection", (socket) => {
  console.log(socket.handshake.auth) // jwt.verify(using your JWT secret) => this will return the user ID

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