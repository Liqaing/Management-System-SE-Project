import { body, query } from "express-validator";
import { validatorHandler } from "../validator.middleware.js";

const validateOrderInSert = [
    body("paymentMethod")
        .notEmpty()
        .withMessage("Payment Method cannot be empty")
        .trim(),
    body("remark")
        .optional()
        .isLength({ max: 800 })
        .withMessage("Remark can be up to 800 characters long")
        .trim()
        .escape(),
    body("orderType")
        .notEmpty()
        .withMessage("Order Type name cannot be empty")
        .trim(),

    body("items").isArray().withMessage("Order product cannot be empty"),
    body("items.*.productId")
        .notEmpty()
        .withMessage("Order product id cannot be empty")
        .trim()
        .isInt()
        .withMessage("Invalid product id")
        .toInt(),
    body("items.*.orderQuantity")
        .notEmpty()
        .withMessage("Order Product quantity cannot be empty")
        .trim()
        .isInt({ min: 0 })
        .withMessage("Order Product quantity must be a positive number")
        .toInt(),
    body("items.*.categoryName")
        .notEmpty()
        .withMessage("Order Product Category name cannot be empty")
        .trim(),
    body("items.*.productName")
        .notEmpty()
        .withMessage("Order Product name cannot be empty")
        .trim(),

    body("couponId")
        .optional()
        .trim()
        .isInt()
        .withMessage("Invalid coupon Id")
        .toInt(),
    validatorHandler,
];

const validateOrderQueryParams = [
    query("includeOrderDetail")
        .optional({ checkFalsy: true })
        .isBoolean()
        .withMessage("includeOrderDetail must be a true or false value"),
    validatorHandler,
];

export { validateOrderInSert, validateOrderQueryParams };
