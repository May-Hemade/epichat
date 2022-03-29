"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_list_endpoints_1 = __importDefault(require("express-list-endpoints"));
const cors_1 = __importDefault(require("cors"));
const passport_1 = __importDefault(require("passport"));
const users_1 = __importDefault(require("./services/users"));
const oauth_1 = __importDefault(require("./services/auth/oauth"));
const server = (0, express_1.default)();
const port = process.env.PORT || 3001;
process.env.TS_NODE_DEV && require("dotenv").config();
passport_1.default.use("google", oauth_1.default);
server.use(express_1.default.json());
server.use((0, cors_1.default)());
server.use(passport_1.default.initialize());
server.use('/users', users_1.default);
if (!process.env.MONGO_CONNECTION) {
    throw Error("Url is undefined!");
}
mongoose_1.default.connect(process.env.MONGO_CONNECTION);
mongoose_1.default.connection.on("connected", () => {
    console.log("Successfully connected to Mongo!");
    server.listen(3001, () => {
        console.table((0, express_list_endpoints_1.default)(server));
        console.log("Server runnning on port: ", 3001);
    });
});
