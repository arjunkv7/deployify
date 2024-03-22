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
const zod_1 = __importDefault(require("zod"));
const client_1 = require("@prisma/client");
const password_1 = __importDefault(require("../utils/password"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = __importDefault(require("../middlewares/auth"));
const prisma = new client_1.PrismaClient();
let signupPayload = zod_1.default.object({
    firstName: zod_1.default.string(),
    lastName: zod_1.default.string(),
    emailId: zod_1.default.string(),
    password: zod_1.default.string(),
});
let loginPayload = zod_1.default.object({
    emailId: zod_1.default.string(),
    password: zod_1.default.string(),
});
let router = express_1.default.Router();
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    ``;
    let data = req.body;
    let validatePayload = signupPayload.safeParse(data);
    if (!validatePayload.success)
        return res.status(401).json({ message: "Invalid payload." });
    try {
        let emailExists = yield prisma.user.findFirst({
            where: {
                emailId: req.body.emailId,
            },
        });
        if (emailExists) {
            return res
                .status(401)
                .json({ message: "This email is already registered" });
        }
        data.password = yield password_1.default.hash(data.password);
        let user = yield prisma.user.create({
            data: {
                firstName: data.firstName,
                lastName: data.lastName,
                emailId: data.emailId,
                password: data.password,
            },
        });
        let JWT_SECRET = process.env.JWT_SECRET || "";
        let token = jsonwebtoken_1.default.sign({
            firstName: user.firstName,
            lastName: user.lastName,
            emaildId: user.emailId,
            id: user.id,
        }, JWT_SECRET);
        res.status(200).json({
            message: "Signup successfull",
            token: token,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}));
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let data = req.body;
    let validatePayload = loginPayload.safeParse(data);
    if (!validatePayload.success) {
        return res.status(404).json({
            message: "Invalid payload",
        });
    }
    try {
        let userDetails = yield prisma.user.findUnique({
            where: {
                emailId: data.emailId,
            },
        });
        if (!userDetails) {
            return res.status(401).json({ message: "Invalid email id" });
        }
        let validatePassword = yield password_1.default.compare(data.password, userDetails.password);
        if (!validatePassword) {
            return res.status(401).json({
                message: "Invalid password",
            });
        }
        let JWT_SECRET = process.env.JWT_SECRET || "";
        let token = jsonwebtoken_1.default.sign({
            firstName: userDetails.firstName,
            lastName: userDetails.lastName,
            emaildId: userDetails.emailId,
            id: userDetails.id,
        }, JWT_SECRET);
        res.status(200).json({
            message: "Login successfull",
            token,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong.",
        });
    }
}));
router.get("/deployments", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        let deployments = yield prisma.websiteKey.findMany({
            where: {
                userId: userId,
            },
            orderBy: {
                id: "desc",
            },
        });
        res.status(200).json({
            data: deployments,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong",
        });
    }
}));
exports.default = router;
