import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { createOrder, getAllOrder } from "../controllers/order.controller.js";
import { validateOrderInSert } from "../middlewares/validators/order.validator.js";

const orderRouter = Router();

orderRouter.get("/", verifyToken, getAllOrder);
orderRouter.post("/", verifyToken, validateOrderInSert, createOrder);

export { orderRouter };
