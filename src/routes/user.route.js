import { Router } from "express";
import { createUser } from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { validateUserCreate } from "../middlewares/validators/user.validator.js";

const userRouter = Router();

// Create user
userRouter.post("/", verifyToken, validateUserCreate, createUser);

export { userRouter };
