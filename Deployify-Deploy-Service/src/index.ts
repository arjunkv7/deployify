import fs from "fs";
import { exec } from "child_process";
import * as dotenv from "dotenv";
import ioRedis from "ioredis";
import path from "path";
dotenv.config({ path: path.join(__dirname, "../.env") });
import cloneRepo from "./utils/cloneRepo";
import uploadFile from "./utils/uploadFile";
import { deleteFolder } from "./utils/deleteFolder";
import { uploadFolder } from "./utils/uploadFolder";
import updateStatus from "./utils/updateStatus";

interface queueObj {
  uniqueId: string;
  repositoryUrl: string;
}
let subscriber = new ioRedis(process.env.REDIS_URL!);

async function buildProcess() {
  while (1) {
    let res = await subscriber.rpop("build-queue");
    if (!res) continue;
    let resObj: queueObj = JSON.parse(res);

    console.log("Clone started...");
    await cloneRepo(resObj.uniqueId, resObj.repositoryUrl);
    console.log("Clone end...");

    console.log("Build started...");
    let outDirPath = path.join(__dirname, `output/${resObj.uniqueId}`);
    console.log(outDirPath)
    const child = exec(`cd '${outDirPath}' && npm install && npm run build`);

    child.stdout?.on("data", function (data) {
      console.log(data.toString());
    });

    child.stdout?.on("error", function (data) {
      console.log("Error", data.toString());
    });

    child.stdout?.on("close", async function () {
      console.log("Build completed...");

      const distFolderPath = path.join(
        __dirname,
        "output",
        resObj.uniqueId,
        "build"
      );

      let remotePath = `outputs/${resObj.uniqueId}`;
      await uploadFolder(distFolderPath, remotePath);
      deleteFolder(path.join(__dirname, "output", resObj.uniqueId));
      updateStatus(resObj.uniqueId);
     

      console.log("Done...");
    });
  }
}
console.log("Build server started....");
buildProcess();