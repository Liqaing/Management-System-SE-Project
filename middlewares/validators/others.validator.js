import { param } from "express-validator";
import { validatorHandler } from "../validator.middleware.js";

const validateParamId = [
    param("id")
        .notEmpty()
        .withMessage("Invalid parameter")
        .trim()
        .toInt()
        .withMessage("Invalid parameter"),
    validatorHandler,
];

export { validateParamId };
