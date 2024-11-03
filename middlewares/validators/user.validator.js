import { body } from "express-validator";
import { validatorHandler } from "../validator.middleware.js";

const validateUserCreate = [
    body("username").notEmpty().withMessage("Username cannot be empty").trim(),
    body("password").notEmpty().withMessage("Password cannot be empty").trim(),
    body("telephone")
        .notEmpty()
        .withMessage("Telephone cannot be empty")
        .trim()
        .isNumeric()
        .withMessage("Invalid, Telephone can only contain number"),
    body("roleId")
        .notEmpty()
        .withMessage("Role cannot be empty")
        .trim()
        .isNumeric()
        .withMessage("Invalid, Please input role id")
        .toInt(),
    validatorHandler,
];

const validateUserUpdate = [
    body("username").notEmpty().withMessage("Username cannot be empty").trim(),
    body("telephone")
        .notEmpty()
        .withMessage("Telephone cannot be empty")
        .trim()
        .isNumeric()
        .withMessage("Invalid, Telephone can only contain number"),
    body("roleId")
        .notEmpty()
        .withMessage("Role cannot be empty")
        .trim()
        .isInt()
        .withMessage("Invalid, Please input role id")
        .toInt(),
    validatorHandler,
];

export { validateUserCreate, validateUserUpdate };
