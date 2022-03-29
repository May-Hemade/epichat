interface IPayload {
    _id: string
}
interface Request {
    _id:string
}

interface Error {
    status: number,
    message: string,
    errorsList: string
}

interface IRequest extends Request {
    headers:any
    user:User
}



// May's Chat Interface
export interface Chat {
    _id: string,
    members: User[],
    messages: ChatMessage[]
}

export interface User {
    _id: string,
    username?: string,
    email?: string,
    avatar?: string,
    password:string
}

export interface ChatMessage {
    _id: string,
    timestamp: number,
    sender: string,
    content: MessageContent,

}

export interface MessageContent {
    text?: string,
    media?: string,
}

declare global {
    namespace Express {
        interface User {
            _id: string
        }
    }
}
namespace Express {
    interface Request {
        user?: IUser
        _id: string
    }
}