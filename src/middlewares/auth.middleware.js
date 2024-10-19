import jwt from "jsonwebtoken";
import { jwtSecretKey } from "../config/auth.config.js";

const verifyToken = (req, res, next) => {
    const bearerHeader = req.headers["authorization"];
    if (!bearerHeader) {
        return res.status(401).json({
            success: false,
            message: "Unauthorize request",
        });
    }

    const bearerToken = bearerHeader.split(" ")[1];
    jwt.verify(bearerToken, jwtSecretKey, (err, authData) => {
        if (err) {
            return res.status(401).json({
                success: false,
                message: "Unauthorize request",
            });
        }
        req.authData = authData;
        console.log(req.authData);
        next();
    });
};

export { verifyToken };