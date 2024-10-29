import { Router } from "express";
import {
    createCategory,
    getAllCategory,
} from "../controllers/category.controller.js";
import { validateCategoryCreate } from "../middlewares/validators/category.validator.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const categoryRouter = Router();

categoryRouter.get("/", getAllCategory);
categoryRouter.post("/", verifyToken, validateCategoryCreate, createCategory);

export { categoryRouter };
