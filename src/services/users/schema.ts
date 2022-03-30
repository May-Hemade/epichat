import mongoose from 'mongoose'
import bcrypt from "bcrypt"
import { Model } from 'mongoose';
import {Document} from 'mongoose'
import { IUser } from '../../types';



interface UserModel extends Model<IUser> {
  checkCredentials(email:string, password:string):Promise<IUser |null>;
}
const { Schema, model } = mongoose

export const UserSchema = new Schema<IUser, UserModel>({
  username: { type: String},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: {type: String }
})

UserSchema.pre("save", async function (next) {
  
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
const User = model<IUser, UserModel>('User', UserSchema);

export default User
