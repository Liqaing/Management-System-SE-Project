import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
    addCart,
    getCart,
    removeCart,
} from "../controllers/cart.controller.js";
import {
    validateCartAdd,
    validateCartRemove,
} from "../middlewares/validators/cart.validator.js";

const cartRouter = Router();

cartRouter.get("/", verifyToken, getCart);
cartRouter.post("/add", verifyToken, validateCartAdd, addCart);
cartRouter.post("/remove", verifyToken, validateCartRemove, removeCart);

export { cartRouter };
