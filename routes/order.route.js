import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
    createCounterOrder,
    createOnlineOrder,
    getAllOrder,
    onlineOrderCancel,
} from "../controllers/order.controller.js";
import {
    validateOrderCounterInsert,
    validateOrderOnlineInsert,
    validateOrderStripeReturnUrl,
} from "../middlewares/validators/order.validator.js";
import { validateOrderPaymentStatus } from "../middlewares/order.middleware.js";

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
orderRouter.get(
    "/online/cancel",
    validateOrderStripeReturnUrl,
    onlineOrderCancel
);
orderRouter.get(
    "/online/success",
    validateOrderStripeReturnUrl,
    validateOrderPaymentStatus
);

export { orderRouter };
