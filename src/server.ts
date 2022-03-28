
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


const server = express()

const port = process.env.PORT || 3002
// passport.use("google", googleStrategy)

/************************************** Middleware **************************/
server.use(cors());
server.use(express.json());
server.use(passport.initialize())


/************************************** Enpoints **************************/




server.use(express.json())





export { server }