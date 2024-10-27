import bcrypt from "bcrypt";
import { dbCreateUser, dbFindUser } from "../db/user.queries.js";
import saltRounds from "../config/bcrypt.config.js";
import { ROLES } from "../utils/constants.js";
import expressAsyncHandler from "express-async-handler";

const createUser = expressAsyncHandler(async (req, res) => {
    // #swagger.tags = ['User']

    if (req.authData.role != ROLES.adminRole) {
        return res.status(403).json({
            success: false,
            error: {
                message: "Unauthorize operation",
            },
        });
    }

    const { username, password, telephone, roleId } = req.body;

    const existing_user = await dbFindUser(telephone);
    if (existing_user != null) {
        return res.status(409).json({
            success: false,
            error: {
                message: "A user with this telephone is already exist",
            },
        });
    }

    //hashing the password and saving it in the database
    bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
            console.error("Error hashing password:", err);
            throw err;
        } else {
            await dbCreateUser(username, hash, telephone, Number(roleId));
            return res.status(201).json({
                success: true,
            });
        }
    });
});

export { createUser };
