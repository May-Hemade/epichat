import express from "express";
import createHttpError from "http-errors";
import { UserModel } from "../users/model";
import { authenticateUser } from "../auth/GenerateToken";
import { authMiddleware } from "../auth/AuthMiddleware";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { IRequest } from "../../types"


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
  

usersRouter.post("/register", async (req:Request, res: Response, next: NextFunction) => {
  try {
    const newUser = new UserModel(req.body)
    const { _id } = await newUser.save()
    res.send({ _id })
  } catch (error) {
    next(error)
  }
});





usersRouter.post("/login", async (req:Request, res: Response, next: NextFunction) => {

  try {
    // 1. Get credentials from req.body
    const { email, password } = req.body

    // 2. Verify credentials
  const user = await checkCredentials(email, password)

    if (user) {
      // 3. If credentials are fine we are going to generate an access token
      const accessToken = await authenticateUser(user)
      res.send(accessToken)
    } else {
      // 4. If they are not --> error (401)
      next(createHttpError(401, "Credentials not ok!"))
    }
  } catch (error) {
    next(error)
  }
});


usersRouter.get("/me", authMiddleware, async (req:Request, res:Response, next:NextFunction) => {
  try {
    const request = req as IRequest

    if(request.user){
      const user = await UserModel.findById(request.user._id)
      res.send(user)
    }
    
  } catch (error) {
    next(error)
  }
}
);

usersRouter.put("/me", authMiddleware, async (req:Request, res:Response, next:NextFunction) => {
    try {
      const request = req as IRequest
      const user = await UserModel.findByIdAndUpdate(request.user._id, req.body, {new:true})
      if(user){
        res.send(user)
      }
    } catch (error) {
      next(error)
    }
})

// usersRouter.get("/googleLogin",passport.authenticate("google", { scope: ["email", "profile"] })) 

// usersRouter.get(
//   "/googleRedirect",
//   passport.authenticate("google"),
//   async (req, res, next) => {
//     try {
//       console.log("TOKENS: ", req.user.token)
      
//       res.redirect(
//         `${process.env.FE_URL}?accessToken=${req.user.token.accessToken}&refreshToken=${req.user.token.refreshToken}`
//       )
//     } catch (error) {
//       next(error)
//     }
//   }
// )




export default usersRouter;