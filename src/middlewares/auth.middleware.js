import jwt from "jsonwebtoken";
import { jwtSecretKey } from "../config/auth.config.js";
import expressAsyncHandler from "express-async-handler";

const validateHeader = [];

const verifyToken = expressAsyncHandler((req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({
            success: false,
            error: {
                message: "Unauthorized, please make sure you are login",
            },
        });
    }

    jwt.verify(token, jwtSecretKey, (err, authData) => {
        console.log(err);
        if (err) {
            return res.status(401).json({
                success: false,
                error: {
                    message: "Unauthorize request",
                },
            });
        }
        req.authData = authData;
        next();
    });
});

export { verifyToken };
