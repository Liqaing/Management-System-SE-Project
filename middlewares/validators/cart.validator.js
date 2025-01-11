import { body, query } from "express-validator";
import { validatorHandler } from "../validator.middleware.js";

const validateCartAdd = [
    body("productId")
        .notEmpty()
        .withMessage("Must select a product to add to cart")
        .trim()
        .isInt()
        .withMessage("Invalid, Please select a valid product")
        .toInt(),
    body("orderQuantity")
        .notEmpty()
        .withMessage("Product quantity cannot be empty")
        .trim()
        .isInt({ min: 0 })
        .withMessage("Product quantity must be a positive number")
        .toInt(),

    validatorHandler,
];

const validateCartRemove = [
    body("cartId")
        .notEmpty()
        .withMessage("Must select a product to remove to cart")
        .trim()
        .isInt()
        .withMessage("Invalid, Please select a valid cart item")
        .toInt(),
    body("deleteAll")
        .optional()
        .isBoolean()
        .withMessage("Invalid, Please select enter a boolean value")
        .toBoolean(),

    validatorHandler,
];

export { validateCartAdd, validateCartRemove };
