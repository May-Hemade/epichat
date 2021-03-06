import express from 'express'
import mongoose from 'mongoose'
import listEndpoints from 'express-list-endpoints'
import cors from "cors"
import passport from "passport";
import usersRouter from './services/users'
import googleStrategy from './services/auth/oauth';
import chatRouter from './services/chat';

const server = express()
const port = process.env.PORT || 3001
process.env.TS_NODE_DEV && require("dotenv").config()

passport.use("google", googleStrategy)
server.use(express.json());
server.use(cors())
server.use(passport.initialize())

server.use('/users', usersRouter)
server.use('/chat', chatRouter)

if (!process.env.MONGO_CONNECTION) {
  throw Error("Url is undefined!")
}
mongoose.connect(process.env.MONGO_CONNECTION)

mongoose.connection.on("connected", () => {
  console.log("Successfully connected to Mongo!")
  server.listen(port, () => {
    console.table(listEndpoints(server))
    console.log("Server runnning on port: ", 3001)
  })
})
