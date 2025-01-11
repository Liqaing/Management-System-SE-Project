import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
    createCounterOrder,
    createOnlineOrder,
    getAllOrder,
} from "../controllers/order.controller.js";
import { validateOrderCounterInsert, validateOrderOnlineInsert } from "../middlewares/validators/order.validator.js";

const orderRouter = Router();

orderRouter.get("/", verifyToken, getAllOrder);
orderRouter.post(
    "/counter",
    verifyToken,
    validateOrderCounterInsert,
    createCounterOrder
);
orderRouter.post(
    "/online",
    verifyToken,
    validateOrderOnlineInsert,
    createOnlineOrder
);

export { orderRouter };
