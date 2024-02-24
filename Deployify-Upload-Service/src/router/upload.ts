import { Router, Request, Response } from "express";
import { generateId } from "../utils/generateId";
import path, { parse } from "path";
import zod from "zod";
import ioRedis from "ioredis";
import { createId } from "../utils/uuid";
import prisma from "../db/prisma";

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

    let uuid = await createId();
    let objectPath = `outputs/${uniqueId}/`
    let defaultPath = `outputs/${uniqueId}/index.html`

    await prisma.websiteKey.create({
      data: {
        uniqueId: uniqueId,
        key: uuid,
        objectPath: objectPath,
        defaultPath: defaultPath,
        status: "Queued"
      }
    });

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
