import express from "express"
import listEndpoints from "express-list-endpoints"
import cors from "cors"

import passport from "passport"
import {
    badRequestHandler,
    unauthorizedHandler,
    notFoundHandler,
    genericErrorHandler,
    forbiddenHandler,
    catchAllHandler,
} from "./errorHandlers.js"
import mongoose from "mongoose"
import chatRouter from "./services/chat/index"

const server = express()

const port = process.env.PORT || 3002
// passport.use("google", googleStrategy)

/************************************** Middleware **************************/
server.use(cors());
server.use(express.json());
server.use(passport.initialize())


/************************************** Enpoints **************************/
server.use(express.json())
server.use('/chat', chatRouter)

const mongoConnection = process.env.MONGO_CONNECTION
console.log(mongoConnection)
if (mongoConnection) {

    mongoose.connect(mongoConnection)
    mongoose.connection.on("connected", () => {
        console.log("Successfully connected to Mongo!")
        server.listen(port, () => {
            console.table(listEndpoints(server))
            console.log("Server runnning on port: ", port)
        })
    })
}



export { server }