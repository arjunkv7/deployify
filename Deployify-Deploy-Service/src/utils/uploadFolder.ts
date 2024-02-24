import fs from "fs";
import path from "path";
import uploadFile from "./uploadFile";

export async function uploadFolder(distFolderPath: string, remotePath: string) {
  try {
    const distFolderContents = fs.readdirSync(distFolderPath);

    for (const file of distFolderContents) {
      const key = path.join(remotePath, file.toString());
      const filePath = path.join(distFolderPath, file.toString());
      if (fs.lstatSync(filePath).isDirectory()) {
        await uploadFolder(filePath, key);
      } else {
        console.log("uploading", filePath);
        await uploadFile(filePath, key);
      }
    }
  } catch (error) {
    console.log("Error :", error);
  }
}
