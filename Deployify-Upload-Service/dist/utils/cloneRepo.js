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
const simple_git_1 = __importDefault(require("simple-git"));
const generateId_1 = require("../utils/generateId");
const path_1 = __importDefault(require("path"));
function cloneRepo(repoUrl) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        if (!repoUrl || repoUrl == '')
            return reject();
        let uniqueId = yield (0, generateId_1.generateId)();
        let git = (0, simple_git_1.default)();
        let localpath = path_1.default.join(__dirname, `../output/${uniqueId}`);
        try {
            yield git.clone(repoUrl, localpath);
            console.log('Repo cloned successfully');
            return resolve(uniqueId);
        }
        catch (error) {
            console.log(error);
            return reject(error);
        }
    }));
}
exports.default = cloneRepo;
