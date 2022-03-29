"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gitHubStrategy = void 0;
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_github_1 = __importDefault(require("passport-github"));
const schema_1 = __importDefault(require("../users/schema"));
const GenerateToken_1 = require("./GenerateToken");
process.env.TS_NODE_DEV && require("dotenv").config();
console.log(process.env.GOOGLE_ID);
const googleStrategy = new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_ID || "",
    clientSecret: process.env.GOOGLE_SECRET || "",
    callbackURL: `${process.env.API_URL}/user/googleRedirect`,
    passReqToCallback: true
}, function (request, accessToken, refresh, profile, done) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log(profile);
            if (profile.emails && profile.emails.length > 0) {
                const user = yield schema_1.default.findOne({ email: profile.emails[0] });
                if (user) {
                    const token = yield (0, GenerateToken_1.authenticateUser)(user);
                    done(null, { _id: user._id, token });
                }
                else {
                    // 4. Else if the user is not in our db --> add the user to db and then create token(s) for him/her
                    const newUser = new schema_1.default({
                        name: (_a = profile.name) === null || _a === void 0 ? void 0 : _a.givenName,
                        surname: (_b = profile.name) === null || _b === void 0 ? void 0 : _b.familyName,
                        email: profile.emails[0],
                        googleId: profile.id,
                    });
                    const savedUser = yield newUser.save();
                    const token = yield (0, GenerateToken_1.authenticateUser)(savedUser);
                    done(null, { _id: newUser._id, token });
                }
            }
        }
        catch (error) {
            done(error);
        }
    });
});
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
exports.gitHubStrategy = new passport_github_1.default({
    clientID,
    clientSecret,
    callbackURL: `${callbackURL}/authors/githubRedirect`
}, (accessToken, refreshToken, profile, passportNext) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Github:", profile);
        const user = yield schema_1.default.findOne({ githubId: profile.id });
        if (user) {
            console.log("passport.initialize()");
            const token = yield (0, GenerateToken_1.authenticateUser)(user);
            passportNext(null, { _id: user._id, token }); // this is the express User
        }
        else {
            const newUser = new schema_1.default({
                full_name: profile.displayName,
                githubId: profile.id,
            });
            // const savedUser = await newUser.save()
            const token = yield (0, GenerateToken_1.authenticateUser)(newUser);
            console.log(token);
            passportNext(null, { _id: newUser._id, token });
        }
    }
    catch (error) {
        console.log(error);
    }
}));
passport_1.default.serializeUser((data, done) => {
    done(null, data);
});
exports.default = googleStrategy;
