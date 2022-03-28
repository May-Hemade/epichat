import { Request } from 'express'

interface Error {
    status: number,
    message: string,
    errorsList: string
}
interface Chat {

    _id: string,
    members: User[],
    messages: ChatMessage[]

}

interface User {
    _id: string,
    username: string,
    email: string,
    avatar: string,
}

interface ChatMessage {
    _id: string,
    timestamp: number,
    sender: string,
    content: MessageContent,

}
interface MessageContent {
    text: string,
    media: string,
}