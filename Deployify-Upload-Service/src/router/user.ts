import express from "express";
import z from "zod";
import { PrismaClient } from "@prisma/client";
import Password from "../utils/password";
import jwt from "jsonwebtoken";
import validateUser, { CustomRequest } from "../middlewares/auth";

const prisma = new PrismaClient();

let signupPayload = z.object({
  firstName: z.string(),
  lastName: z.string(),
  emailId: z.string(),
  password: z.string(),
});

let loginPayload = z.object({
  emailId: z.string(),
  password: z.string(),
});

let router = express.Router();

router.post("/signup", async (req, res) => {
  ``;
  let data = req.body;
  let validatePayload = signupPayload.safeParse(data);
  if (!validatePayload.success)
    return res.status(401).json({ message: "Invalid payload." });

  try {
    let emailExists = await prisma.user.findFirst({
      where: {
        emailId: req.body.emailId,
      },
    });
    if (emailExists) {
      return res
        .status(401)
        .json({ message: "This email is already registered" });
    }
    data.password = await Password.hash(data.password);
    let user = await prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        emailId: data.emailId,
        password: data.password,
      },
    });

    let JWT_SECRET: string = process.env.JWT_SECRET || "";
    let token = jwt.sign(
      {
        firstName: user.firstName,
        lastName: user.lastName,
        emaildId: user.emailId,
        id: user.id,
      },
      JWT_SECRET
    );
    res.status(200).json({
      message: "Signup successfull",
      token: token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.post("/login", async (req, res) => {
  let data = req.body;
  let validatePayload = loginPayload.safeParse(data);
  if (!validatePayload.success) {
    return res.status(404).json({
      message: "Invalid payload",
    });
  }
  try {
    let userDetails = await prisma.user.findUnique({
      where: {
        emailId: data.emailId,
      },
    });
    if (!userDetails) {
      return res.status(401).json({ message: "Invalid email id" });
    }

    let validatePassword = await Password.compare(
      data.password,
      userDetails.password
    );

    if (!validatePassword) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    let JWT_SECRET: string = process.env.JWT_SECRET || "";
    let token = jwt.sign(
      {
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
        emaildId: userDetails.emailId,
        id: userDetails.id,
      },
      JWT_SECRET
    );

    res.status(200).json({
      message: "Login successfull",
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong.",
    });
  }
});

router.get("/deployments", validateUser, async (req: CustomRequest, res) => {
  try {
    let userId = req.user?.id;
    let deployments = await prisma.websiteKey.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        id: "desc",
      },
    });

    res.status(200).json({
      data: deployments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

export default router;
