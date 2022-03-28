import express from 'express'
import mongoose from 'mongoose'
import listEndpoints from 'express-list-endpoints'
const server = express()
const port = process.env.PORT || 3001
process.env.TS_NODE_DEV && require("dotenv").config()
server.use(express.json())




if(!process.env.MONGO_CONNECTION){
    throw Error("Url is undefined!")
  }
  mongoose.connect(process.env.MONGO_CONNECTION)
  
  mongoose.connection.on("connected", () => {
    console.log("Successfully connected to Mongo!")
    server.listen(3001, () => {
      console.table(listEndpoints(server))
      console.log("Server runnning on port: ", 3001)
    })
  })