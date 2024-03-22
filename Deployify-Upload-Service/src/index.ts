import express from "express";
import * as dotenv from "dotenv";
import path from "path";
import cors from "cors";

dotenv.config({ path: path.join(__dirname, "../.env") });

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import uploadRouter from "./router/upload";
app.use("/api/v1/deploy", uploadRouter);

import userRouter from "./router/user";
app.use("/api/v1/user", userRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server started on port: ", PORT);
});
