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
const express_1 = require("express");
const generateId_1 = require("../utils/generateId");
const zod_1 = __importDefault(require("zod"));
const ioredis_1 = __importDefault(require("ioredis"));
let reqPayloadSchema = zod_1.default.object({
    repositoryUrl: zod_1.default.string(),
});
let publisher = new ioredis_1.default(process.env.REDIS_URL);
let router = (0, express_1.Router)();
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let parsedPaylod = reqPayloadSchema.safeParse(req.body);
        if (!parsedPaylod.success) {
            return res.status(400).json({
                message: "Invalid repository URL",
            });
        }
        let repositoryUrl = req.body.repositoryUrl;
        if (!repositoryUrl) {
            return res.status(400).json({
                message: "Repository URL is required",
            });
        }
        let uniqueId = yield (0, generateId_1.generateId)();
        let queueObj = {
            uniqueId,
            repositoryUrl,
        };
        yield publisher.rpush("build-queue", JSON.stringify(queueObj));
        console.log(`${uniqueId} ${repositoryUrl} is added to the queue`);
        // let cloneId = await cloneRepo(repositoryUrl);
        // let files = getAllFiles(path.join(__dirname,`../output/${cloneId}`));
        // files.forEach(async file => {
        //     await uploadFile(file.slice(__dirname.length + 1), file);
        // })
        return res.status(200).json({
            id: uniqueId,
        });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({
            message: "Something wrong",
        });
    }
}));
exports.default = router;
