import { body } from "express-validator";
import { validatorHandler } from "../validator.middleware.js";

const validateCouponUpsert = [
    body("couponCode")
        .optional()
        .isLength({ min: 6, max: 6 })
        .withMessage("Coupon conde can only be 6 character long")
        .trim(),
    body("DiscountPercentage")
        .notEmpty()
        .isFloat({ min: 0 })
        .withMessage("Invalid, Please input a valid discount percentage")
        .toFloat(),
    body("status")
        .notEmpty()
        .withMessage("Coupon status cannot be empty")
        .trim(),
    body("effectiveDate")
        .notEmpty()
        .withMessage("Coupon effective date cannot be empty")
        .isISO8601()
        .toDate(),
    body("expireDate")
        .notEmpty()
        .withMessage("Coupon expire date date cannot be empty")
        .isISO8601()
        .toDate(),
    body("limitUsange")
        .notEmpty()
        .withMessage("Coupon limited usage cannot be empty")
        .trim()
        .isInt({ min: 0 })
        .withMessage("Coupon limited usage must be a positive number")
        .toInt(),
    validatorHandler,
];

export { validateCouponUpsert };
