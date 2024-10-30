import { Router } from "express";
import {
    createCategory,
    deleteCategory,
    getAllCategory,
    updateCategory,
} from "../controllers/category.controller.js";
import { validateCategoryUpsert } from "../middlewares/validators/category.validator.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { validateParamId } from "../middlewares/validators/others.validator.js";

const categoryRouter = Router();

categoryRouter.get("/", getAllCategory);
categoryRouter.post("/", verifyToken, validateCategoryUpsert, createCategory);
categoryRouter.put(
    "/:id",
    verifyToken,
    validateParamId,
    validateCategoryUpsert,
    updateCategory
);
categoryRouter.delete("/:id", verifyToken, validateParamId, deleteCategory);

export { categoryRouter };
