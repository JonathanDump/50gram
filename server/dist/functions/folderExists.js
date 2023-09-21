"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
function folderExists(folderName) {
    return (req, res, next) => {
        fs_extra_1.default.ensureDir(folderName, (err) => {
            if (err) {
                return res.status(500).json({ error: "Failed to create folder" });
            }
            next();
        });
    };
}
exports.default = folderExists;
