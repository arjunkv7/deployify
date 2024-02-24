import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import fs from "fs";
dotenv.config({ path: path.join(__dirname, "../.env") });
import { dbClient } from "./config/db";
import getFile from "./utils/getFile";
dbClient
  .connect()
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((e) => {
    console.log("Error connecting to database", e);
    process.exit();
  });

let app = express();
app.use(cors());

app.get("/*", async (req, res) => {
  let hostname = req.hostname;
  let endPoint = req.url;
  const subdomain = hostname.split(".")[0];
  console.log("requrl", endPoint);

  let webSiteDetails = await dbClient.query(
    `SELECT * FROM "websiteKey" WHERE LOWER("uniqueId") = $1`,
    [subdomain]
  );
  console.log("data fetched");
  let filePath;
  if (endPoint == "/") {
    filePath = webSiteDetails.rows[0]?.defaultPath;
  } else {
    endPoint = endPoint.slice(1);
    filePath = `${webSiteDetails.rows[0]?.objectPath}${endPoint}`;
  }
  console.log(filePath);
  let file = await getFile(filePath, res);
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
    let notFoundFile = fs.readFileSync(path.join(__dirname,'../public/notfound.html'))
    res.send(notFoundFile);
  }
  res.send(await file?.Body?.transformToString());
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("Server is running on port : ", port);
});
