import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
    createCoupon,
    getAllCoupon,
} from "../controllers/coupon.controller.js";
import { validateCouponUpsert } from "../middlewares/validators/coupon.validator.js";

const couponRouter = Router();
couponRouter.get("/", verifyToken, getAllCoupon);
couponRouter.post("/", verifyToken, validateCouponUpsert, createCoupon);

export { couponRouter, verifyToken };
