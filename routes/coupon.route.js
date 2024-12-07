import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { getAllCoupon } from "../controllers/coupon.controller.js";

const couponRouter = Router();
couponRouter.get("/", verifyToken, getAllCoupon);

export { couponRouter };
