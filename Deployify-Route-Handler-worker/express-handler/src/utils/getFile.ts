import path from "path";
import fs from "fs";
import {
  PutObjectCommand,
  GetObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { Response } from "express";

const s3 = new S3Client({
  region: "auto",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
  },
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
});

export default async function getFile(remotePath: string, res: Response) {
  try {
    let command = new GetObjectCommand({
      Bucket: "deployify",
      Key: remotePath,
    });
    let file = await s3.send(command);
    // console.log(file.Body)
    // console.log("sending file")
    // return res.send(file);
    return file;
  } catch (error) {
    console.log("Error: ", error);
  }
}
