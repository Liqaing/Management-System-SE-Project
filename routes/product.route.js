import { Router } from "express";
import {
    createProduct,
    deleteProduct,
    getAllProduct,
    getOneProduct,
    getProductImage,
    updateProduct,
} from "../controllers/product.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
    validateProductUpSert,
    validateProductQueryParams,
} from "../middlewares/validators/product.validator.js";
import upload from "../config/multer.config.js";
import { validateParamId } from "../middlewares/validators/others.validator.js";

const productRouter = Router();

productRouter.get("/", validateProductQueryParams, getAllProduct);
productRouter.get(
    "/:id",
    validateParamId,
    validateProductQueryParams,
    getOneProduct
);
productRouter.post(
    "/",
    verifyToken,
    upload.array("productImages", 8),
    validateProductUpSert,
    createProduct
);
productRouter.put(
    "/:id",
    verifyToken,
    upload.array("productImages", 8),
    validateParamId,
    validateProductUpSert,
    updateProduct
);
productRouter.delete("/:id", verifyToken, validateParamId, deleteProduct);
productRouter.get("/image/:id", validateParamId, getProductImage);

export { productRouter };
