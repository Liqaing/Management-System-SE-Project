import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { dbCreateUser, dbFindUserByTel } from "../db/user.queries.js";
import { jwtSecretKey } from "../config/auth.config.js";
import { ROLES } from "../utils/constants.js";
import saltRounds from "../config/bcrypt.config.js";
import { dbFindRole } from "../db/role.queries.js";
import expressAsyncHandler from "express-async-handler";
import { constructUrl } from "../utils/utils.js";

const loginUser = expressAsyncHandler(async (req, res) => {
    const { password, telephone } = req.body;
    const user = await dbFindUserByTel(telephone, { role: true });

    if (user == null) {
        return res.status(401).json({
            success: false,
            error: {
                message: "Telephone or password is not correct",
            },
        });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        return res.status(401).json({
            success: false,
            error: {
                message: "Telephone or password is not correct",
            },
        });
    }

    jwt.sign(
        { userId: user.id, username: user.username, role: user.role.roleName },
        jwtSecretKey,
        (err, token) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    error: {
                        message: "Unauthorized",
                    },
                });
            }

            res.cookie("token", token, {
                httpOnly: true,
                secure: false,
                sameSite: "Strict",
                maxAge: 3600000 * 36,
            });

            const url = constructUrl(req);
            return res.status(200).json({
                success: true,
                data: {
                    userId: user.id,
                    username: user.username,
                    role: user.role.roleName,
                    userImage: `${url}/api/user/image/${user.id}`,
                    message: "Loggin successful",
                },
            });
        }
    );
});

const signupUser = expressAsyncHandler(async (req, res) => {
    const { username, password, telephone } = req.body;
    const existing_user = await dbFindUserByTel(telephone);
    if (existing_user != null) {
        return res.status(409).json({
            success: false,
            error: {
                message: "A user with this telephone is already exist",
            },
        });
    }

    const role = await dbFindRole(ROLES.userRole);

    // hashing the password and saving it in the database
    bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
            console.error("Error hashing password:", err);
            throw err;
        } else {
            await dbCreateUser(username, hash, telephone, role.id);
            return res.status(201).json({
                success: true,
            });
        }
    });
});

const AuthUser = expressAsyncHandler(async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({
            success: false,
            error: {
                isLogin: false,
                message: "user is not login",
            },
        });
    }

    jwt.verify(token, jwtSecretKey, (err, authData) => {
        if (err) {
            return res.status(401).json({
                success: false,
                error: {
                    isLogin: false,
                    message: "Unauthorized, invalid token",
                },
            });
        }
        return res.status(200).json({
            success: true,
            data: {
                isLogin: true,
                role: authData.role,
                username: authData.username,
                message: "user is login",
            },
        });
    });
});

const logoutUser = expressAsyncHandler(async (req, res) => {
    res.clearCookie("token");
    return res.status(200).json({
        success: true,
        data: {
            message: "Logout successful",
        },
    });
});

export { loginUser, signupUser, logoutUser, AuthUser };
