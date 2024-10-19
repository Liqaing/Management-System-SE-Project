import { Router } from "express";
import { createUser } from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const userRouter = Router();

// Create user
userRouter.post("/", verifyToken, createUser);

export { userRouter };
