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
exports.uploadFolder = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const uploadFile_1 = __importDefault(require("./uploadFile"));
function uploadFolder(distFolderPath, remotePath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const distFolderContents = fs_1.default.readdirSync(distFolderPath);
            for (const file of distFolderContents) {
                const key = path_1.default.join(remotePath, file.toString());
                const filePath = path_1.default.join(distFolderPath, file.toString());
                if (fs_1.default.lstatSync(filePath).isDirectory()) {
                    yield uploadFolder(filePath, key);
                }
                else {
                    console.log("uploading", filePath);
                    yield (0, uploadFile_1.default)(filePath, key);
                }
            }
        }
        catch (error) {
            console.log("Error :", error);
        }
    });
}
exports.uploadFolder = uploadFolder;
