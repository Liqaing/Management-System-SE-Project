import Router from "express";
import { loginUser, signupUser } from "../controllers/auth.controller.js";
import {
    validateLogin,
    validateSingup,
} from "../middlewares/validators/auth.validator.js";

const authRouter = Router();

authRouter.post("/login", validateLogin, loginUser);
authRouter.post("/signup", validateSingup, signupUser);

export { authRouter };
