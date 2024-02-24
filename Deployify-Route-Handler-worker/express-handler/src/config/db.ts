import { Client } from "pg";

export let dbClient = new Client(process.env.DB_URL);
