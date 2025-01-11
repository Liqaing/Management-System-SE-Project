import expressAsyncHandler from "express-async-handler";
import {
    dbCreateCoupon,
    dbDeleteCoupon,
    dbFindAllCoupon,
    dbFindCouponByCode,
    dbFindCouponById,
    dbUpdateCoupon,
} from "../db/coupon.queries.js";
import { CouponStatus, ROLES } from "../utils/constants.js";

const getAllCoupon = expressAsyncHandler(async (req, res) => {
    const coupons = await dbFindAllCoupon();

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
        status,
        effectiveDate,
        expireDate,
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

    if (!(Object.values(CouponStatus).indexOf(status) > -1)) {
        return res.status(422).json({
            success: false,
            error: {
                message: "Invalid coupon status",
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

    const newCoupon = await dbCreateCoupon({
        couponCode,
        DiscountPercentage,
        status,
        effectiveDate,
        expireDate,
        limitUsange,
        createBy: req.authData.username,
        createById: req.authData.userId,
    });

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
        status,
        effectiveDate,
        expireDate,
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

    if (!(Object.values(CouponStatus).indexOf(status) > -1)) {
        return res.status(422).json({
            success: false,
            error: {
                message: "Invalid coupon status",
            },
        });
    }

    if (!(await dbFindCouponById(id))) {
        return res.status(404).json({
            success: false,
            error: {
                message: "The coupon is not exist, Please input a valid coupon",
            },
        });
    }

    const existCoupon = await dbFindCouponByCode(couponCode);
    if (existCoupon && existCoupon.id !== id) {
        return res.status(409).json({
            success: false,
            error: {
                message:
                    "The coupon code is already exist, Please input another coupon",
            },
        });
    }

    const coupon = await dbUpdateCoupon({
        id,
        couponCode,
        DiscountPercentage,
        status,
        effectiveDate,
        expireDate,
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
