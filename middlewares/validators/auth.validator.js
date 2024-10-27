import { body } from "express-validator";
import { validatorHandler } from "../validator.middleware.js";

const validateLogin = [
    body("password").notEmpty().withMessage("Password cannot be empty").trim(),
    body("telephone")
        .notEmpty()
        .withMessage("Telephone cannot be empty")
        .trim()
        .isNumeric()
        .withMessage("Invalid, Telephone can only contain number"),
    validatorHandler,
];

const validateSingup = [
    body("username").notEmpty().withMessage("Username cannot be empty").trim(),
    body("password").notEmpty().withMessage("Password cannot be empty").trim(),
    body("telephone")
        .notEmpty()
        .withMessage("Telephone cannot be empty")
        .trim()
        .isNumeric()
        .withMessage("Invalid, Telephone can only contain number"),
    validatorHandler,
];

export { validateLogin, validateSingup };
