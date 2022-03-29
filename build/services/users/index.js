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
const express_1 = __importDefault(require("express"));
const http_errors_1 = __importDefault(require("http-errors"));
const schema_1 = __importDefault(require("./schema"));
const GenerateToken_1 = require("../auth/GenerateToken");
const AuthMiddleware_1 = require("../auth/AuthMiddleware");
const passport_1 = __importDefault(require("passport"));
const Cloudinary_1 = require("../utils/Cloudinary");
const usersRouter = express_1.default.Router();
usersRouter.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield schema_1.default.find();
        res.send(users);
    }
    catch (error) {
        next(error);
    }
}));
usersRouter.get("/id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield schema_1.default.findById(req.params.id);
        res.send(users);
    }
    catch (error) {
        next(error);
    }
}));
usersRouter.post("/register", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newUser = new schema_1.default(req.body);
        const { _id } = yield newUser.save();
        res.send({ _id });
    }
    catch (error) {
        next(error);
    }
}));
usersRouter.post("/login", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 1. Get credentials from req.body
        const { email, password } = req.body;
        // 2. Verify credentials
        const user = yield schema_1.default.checkCredentials(email, password);
        if (user) {
            // 3. If credentials are fine we are going to generate an access token
            const accessToken = yield (0, GenerateToken_1.authenticateUser)(user);
            res.send({ accessToken });
        }
        else {
            // 4. If they are not --> error (401)
            next((0, http_errors_1.default)(401, "Credentials not ok!"));
        }
    }
    catch (error) {
        next(error);
    }
}));
usersRouter.post("/me/avatar", Cloudinary_1.parser.single('userAvatar'), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.json(req.file);
    }
    catch (error) {
        next(error);
    }
}));
usersRouter.put("/me", AuthMiddleware_1.authMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const request = req;
        const user = yield schema_1.default.findByIdAndUpdate(request.user._id, req.body, {
            new: true,
        });
        if (user) {
            res.send(user);
        }
    }
    catch (error) {
        next(error);
    }
}));
usersRouter.get("/googleLogin", passport_1.default.authenticate("google", { scope: ["email", "profile"] }));
usersRouter.get("/googleRedirect", passport_1.default.authenticate("google"), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const request = req;
        console.log("TOKENS: ", request.user.token);
        res.redirect(`${process.env.FE_URL}?accessToken=${request.user.token.accessToken}&refreshToken=${request.user.token.refreshToken}`);
    }
    catch (error) {
        next(error);
    }
}));
exports.default = usersRouter;
