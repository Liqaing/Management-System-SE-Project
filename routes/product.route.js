import { Router } from "express";
import {
    createProduct,
    getAllProduct,
    getProductImage,
} from "../controllers/product.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { validateProductCreate } from "../middlewares/validators/product.validator.js";
import upload from "../config/multer.config.js";
import { validateParamId } from "../middlewares/validators/others.validator.js";

const productRouter = Router();

productRouter.get("/", getAllProduct);
productRouter.post(
    "/",
    verifyToken,
    upload.array("userImage", 5),
    validateProductCreate,
    createProduct
);

productRouter.get("/image/:id", validateParamId, getProductImage);

export { productRouter };
