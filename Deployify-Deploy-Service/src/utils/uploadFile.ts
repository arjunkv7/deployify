import { getAllFiles } from "./getAllFiles";
import path from "path";
import fs from "fs";
import mime from "mime-types";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: "auto",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
  },
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
});

export default async function uploadFile(
  localFilePath: string,
  remotePath: string
) {
  if (fs.lstatSync(localFilePath).isDirectory()) return;
  let fileContent = fs.readFileSync(localFilePath);
  const fullS3Key = remotePath.replace(/\\/g, "/"); // Replace backslashes with forward slashes

  // Remove leading path separator if present
  const sanitizedS3Key = fullS3Key.replace(/^\/+/g, "");
  try {
    const command = new PutObjectCommand({
      Bucket: "deployify",
      Key: sanitizedS3Key,
      Body: fileContent,
      ContentType: mime.lookup(localFilePath) || "",
    });
    const response = await s3.send(command);
    console.log("File uploaded: ", remotePath);
  } catch (error) {
    console.log("Error:", error);
  }
}
