import { Router } from "express";
import {
    createUser,
    getAllUser,
    getOneUser,
    getUserImage,
} from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { validateUserCreate } from "../middlewares/validators/user.validator.js";
import { validateParamId } from "../middlewares/validators/others.validator.js";
import upload from "../config/multer.config.js";

const userRouter = Router();

// Create user
userRouter.get("/", verifyToken, getAllUser);
userRouter.get("/:id", verifyToken, validateParamId, getOneUser);
userRouter.post(
    "/",
    verifyToken,
    upload.single("userImage"),
    validateUserCreate,
    createUser
);
userRouter.get("/image/:id", verifyToken, validateParamId, getUserImage);

export { userRouter };
