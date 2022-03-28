import express, { NextFunction, Response, Request } from "express";
import createHttpError from "http-errors";
import ChatModel from "./schema";



const chatRouter = express.Router()

chatRouter
    .post('/', async (req: Request, res: Response, next: NextFunction) => {
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
                })

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

    .get('/', async (req: Request, res: Response, next: NextFunction) => {
        try {

            let sender = req.user?._id
            sender = "6241a2a6eec212f2949a9be1"
            const senderChats = await ChatModel.find({
                'members': sender,
            })
            res.send(senderChats)


        } catch (error) {
            next(error)
        }

    })

    .get('/:chatId', async (req: Request, res: Response, next: NextFunction) => {
        try {

            let sender = req.user?._id
            sender = "6241a2a6eec212f2949a9be1"
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
