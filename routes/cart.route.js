import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { addCart, removeCart } from "../controllers/cart.controller.js";

const cartRouter = Router();

cartRouter.get("/", verifyToken);
cartRouter.post("/add", verifyToken, addCart);
cartRouter.post("/remove", verifyToken, removeCart);

export { cartRouter };
