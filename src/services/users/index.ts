import express from "express";
import createHttpError from "http-errors";
import User from "./schema";
import { authenticateUser } from "../auth/GenerateToken";
import { authMiddleware } from "../auth/AuthMiddleware";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { IRequest } from "../../types";
import passport from "passport";
import { cloudinary, parser } from "../utils/Cloudinary";


const usersRouter = express.Router();

usersRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await User.find();
      res.send(users);
    } catch (error) {
      next(error);
    }
  }
);
usersRouter.get('/search',  async (req: any, res: Response, next: NextFunction) => {
  try {
      const users = await User.find({ _id: { $ne: req.payload?._id } }).sort({ username: 'asc' })
      res.send(users)
  } catch (error) {
      next(error)
  }
})
usersRouter.get(
  "/id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await User.findById(req.params.id);
      res.send(users);
    } catch (error) {
      next(error);
    }
  });
  

usersRouter.post(
  "/register",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newUser = new User(req.body);
      const { _id } = await newUser.save();
      res.send({ _id });
    } catch (error) {
      next(error);
    }
  }
);

usersRouter.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 1. Get credentials from req.body
      const { email, password } = req.body;

      // 2. Verify credentials
      const user = await User.checkCredentials(email, password);

      if (user) {
        // 3. If credentials are fine we are going to generate an access token
        const accessToken = await authenticateUser(user);
        res.send({accessToken});
      } else {
        // 4. If they are not --> error (401)
        next(createHttpError(401, "Credentials not ok!"));
      }
    } catch (error) {
      next(error);
    }
  }
);

usersRouter.post("/me/avatar",  parser.single('userAvatar'),  async (req:Request, res: Response, next: NextFunction) => {
  try {
  res.json(req.file)
  
  } catch (error) {
    next(error)
  }
});

usersRouter.put(
  "/me",
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const request = req as unknown as IRequest;
      const user = await User.findByIdAndUpdate(request.user._id, req.body, {
        new: true,
      });
      if (user) {
        res.send(user);
      }
    } catch (error) {
      next(error);
    }
  }
);

usersRouter.get(
  "/googleLogin",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

usersRouter.get(
  "/googleRedirect",
  passport.authenticate("google"),
  async (req, res, next) => {
    try {
      const request = req as unknown as IRequest;
      console.log("TOKENS: ", request.user.token);

      res.redirect(
        `${process.env.FE_URL}?accessToken=${request.user.token.accessToken}&refreshToken=${request.user.token.refreshToken}`
      );
    } catch (error) {
      next(error);
    }
  }
);

export default usersRouter;
