import mongoose from 'mongoose'
import bcrypt from "bcrypt"
//import IUser from '../interfaces/Iuser'
import { Model } from 'mongoose';
import {Document} from 'mongoose'
import { IUser } from '../types/IUser';

interface UserDocument extends Document {
  _id: string,
  name: string | any,
  surname: string,
  email: string,
  password: string,
  role: string
}

interface UserModel extends Model<UserDocument> {
  checkCredentials(email:string, password:string):Promise<UserDocument |null>;
}
const { Schema, model } = mongoose

export const UserSchema = new Schema<IUser, UserModel>({
  name: { type: String, required: true},
  surname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
})

UserSchema.pre<UserDocument>("save", async function (next) {
  
  const newUser = this 
  const plainPw = newUser.password
  if (newUser.isModified("password")) {
    const hash = await bcrypt.hash(plainPw, 10)
    newUser.password = hash
  }
  next()
})

UserSchema.methods.toJSON = function () {
  const userDocument = this
  const userObject = userDocument.toObject()
  delete userObject.password
  delete userObject.__v

  return userObject
}


UserSchema.statics.checkCredentials = async function (email:string, plainPw:string):Promise<any> {
  const user = await this.findOne({ email }) 

  if (user) {
    const isMatch = await bcrypt.compare(plainPw, user.password)
    if (isMatch) {
      return user
    } else {
      return null
    }
  } else {
    return null 
  }
}