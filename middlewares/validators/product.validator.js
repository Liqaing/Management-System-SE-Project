import { body } from "express-validator";
import { validatorHandler } from "../validator.middleware.js";

const validateProductCreate = [
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
    body("categoryId")
        .notEmpty()
        .withMessage("Must select a category for product")
        .trim()
        .isInt()
        .withMessage("Invalid, Please select a valid category")
        .toInt(),
    validatorHandler,
];

export { validateProductCreate };
