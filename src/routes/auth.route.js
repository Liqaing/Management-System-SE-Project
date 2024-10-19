import Router from "express";
import { loginUser, signupUser } from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/login", loginUser);
authRouter.post("/signup", signupUser);

export { authRouter };
