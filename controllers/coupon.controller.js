import expressAsyncHandler from "express-async-handler";
import { dbFindAllCoupon } from "../db/coupon.queries.js";

const getAllCoupon = expressAsyncHandler(async (req, res) => {
    const coupons = await dbFindAllCoupon();

    return res.status(200).json({
        success: true,
        data: {
            value: [...coupons],
        },
    });
});

const createCoupon = expressAsyncHandler(async (req, res) => {
    
})

export { getAllCoupon };
