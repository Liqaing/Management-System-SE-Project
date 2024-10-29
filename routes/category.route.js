import { Router } from "express";
import {
    createCategory,
    getAllCategory,
    updateCategory,
} from "../controllers/category.controller.js";
import { validateCategoryUpsert } from "../middlewares/validators/category.validator.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { validateParamId } from "../middlewares/validators/others.validator.js";

const categoryRouter = Router();

categoryRouter.get("/", getAllCategory);
categoryRouter.post("/", verifyToken, validateCategoryUpsert, createCategory);
categoryRouter.put("/:id", verifyToken, validateParamId, updateCategory);

export { categoryRouter };
