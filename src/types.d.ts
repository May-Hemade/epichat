interface IPayload {
    _id: string
}
interface Request {
    _id: string
}

interface Error {
    status: number,
    message: string,
    errorsList: string
}

interface IRequest extends Request {
    headers: any
    user: User
}





export interface UserProfile {
    googleUserId: string;
    emails: string | null;
    emailVerified?: boolean | null;
    familyName: string | null;
    givenName: string | null;
    name: string | null;
    gSuiteDomain: string | null;
    language: string | null;
    avatarUrl: string | null;
}

// May's Chat Interface
export interface Chat {
    _id: string,
    members: User[],
    messages: ChatMessage[]
}

export interface IUser {
  _id: string;
  username?: string;
  email?: string;
  info?: string ;
  avatar?: string;
  password: string;
  googleId?: string;
  githubId?: string;
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
        // override User in express
        interface User {
            _id: string,
            token?: string
        }
    }
}
// namespace Express {
//     interface Request {
//         user?: IUser
//         _id: string
//     }
// }