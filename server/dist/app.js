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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const cors = require("cors");
const mongoose = require("mongoose");
var logger = require("morgan");
require("./strategies/jwt");
const indexRouter = require("./routes/index");
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const socketHandlerUser_1 = __importDefault(require("./socket/socketHandlerUser"));
const socketHandlerChat_1 = __importDefault(require("./socket/socketHandlerChat"));
const envReader_1 = __importDefault(require("./functions/envReader"));
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: (0, envReader_1.default)("CORS_ORIGIN"),
    },
});
app.use(cors());
const port = process.env.PORT || 3000;
app.use(express_1.default.static("public"));
app.use("/avatars", express_1.default.static("avatars"));
mongoose.set("strictQuery", false);
const mongoDB = process.env.MONGO_DB_KEY;
main().catch((err) => console.log(err));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield mongoose.connect(mongoDB);
    });
}
app.use(logger("dev"));
app.use(express_1.default.json({ limit: "50mb" }));
app.use(express_1.default.urlencoded({ limit: "50mb" }));
app.use("/", indexRouter);
(0, socketHandlerUser_1.default)(io);
(0, socketHandlerChat_1.default)(io);
httpServer.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
