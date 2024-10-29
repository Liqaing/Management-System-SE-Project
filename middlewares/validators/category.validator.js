import { body } from "express-validator";
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

export { validateCategoryUpsert };
