import passport from "passport"
import { Strategy } from "passport-google-oauth20"
import github from 'passport-github'

import User from "../users/schema"
import { authenticateUser } from "./GenerateToken"
process.env.TS_NODE_DEV && require("dotenv").config()
console.log(process.env.GOOGLE_ID);

const googleStrategy = new Strategy({
  clientID: process.env.GOOGLE_ID || "",
  clientSecret: process.env.GOOGLE_SECRET || "",
  callbackURL: `${process.env.API_URL}/user/googleRedirect`,
  passReqToCallback: true
},
  async function (request, accessToken, refresh, profile, done) {
    try {
      console.log(profile)

      if (profile.emails && profile.emails.length > 0) {
        const user = await User.findOne({ email: profile.emails[0] })

        if (user) {
          const token = await authenticateUser(user)
          done(null, { _id: user._id, token })
        } else {
          // 4. Else if the user is not in our db --> add the user to db and then create token(s) for him/her

          const newUser = new User({
            name: profile.name?.givenName,
            surname: profile.name?.familyName,
            email: profile.emails[0],
            googleId: profile.id,
          })

          const savedUser = await newUser.save()
          const token = await authenticateUser(savedUser)

          done(null, { _id: newUser._id, token })
        }
      }
    } catch (error: any) {
      done(error)
    }
  }
)



const callbackURL = process.env.CALLBACK_URL;
const clientID = process.env.GITHUB_CLIENT_ID;
const clientSecret = process.env.GITHUB_SECRET_KEY;

if (typeof callbackURL === "undefined") {
  throw new Error("callbackURL is undefined");
}

if (typeof clientID === "undefined") {
  throw new Error("clientID is undefined");
}

if (typeof clientSecret === "undefined") {
  throw new Error("clientSecret is undefined");
}

export const gitHubStrategy = new github({
  clientID,
  clientSecret,
  callbackURL: `${callbackURL}/authors/githubRedirect`
},
  async (accessToken: string, refreshToken: string, profile: github.Profile, passportNext) => {
    try {
      console.log("Github:", profile);
      const user = await User.findOne({ githubId: profile.id })
      if (user) {
        console.log("passport.initialize()")
        const token = await authenticateUser(user)
        passportNext(null, { _id: user._id, token }) // this is the express User
      } else {
        const newUser = new User({
          full_name: profile.displayName,
          githubId: profile.id,
        })

        // const savedUser = await newUser.save()
        const token = await authenticateUser(newUser)
        console.log(token);
        passportNext(null, { _id: newUser._id, token })
      }
    } catch (error) {
      console.log(error)
    }
  }

)

passport.serializeUser((data, done) => {
  done(null, data)
})

export default googleStrategy