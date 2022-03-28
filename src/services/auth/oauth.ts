// import passport from "passport"
// import { Strategy } from "passport-google-oauth20"
// import userSchema from "../services/users/schema.js"
// import { authenticateUser } from "./GenerateToken"

// const googleStrategy = new Strategy({
//   clientID: process.env.GOOGLE_ID || "",
//   clientSecret: process.env.GOOGLE_SECRET || "",
//   callbackURL: `${process.env.API_URL}/user/googleRedirect`,
//   passReqToCallback: true
// },
//   async function (request, accessToken, refresh, profile, done) {
//     try {
//       console.log(profile)

//       if (profile.emails && profile.emails.length > 0) {
//         const user = await userSchema.findOne({ email: profile.emails[0] })

//         if (user) {
//           const token = await authenticateUser(user)
//           done(null, { token, role: user.role })
//         } else {
//           // 4. Else if the user is not in our db --> add the user to db and then create token(s) for him/her

//           const newUser = new userSchema({
//             name: profile.name?.givenName,
//             surname: profile.name?.familyName,
//             email: profile.emails[0],
//             googleId: profile.id,
//           })

//           const savedUser = await newUser.save()
//           const token = await authenticateUser(savedUser)

//           done(null, { token })
//         }
//       }
//     } catch (error: any) {
//       done(error)
//     }
//   }
// )


// passport.serializeUser((data, done) => {
//   done(null, data)
// })
