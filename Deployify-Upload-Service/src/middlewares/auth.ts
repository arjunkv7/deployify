import { StopIngestionRequest } from "aws-sdk/clients/appfabric";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface CustomRequest extends Request {
  user?: JwtPayload; // Add the user property with JwtPayload type
}

interface JwtPayload {
  firstName: string;
  lastName: string;
  emailId: string;
  id: number;
}

export default async function validateUser(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  let token: string | undefined = req.headers.token as string;

  if (!token) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
  try {
    let userDetails = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.user = userDetails;
    // console.log(req.user);
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      message: "Invalid token",
    });
  }
}
