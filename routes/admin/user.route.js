import { Router } from "express";
import {
    createUser,
    getUserImage,
} from "../../controllers/admin/user.controller.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";
import { validateUserCreate } from "../../middlewares/validators/user.validator.js";
import { validateParamId } from "../../middlewares/validators/others.validator.js";

const userRouter = Router();

// Create user
userRouter.post("/", verifyToken, validateUserCreate, createUser);
userRouter.get("/image/:id", verifyToken, validateParamId, getUserImage);

export { userRouter };
