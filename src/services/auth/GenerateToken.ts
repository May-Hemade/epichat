import jwt from 'jsonwebtoken'

export const authenticateUser = async (user:User) => {
    const accessToken = await generateJWTToken({ _id: user._id})
    return accessToken
  }




  const generateJWTToken = (user:{_id:string}) =>
  new Promise((resolve, reject) =>
    jwt.sign(
      user,
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
    jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
      if (err) rej(err)
      else res(user as IPayload)
    })
  )
