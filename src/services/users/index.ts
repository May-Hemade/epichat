import express from "express";
import createHttpError from "http-errors";
import { UserModel } from "../users/model";
import { JWTAuthenticate } from "../auth/tool";
import { JWTAuthMiddleware } from "../auth/toke";
import bcrypt from "bcrypt"
import { Request, Response, NextFunction, RequestHandler } from "express";



const usersRouter = express.Router();

usersRouter.get("/",  async(req:Request, res: Response, next: NextFunction) => {
  try {
    const users = await UserModel.find();
    res.send(users);
  } catch (error) {
    next(error);
  }
});
usersRouter.get("/id",  async(req:Request, res: Response, next: NextFunction) => {
    try {
      const users = await UserModel.findById(req.params.id);
      res.send(users);
    } catch (error) {
      next(error);
    }
  });
  

usersRouter.post("/account", async (req:Request, res: Response, next: NextFunction) => {
  try {
    const newUser = new UserModel(req.body)
    const { _id } = await newUser.save()
    res.send({ _id })
  } catch (error) {
    next(error)
  }
});

const checkCredentials = async (email: string, password: string) => {
  const user = await UserModel.findOne({ email });
  if (user) {
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      return user;
    } else {
      return null;
    }
  } else {
    return null;
  }
}



usersRouter.post("/login", async (req:Request, res: Response, next: NextFunction) => {

  try {
    // 1. Get credentials from req.body
    const { email, password } = req.body

    // 2. Verify credentials
  const user = await checkCredentials(email, password)

    if (user) {
      // 3. If credentials are fine we are going to generate an access token
      const accessToken = await JWTAuthenticate(user)
      res.send(accessToken)
    } else {
      // 4. If they are not --> error (401)
      next(createHttpError(401, "Credentials not ok!"))
    }
  } catch (error) {
    next(error)
  }
});


usersRouter.get("/me", JWTAuthMiddleware, async (req:any, res: any, next: any) => {
  try {
    await req.user.save()
    res.send( req.user)
  } catch (error) {
    next(error)
  }
}
);

usersRouter.put("/me", JWTAuthMiddleware, async (req:any, res: any, next: any) => {
    try {
        req.author.name = "Ali"
      req.author.email = "ali@gmail.com"
      await req.author.save() 
      res.send()
    } catch (error) {
      next(error)
    }
})


export default usersRouter;