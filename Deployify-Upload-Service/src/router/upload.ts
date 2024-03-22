import { Router, Request, Response } from "express";
import { generateId } from "../utils/generateId";
import path, { parse } from "path";
import zod from "zod";
import ioRedis from "ioredis";
import { createId } from "../utils/uuid";
import prisma from "../db/prisma";
import validateUser, { CustomRequest } from "../middlewares/auth";

let reqPayloadSchema = zod.object({
  repositoryUrl: zod.string(),
  projectName: zod.string(),
});

let publisher = new ioRedis(process.env.REDIS_URL!);

let router = Router();

router.post("/", validateUser, async (req: CustomRequest, res: Response) => {
  try {
    let parsedPaylod = reqPayloadSchema.safeParse(req.body);
    if (!parsedPaylod.success) {
      return res.status(401).json({
        message: "Invalid payload",
      });
    }

    let repositoryUrl: string = req.body.repositoryUrl;
    if (!repositoryUrl) {
      return res.status(401).json({
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
    let objectPath = `outputs/${uniqueId}/`;
    let defaultPath = `outputs/${uniqueId}/index.html`;

    await prisma.websiteKey.create({
      data: {
        uniqueId: uniqueId,
        key: uuid,
        objectPath: objectPath,
        defaultPath: defaultPath,
        status: "Queued",
        userId: req.user?.id,
        projectName: req.body.projectName,
      },
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

router.get("/", validateUser, async (req: CustomRequest, res: Response) => {
  let id = req.query?.id as string | undefined;
  try {
    let status = await prisma.websiteKey.findUnique({
      where: {
        uniqueId: id,
        userId: req.user?.id,
      },
      select: {
        status: true,
      },
    });

    res.status(200).json({ status });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

export default router;
