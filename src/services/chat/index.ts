import express, { NextFunction, Response, Request } from "express";
import createHttpError from "http-errors";
import { authMiddleware } from "../auth/AuthMiddleware";
import ChatModel from "./schema";

const chatRouter = express.Router()

chatRouter
    .post('/', authMiddleware, async (req, res, next) => {
        try {
            const recipient: string = req.body.recipient
            let sender = req.user?._id

            //temporary id
            sender = "6241a17deec212f2949a9bde"

            if (sender) {
                if (!recipient) {
                    next(createHttpError(400, "please send recipient"))
                }

                let chat = await ChatModel.findOne({
                    'members': {
                        $all: [
                            sender,
                            recipient
                        ]
                    }
                }).select("-messages")

                if (chat) {
                    res.send(chat)
                } else {
                    const itChat = new ChatModel({
                        members: [sender, recipient]
                    })
                    console.log(itChat)
                    const newChat = await itChat.save()
                    if (newChat) {
                        res.status(201).send(newChat)
                    } else {
                        res.status(400).send({ message: "something bad happened!" })
                    }

                }
            }

        } catch (error) {
            next(error)

        }
    })

    .get('/', authMiddleware, async (req, res, next) => {
        try {

            let sender = req.user?._id

            const senderChats = await ChatModel.find({
                'members': sender,
            }).select("-messages")
            res.send(senderChats)


        } catch (error) {
            next(error)
        }

    })

    .get('/:chatId', authMiddleware, async (req, res, next) => {
        try {

            let sender = req.user?._id

            const chatId = req.params.chatId


            const chat = await ChatModel.findOne({

                _id: chatId,
                'members': sender,
            })
            if (chat) {
                res.send(chat)
            } else {
                next(
                    createHttpError(
                        404,
                        `chat with id ${chatId} not found!`
                    )
                );
            }




        } catch (error) {
            next(error)
        }

    })




export default chatRouter
