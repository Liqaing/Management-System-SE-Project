import { Router } from "express";
import {
    createProduct,
    getAllProduct,
} from "../controllers/product.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { validateProductCreate } from "../middlewares/validators/product.validator.js";
import upload from "../config/multer.config.js";

const productRouter = Router();

productRouter.get("/", getAllProduct);
productRouter.post(
    "/",
    verifyToken,
    upload.array("userImage", 10),
    validateProductCreate,
    createProduct
);
export { productRouter };
