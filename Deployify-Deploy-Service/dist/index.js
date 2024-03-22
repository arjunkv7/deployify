"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const child_process_1 = require("child_process");
const dotenv = __importStar(require("dotenv"));
const ioredis_1 = __importDefault(require("ioredis"));
const path_1 = __importDefault(require("path"));
dotenv.config({ path: path_1.default.join(__dirname, "../.env") });
const cloneRepo_1 = __importDefault(require("./utils/cloneRepo"));
const deleteFolder_1 = require("./utils/deleteFolder");
const uploadFolder_1 = require("./utils/uploadFolder");
const updateStatus_1 = __importDefault(require("./utils/updateStatus"));
let subscriber = new ioredis_1.default(process.env.REDIS_URL);
function buildProcess() {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        while (1) {
            let res = yield subscriber.rpop("build-queue");
            if (!res)
                continue;
            let resObj = JSON.parse(res);
            console.log("Clone started...");
            yield (0, cloneRepo_1.default)(resObj.uniqueId, resObj.repositoryUrl);
            console.log("Clone end...");
            console.log("Build started...");
            let outDirPath = path_1.default.join(__dirname, `output/${resObj.uniqueId}`);
            console.log(outDirPath);
            const child = (0, child_process_1.exec)(`cd '${outDirPath}' && npm install && npm run build`);
            (_a = child.stdout) === null || _a === void 0 ? void 0 : _a.on("data", function (data) {
                console.log(data.toString());
            });
            (_b = child.stdout) === null || _b === void 0 ? void 0 : _b.on("error", function (data) {
                console.log("Error", data.toString());
            });
            (_c = child.stdout) === null || _c === void 0 ? void 0 : _c.on("close", function () {
                return __awaiter(this, void 0, void 0, function* () {
                    console.log("Build completed...");
                    const distFolderPath = path_1.default.join(__dirname, "output", resObj.uniqueId, "build");
                    let remotePath = `outputs/${resObj.uniqueId}`;
                    yield (0, uploadFolder_1.uploadFolder)(distFolderPath, remotePath);
                    (0, deleteFolder_1.deleteFolder)(path_1.default.join(__dirname, "output", resObj.uniqueId));
                    (0, updateStatus_1.default)(resObj.uniqueId);
                    console.log("Done...");
                });
            });
        }
    });
}
console.log("Build server started....");
buildProcess();
