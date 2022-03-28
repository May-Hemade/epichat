import mongoose from "mongoose";
import {UserSchema} from '../users/schema'
import {Model, Types } from "mongoose"
import { IUser } from "../types/IUser";

const { model } = mongoose;


interface UserModel extends Model<IUser> {
    checkCredentials(): any;
  }
export const UserModel = model("User", UserSchema)