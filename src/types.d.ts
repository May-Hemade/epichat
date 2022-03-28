import { Request } from 'express'

interface Error {
    status: number,
    message: string,
    errorsList: string
}