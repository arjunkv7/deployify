"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFolder = void 0;
const fs_1 = __importDefault(require("fs"));
function deleteFolder(folderPath) {
    fs_1.default.rm(folderPath, { recursive: true }, (err) => {
        if (err) {
            console.error("Error deleting folder:", err);
            return;
        }
        console.log("Folder deleted successfully.");
    });
}
exports.deleteFolder = deleteFolder;
