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
exports.AuthMiddleware = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const GenerateToken_1 = require("./GenerateToken");
const AuthMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.headers.authorization) {
            next((0, http_errors_1.default)(401, "Please provide Bearer token on headers!"));
        }
        else {
            const token = req.headers.authorization.replace("Bearer", "");
            const user = yield (0, GenerateToken_1.verifyJWTToken)(token);
            if (!user)
                return next((0, http_errors_1.default)(401, "Invalid Details"));
            req.user = {
                _id: user._id
            };
            next();
        }
    }
    catch (error) {
        next((0, http_errors_1.default)(401, "Token not valid!"));
    }
});
exports.AuthMiddleware = AuthMiddleware;
