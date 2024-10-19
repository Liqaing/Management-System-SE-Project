/*
    Validation middleware for user route,
    purpose: ensure that input data is correct
*/
import expressAsyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";

const validateUserCreate = [
    body("username").notEmpty().withMessage("Username cannot be empty").trim(),
    body("password").notEmpty().withMessage("Password cannot be empty").trim(),
    body("telephone")
        .notEmpty()
        .withMessage("Telephone cannot be empty")
        .trim()
        .isNumeric()
        .withMessage("Invalid, Telephone can only contain number"),
    expressAsyncHandler((req, res, next) => {
        const errors = validationResult(req);
        console.log(errors);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                success: false,
                message: errors.array()[0].msg,
            });
        }
        next();
    }),
];

export { validateUserCreate };
