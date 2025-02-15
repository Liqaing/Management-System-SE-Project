import Router from "express";
import {
    AuthUser,
    loginUser,
    logoutUser,
    signupUser,
} from "../controllers/auth.controller.js";
import {
    validateLogin,
    validateSingup,
} from "../middlewares/validators/auth.validator.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.post("/login", validateLogin, loginUser);
authRouter.post("/signup", validateSingup, signupUser);
authRouter.post("/logout", verifyToken, logoutUser);
authRouter.post("/token", AuthUser);

export { authRouter };
