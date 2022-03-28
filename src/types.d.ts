interface IPayload{
    _id:string
}
interface Request{
    user:User
}

declare namespace Express {
    export interface Request {
        user: any;
    }
    export interface Response {
        user: any;
    }
  }
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
    username?: string,
    email?: string,
    avatar?: string,
}

interface ChatMessage {
    _id: string,
    timestamp: number,
    sender: string,
    content: MessageContent,

}

interface MessageContent {
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