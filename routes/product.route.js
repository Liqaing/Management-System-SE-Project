import { Router } from "express";
import {
    createProduct,
    getAllProduct,
} from "../controllers/product.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { validateProductCreate } from "../middlewares/validators/product.validator.js";

const productRouter = Router();

productRouter.get("/", getAllProduct);
productRouter.post("/", verifyToken, validateProductCreate, createProduct);
export { productRouter };
