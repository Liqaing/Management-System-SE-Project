/*
    Validation middleware for req,
    purpose: ensure that input data is correct
*/

import expressAsyncHandler from "express-async-handler";
import { validationResult } from "express-validator";

const validatorHandler = expressAsyncHandler((req, res, next) => {
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            success: false,
            message: errors.array()[0].msg,
        });
    }
    next();
});

export { validatorHandler };
