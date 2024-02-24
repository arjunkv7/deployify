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
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const fs_1 = __importDefault(require("fs"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, "../.env") });
const db_1 = require("./config/db");
const getFile_1 = __importDefault(require("./utils/getFile"));
db_1.dbClient
    .connect()
    .then(() => {
    console.log("Database connected successfully");
})
    .catch((e) => {
    console.log("Error connecting to database", e);
    process.exit();
});
let app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.get("/*", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    let hostname = req.hostname;
    let endPoint = req.url;
    const subdomain = hostname.split(".")[0];
    console.log("requrl", endPoint);
    let webSiteDetails = yield db_1.dbClient.query(`SELECT * FROM "websiteKey" WHERE LOWER("uniqueId") = $1`, [subdomain]);
    console.log("data fetched");
    let filePath;
    if (endPoint == "/") {
        filePath = (_a = webSiteDetails.rows[0]) === null || _a === void 0 ? void 0 : _a.defaultPath;
    }
    else {
        endPoint = endPoint.slice(1);
        filePath = `${(_b = webSiteDetails.rows[0]) === null || _b === void 0 ? void 0 : _b.objectPath}${endPoint}`;
    }
    console.log(filePath);
    let file = yield (0, getFile_1.default)(filePath, res);
    const type = filePath.endsWith("html")
        ? "text/html"
        : filePath.endsWith("css")
            ? "text/css"
            : "application/javascript";
    console.log("beofre sending the paylaod");
    // console.log(file)
    res.setHeader("Content-Type", type);
    if (!file) {
        res.setHeader("Content-Type", 'text/html');
        let notFoundFile = fs_1.default.readFileSync(path_1.default.join(__dirname, '../public/notfound.html'));
        res.send(notFoundFile);
    }
    res.send(yield ((_c = file === null || file === void 0 ? void 0 : file.Body) === null || _c === void 0 ? void 0 : _c.transformToString()));
}));
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Server is running on port : ", port);
});
