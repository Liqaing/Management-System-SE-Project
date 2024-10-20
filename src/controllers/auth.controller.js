import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { dbCreateUser, dbFindUser } from "../db/user.queries.js";
import { jwtSecretKey } from "../config/auth.config.js";
import asyncHandler from "express-async-handler";
import { ROLES } from "../utils/constants.js";
import saltRounds from "../config/bcrypt.config.js";
import { dbFindRole } from "../db/role.queries.js";

const loginUser = asyncHandler(async (req, res) => {
    // #swagger.tags = ['Auth']
    // #swagger.description = 'Log in a user'
    const { password, telephone } = req.body;

    const user = await dbFindUser(telephone);

    if (user == null) {
        return res.status(401).json({
            success: false,
            message: "Telephone or password is not correct",
        });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        return res.status(401).json({
            success: false,
            message: "Telephone or password is not correct",
        });
    }

    jwt.sign(
        { username: user.username, role: ROLES.adminRole },
        jwtSecretKey,
        (err, token) => {
            if (err) {
                return res.status(401).json({
                    message: "Unauthorized",
                });
            }

            return res.json({
                token: token,
            });
        }
    );
});

const signupUser = asyncHandler(async (req, res) => {
    // #swagger.tags = ['Auth']
    // #swagger.description = 'Singup a user, only call this endpoint on creat customer'

    const { username, password, telephone } = req.body;

    const role = await dbFindRole(ROLES.userRole);

    //hashing the password and saving it in the database
    bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
            console.error("Error hashing password:", err);
            throw err;
        } else {
            await dbCreateUser(username, hash, telephone, role.id);
            return res.sendStatus(201);
        }
    });
});

export { loginUser, signupUser };
