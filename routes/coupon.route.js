import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
    createCoupon,
    deleteCoupon,
    getAllCoupon,
    getOneCoupon,
    updateCoupon,
} from "../controllers/coupon.controller.js";
import { validateCouponUpsert } from "../middlewares/validators/coupon.validator.js";
import { validateParamId } from "../middlewares/validators/others.validator.js";

const couponRouter = Router();
couponRouter.get("/", verifyToken, getAllCoupon);
couponRouter.get("/:id", verifyToken, validateParamId, getOneCoupon);
couponRouter.post("/", verifyToken, validateCouponUpsert, createCoupon);
couponRouter.delete("/:id", verifyToken, validateParamId, deleteCoupon);
couponRouter.put(
    "/:id",
    verifyToken,
    validateParamId,
    validateCouponUpsert,
    updateCoupon
);

export { couponRouter };
