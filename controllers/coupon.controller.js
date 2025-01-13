import expressAsyncHandler from "express-async-handler";
import {
    dbCreateCoupon,
    dbDeleteCoupon,
    dbFindAllCoupon,
    dbFindCouponByCode,
    dbFindCouponById,
    dbUpdateCoupon,
} from "../db/coupon.queries.js";
import { CouponStatus, CouponType, ROLES } from "../utils/constants.js";
import stripe from "../config/stipe.config.js";

const getAllCoupon = expressAsyncHandler(async (req, res) => {
    const coupons = await dbFindAllCoupon({}, { id: "desc" });

    return res.status(200).json({
        success: true,
        data: {
            value: [...coupons],
        },
    });
});

const getOneCoupon = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    const coupon = await dbFindCouponById(id);

    if (!coupon) {
        return res.status(404).json({
            success: false,
            error: {
                message: "The coupon does not exist",
            },
        });
    }

    return res.status(200).json({
        success: true,
        data: coupon,
    });
});

const createCoupon = expressAsyncHandler(async (req, res) => {
    const {
        couponCode,
        DiscountPercentage,
        effectiveDate,
        expireDate,
        limitUsange,
        couponType,
    } = req.body;

    if (req.authData.role != ROLES.adminRole) {
        return res.status(403).json({
            success: false,
            error: {
                message: "Unauthorize operation",
            },
        });
    }

    if (couponType !== CouponType.online && couponType !== CouponType.counter) {
        return res.status(422).json({
            success: false,
            error: {
                message: "Counter type need to be either Counter or Online",
            },
        });
    }

    if (limitUsange < 0) {
        return res.status(409).json({
            success: false,
            error: {
                message: "Limit usange must not be negative",
            },
        });
    }

    if (DiscountPercentage < 0 || DiscountPercentage > 100) {
        return res.status(409).json({
            success: false,
            error: {
                message: "Discount percentage must be between 0 and 100",
            },
        });
    }

    const coupon = await dbFindCouponByCode(couponCode);
    if (coupon) {
        return res.status(404).json({
            success: false,
            error: {
                message:
                    "The coupon code is already exist, Please input another coupon",
            },
        });
    }

    // Create coupon in stripe
    if (couponType === CouponType.online) {
        await stripe.coupons.create({
            id: couponCode,
            percent_off: DiscountPercentage,
            duration: "once",
            max_redemptions: limitUsange,
            redeem_by: expireDate
                ? Math.floor(new Date(expireDate).getTime() / 1000)
                : null,
        });
    }

    // In my database
    const newCoupon = await dbCreateCoupon({
        couponCode,
        DiscountPercentage,
        status: CouponStatus.active,
        effectiveDate,
        couponType,
        expireDate,
        limitUsange,
        createBy: req.authData.username,
        createById: req.authData.userId,
    });

    console.log(newCoupon);

    return res.status(201).json({
        success: true,
        data: {
            message: `Coupon ${newCoupon.couponCode} has been successfully created`,
        },
    });
});

const deleteCoupon = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;

    if (req.authData.role != ROLES.adminRole) {
        return res.status(403).json({
            success: false,
            error: {
                message: "Unauthorize operation",
            },
        });
    }

    const existCoupon = await dbFindCouponById(id);
    if (!existCoupon) {
        return res.status(404).json({
            success: false,
            error: {
                message: "Coupon not found",
            },
        });
    }

    if (existCoupon.couponType === CouponType.online) {
        await stripe.coupons.del(existCoupon.couponCode);
    }
    const deleteCoupon = await dbDeleteCoupon(id);
    return res.status(200).json({
        success: true,
        data: {
            message: `Coupon ${deleteCoupon.couponCode} has been successfully deleted`,
        },
    });
});

const updateCoupon = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    const {
        couponCode,
        DiscountPercentage,
        effectiveDate,
        expireDate,
        couponType,
        limitUsange,
    } = req.body;

    if (req.authData.role != ROLES.adminRole) {
        return res.status(403).json({
            success: false,
            error: {
                message: "Unauthorize operation",
            },
        });
    }

    // if (!(Object.values(CouponStatus).indexOf(status) > -1)) {
    //     return res.status(422).json({
    //         success: false,
    //         error: {
    //             message: "Invalid coupon status",
    //         },
    //     });
    // }

    const existCoupon = await dbFindCouponById(id);
    if (!existCoupon) {
        return res.status(404).json({
            success: false,
            error: {
                message: "The coupon is not exist, Please input a valid coupon",
            },
        });
    }

    if (existCoupon.couponType !== couponType) {
        return res.status(409).json({
            success: false,
            error: {
                message: "You cannot change coupon type please create new",
            },
        });
    }

    if (existCoupon && existCoupon.id !== id) {
        return res.status(409).json({
            success: false,
            error: {
                message:
                    "The coupon code is already exist, Please input another coupon",
            },
        });
    }

    if (couponType === CouponType.online) {
        await stripe.coupons.update(existCoupon.couponCode, {
            id: couponCode,
            percent_off: DiscountPercentage,
            max_redemptions: limitUsange,
            redeem_by: expireDate
                ? Math.floor(new Date(expireDate).getTime() / 1000)
                : null,
        });
    }

    const coupon = await dbUpdateCoupon({
        id,
        couponCode,
        DiscountPercentage,
        status: CouponStatus.active,
        effectiveDate,
        expireDate,
        couponType,
        limitUsange,
        updateBy: req.authData.username,
        updateById: req.authData.userId,
    });

    return res.status(200).json({
        success: true,
        data: {
            message: `Coupon ${coupon.couponCode} has been successfully updated`,
        },
    });
});

export { getAllCoupon, getOneCoupon, createCoupon, deleteCoupon, updateCoupon };
