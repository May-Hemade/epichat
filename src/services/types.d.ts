import { Request } from "express"


export interface Error {
    status: number | string
    message:string,
    errorList:string
}
export interface Response {
    status: string | number
}

interface Error {
    status: number | string,
    message: string,
    errorsList:string
}

interface IPayload {
    _id:string,
}


interface IUser {
    username: string
    avatar: string,
    email: string,
    _id:string
}

interface IReqUser extends Request{
    headers: any
    user: ReqUser
}


interface ReqUser {
    _id:string,
}
