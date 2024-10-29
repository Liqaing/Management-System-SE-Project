import { param } from "express-validator";
import { validatorHandler } from "../validator.middleware.js";

const validateParamId = [
    param("id")
        .notEmpty()
        .withMessage("Invalid input")
        .trim()
        .isInt()
        .withMessage("Invalid input")
        .toInt(),
    validatorHandler,
];

export { validateParamId };
