import { Router, Request, Response } from "express";
import { generateId } from "../utils/generateId";
import path, { parse } from "path";
import zod from "zod";
import ioRedis from "ioredis";

let reqPayloadSchema = zod.object({
  repositoryUrl: zod.string(),
});

let publisher = new ioRedis(process.env.REDIS_URL!);

let router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    let parsedPaylod = reqPayloadSchema.safeParse(req.body);
    if (!parsedPaylod.success) {
      return res.status(400).json({
        message: "Invalid repository URL",
      });
    }

    let repositoryUrl: string = req.body.repositoryUrl;
    if (!repositoryUrl) {
      return res.status(400).json({
        message: "Repository URL is required",
      });
    }
    let uniqueId = await generateId();
    let queueObj = {
      uniqueId,
      repositoryUrl,
    };
    await publisher.rpush("build-queue", JSON.stringify(queueObj));
    console.log(`${uniqueId} ${repositoryUrl} is added to the queue`);
    // let cloneId = await cloneRepo(repositoryUrl);
    // let files = getAllFiles(path.join(__dirname,`../output/${cloneId}`));
    // files.forEach(async file => {
    //     await uploadFile(file.slice(__dirname.length + 1), file);
    // })

    return res.status(200).json({
      id: uniqueId,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Something wrong",
    });
  }
});

export default router;
