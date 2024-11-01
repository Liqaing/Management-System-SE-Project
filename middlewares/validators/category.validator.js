import { body, query } from "express-validator";
import { validatorHandler } from "../validator.middleware.js";

const validateCategoryUpsert = [
    body("categoryName")
        .notEmpty()
        .withMessage("Category name cannot be empty")
        .trim(),
    body("description")
        .optional({ checkFalsy: true })
        .isLength({ max: 500 })
        .withMessage("Description can be up to 500 characters long")
        .trim()
        .escape(),
    validatorHandler,
];

const validateCategoryQueryParams = [
    query("includeProducts")
        .optional({ checkFalsy: true })
        .isBoolean()
        .withMessage("includeProducts must be a true or false value"),
    validatorHandler,
];

export { validateCategoryUpsert, validateCategoryQueryParams };
