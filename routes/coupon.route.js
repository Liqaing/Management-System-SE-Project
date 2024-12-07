import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { getAllCoupon } from "../controllers/coupon.controller.js";
import { validateCouponUpsert } from "../middlewares/validators/coupon.validator.js";

const couponRouter = Router();
couponRouter.get("/", verifyToken, getAllCoupon);
couponRouter.post("/", verifyToken, validateCouponUpsert);

export { couponRouter, verifyToken };
