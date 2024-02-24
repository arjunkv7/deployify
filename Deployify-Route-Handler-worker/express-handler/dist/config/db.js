"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbClient = void 0;
const pg_1 = require("pg");
exports.dbClient = new pg_1.Client(process.env.DB_URL);
