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
const uuid_1 = require("../utils/uuid");
const prisma_1 = __importDefault(require("../db/prisma"));
const auth_1 = __importDefault(require("../middlewares/auth"));
let reqPayloadSchema = zod_1.default.object({
    repositoryUrl: zod_1.default.string(),
    projectName: zod_1.default.string(),
});
let publisher = new ioredis_1.default(process.env.REDIS_URL);
let router = (0, express_1.Router)();
router.post("/", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let parsedPaylod = reqPayloadSchema.safeParse(req.body);
        if (!parsedPaylod.success) {
            return res.status(401).json({
                message: "Invalid payload",
            });
        }
        let repositoryUrl = req.body.repositoryUrl;
        if (!repositoryUrl) {
            return res.status(401).json({
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
        let uuid = yield (0, uuid_1.createId)();
        let objectPath = `outputs/${uniqueId}/`;
        let defaultPath = `outputs/${uniqueId}/index.html`;
        yield prisma_1.default.websiteKey.create({
            data: {
                uniqueId: uniqueId,
                key: uuid,
                objectPath: objectPath,
                defaultPath: defaultPath,
                status: "Queued",
                userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
                projectName: req.body.projectName,
            },
        });
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
router.get("/", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    let id = (_b = req.query) === null || _b === void 0 ? void 0 : _b.id;
    try {
        let status = yield prisma_1.default.websiteKey.findUnique({
            where: {
                uniqueId: id,
                userId: (_c = req.user) === null || _c === void 0 ? void 0 : _c.id,
            },
            select: {
                status: true,
            },
        });
        res.status(200).json({ status });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}));
exports.default = router;
