import fs from "fs";

export function deleteFolder(folderPath: string) {
  fs.rmdir(folderPath, { recursive: true }, (err) => {
    if (err) {
      console.error("Error deleting folder:", err);
      return;
    }
    console.log("Folder deleted successfully.");
  });
}
