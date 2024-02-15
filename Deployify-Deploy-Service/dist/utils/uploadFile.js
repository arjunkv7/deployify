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
const fs_1 = __importDefault(require("fs"));
const mime_types_1 = __importDefault(require("mime-types"));
const client_s3_1 = require("@aws-sdk/client-s3");
const s3 = new client_s3_1.S3Client({
    region: "auto",
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
    },
    endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
});
function uploadFile(localFilePath, remotePath) {
    return __awaiter(this, void 0, void 0, function* () {
        if (fs_1.default.lstatSync(localFilePath).isDirectory())
            return;
        let fileContent = fs_1.default.readFileSync(localFilePath);
        const fullS3Key = remotePath.replace(/\\/g, "/"); // Replace backslashes with forward slashes
        // Remove leading path separator if present
        const sanitizedS3Key = fullS3Key.replace(/^\/+/g, "");
        try {
            const command = new client_s3_1.PutObjectCommand({
                Bucket: "deployify",
                Key: sanitizedS3Key,
                Body: fileContent,
                ContentType: mime_types_1.default.lookup(localFilePath) || "",
            });
            const response = yield s3.send(command);
            console.log("File uploaded: ", remotePath);
        }
        catch (error) {
            console.log("Error:", error);
        }
    });
}
exports.default = uploadFile;
