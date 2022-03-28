import jwt from 'jsonwebtoken'
import { IPayload, IUser } from "../types"

export const authenticateUser = async (user:IUser) => {
    const accessToken = await generateJWTToken({ _id: user._id})
    return accessToken
  }




  const generateJWTToken = (payload:{_id:string}) =>
  new Promise((resolve, reject) =>
    jwt.sign(
      payload,
      process.env.JWT_SECRET!,
      { expiresIn: "1 week" },
      (err, token) => {
        if (err) reject(err)
        else resolve(token)
      }
    )
  )

export const verifyJWTToken = (token:string): Promise<IPayload> =>
  new Promise((res, rej) =>
    jwt.verify(token, process.env.JWT_SECRET!, (err, payload) => {
      if (err) rej(err)
      else res(payload as IPayload)
    })
  )
