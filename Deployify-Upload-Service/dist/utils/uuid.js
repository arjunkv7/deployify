"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createId = void 0;
const { v4: uuidv4 } = require("uuid");
function createId() {
    return uuidv4();
}
exports.createId = createId;
