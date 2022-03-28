import express from "express";
// import googleStrategy from "./services/auth/oauth";
import usersRouter from "./services/users/index"
import cors from "cors"
import passport from "passport";

const server = express();

process.env.TS_NODE_DEV && require("dotenv").config();
// server.use("google", googleStrategy)

server.use(express.json());
server.use(cors())
server.use(passport.initialize())


// Endpoints
server.use('/users', usersRouter)
export { server };