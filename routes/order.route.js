import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
    createCounterOrder,
    getAllOrder,
} from "../controllers/order.controller.js";
import { validateOrderInSert } from "../middlewares/validators/order.validator.js";

const orderRouter = Router();

orderRouter.get("/", verifyToken, getAllOrder);
orderRouter.post(
    "/counter",
    verifyToken,
    validateOrderInSert,
    createCounterOrder
);

export { orderRouter };
