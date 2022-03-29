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
const AuthMiddleware_1 = require("../auth/AuthMiddleware");
const schema_1 = __importDefault(require("./schema"));
const chatRouter = express_1.default.Router();
chatRouter
    .post('/', AuthMiddleware_1.authMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const recipient = req.body.recipient;
        let sender = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        //temporary id
        sender = "6241a17deec212f2949a9bde";
        if (sender) {
            if (!recipient) {
                next((0, http_errors_1.default)(400, "please send recipient"));
            }
            let chat = yield schema_1.default.findOne({
                'members': {
                    $all: [
                        sender,
                        recipient
                    ]
                }
            }).select("-messages");
            if (chat) {
                res.send(chat);
            }
            else {
                const itChat = new schema_1.default({
                    members: [sender, recipient]
                });
                console.log(itChat);
                const newChat = yield itChat.save();
                if (newChat) {
                    res.status(201).send(newChat);
                }
                else {
                    res.status(400).send({ message: "something bad happened!" });
                }
            }
        }
    }
    catch (error) {
        next(error);
    }
}))
    .get('/', AuthMiddleware_1.authMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        let sender = (_b = req.user) === null || _b === void 0 ? void 0 : _b._id;
        sender = "6241a2a6eec212f2949a9be1";
        const senderChats = yield schema_1.default.find({
            'members': sender,
        }).select("-messages");
        res.send(senderChats);
    }
    catch (error) {
        next(error);
    }
}))
    .get('/:chatId', AuthMiddleware_1.authMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        let sender = (_c = req.user) === null || _c === void 0 ? void 0 : _c._id;
        sender = "6241a2a6eec212f2949a9be1";
        const chatId = req.params.chatId;
        const chat = yield schema_1.default.findOne({
            _id: chatId,
            'members': sender,
        });
        if (chat) {
            res.send(chat);
        }
        else {
            next((0, http_errors_1.default)(404, `chat with id ${chatId} not found!`));
        }
    }
    catch (error) {
        next(error);
    }
}));
exports.default = chatRouter;
