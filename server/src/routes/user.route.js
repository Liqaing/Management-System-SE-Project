import { Router } from "express";
import { createUser } from "../controllers/user.controller.js";

const userRouter = Router();

// Create user
userRouter.post('/', createUser)

export default userRouter;