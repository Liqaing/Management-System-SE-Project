import { Router } from "express";
import {
    createCategory,
    deleteCategory,
    getAllCategory,
    getOneCategory,
    updateCategory,
} from "../controllers/category.controller.js";
import { validateCategoryUpsert } from "../middlewares/validators/category.validator.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { validateParamId } from "../middlewares/validators/others.validator.js";
import { validateCategoryQueryParams } from "../middlewares/validators/category.validator.js";

const categoryRouter = Router();

categoryRouter.get("/", validateCategoryQueryParams, getAllCategory);
categoryRouter.get(
    "/:id",
    validateParamId,
    validateCategoryQueryParams,
    getOneCategory
);
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
