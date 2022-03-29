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
exports.verifyJWTToken = exports.authenticateUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = yield generateJWTToken({ _id: user._id });
    return accessToken;
});
exports.authenticateUser = authenticateUser;
const generateJWTToken = (user) => new Promise((resolve, reject) => jsonwebtoken_1.default.sign(user, process.env.JWT_SECRET, { expiresIn: "1 week" }, (err, token) => {
    if (err || !token)
        reject(err);
    else
        resolve(token);
}));
const verifyJWTToken = (token) => new Promise((res, rej) => jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err)
        rej(err);
    else
        res(user);
}));
exports.verifyJWTToken = verifyJWTToken;
