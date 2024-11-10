import { body, query } from "express-validator";
import { validatorHandler } from "../validator.middleware.js";

const validateProductUpSert = [
    body("productName")
        .notEmpty()
        .withMessage("Product name cannot be empty")
        .trim(),
    body("description")
        .optional()
        .isLength({ max: 800 })
        .withMessage("Description can be up to 800 characters long")
        .trim()
        .escape(),
    body("price")
        .notEmpty()
        .withMessage("Product price cannot be empty")
        .trim()
        .isFloat({ min: 0 })
        .withMessage("Invalid, Please input a valid product price")
        .toFloat(),
    body("qty")
        .notEmpty()
        .withMessage("Product quantity cannot be empty")
        .trim()
        .isInt({ min: 0 })
        .withMessage("Product quantity must be a positive number")
        .toInt(),
    body("categoryId")
        .notEmpty()
        .withMessage("Must select a category for product")
        .trim()
        .isInt()
        .withMessage("Invalid, Please select a valid category")
        .toInt(),
    validatorHandler,
];

const validateProductQueryParams = [
    query("includeCategory")
        .optional({ checkFalsy: true })
        .isBoolean()
        .withMessage("includeCategory must be a true or false value"),
    query("includeProductImage")
        .optional({ checkFalsy: true })
        .isBoolean()
        .withMessage("includeProductImage must be a true or false value"),
    validatorHandler,
];

export { validateProductUpSert, validateProductQueryParams };
