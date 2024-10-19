import bcrypt from "bcrypt";
import { dbCreateUser } from "../db/user.queries.js";
import saltRounds from "../config/bcrypt.config.js";
import { ROLES } from "../utils/constants.js";
import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";

const validateUser = [
    body("username")
        .notEmpty()
        .withMessage("Username cannot be empty")
        .trim()
        .escape(),
    body("password")
        .notEmpty()
        .withMessage("Password cannot be empty")
        .trim()
        .escape(),
    body("telephone")
        .notEmpty()
        .withMessage("Telephone cannot be empty")
        .trim()
        .isNumeric()
        .withMessage("Invalid, Telephone can only contain number")
        .escape(),
];

const createUser = [
    validateUser,
    asyncHandler(async (req, res) => {
        // #swagger.tags = ['User']

        if (req.authData.role != ROLES.adminRole) {
            return res.status(403).json({
                success: false,
                message: "Unauthorize operation",
            });
        }

        const error = validationResult(req);
        console.log(error);
        if (!error.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: error.array()[0].msg,
            });
        }

        const { username, password, telephone } = req.body;

        //hashing the password and saving it in the database
        bcrypt.hash(password, saltRounds, async (err, hash) => {
            if (err) {
                console.error("Error hashing password:", err);
                throw err;
            } else {
                await dbCreateUser(username, hash, telephone);
                return res.sendStatus(201);
            }
        });
    }),
];

export { createUser };
