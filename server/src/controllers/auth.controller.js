import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { dbCreateUser, dbFindUser } from "../db/user.queries.js";
import { jwtSecretKey } from "../config/auth.config.js";

const loginUser = async (req, res) => {
    const password = req.body.password;
    const telephone = req.body.telephone;

    const user = await dbFindUser(telephone);

    if (user == null) {
        return res.status(401).json({
            success: false,
            message: "Telephone or password is not correct",
        });
    }

    bcrypt.compare(password, user.password, (err, result) => {
        if (!result) {
            return res.status(401).json({
                success: false,
                message: "Telephone or password is not correct",
            });
        }
    });

    jwt.sign(
        { username: user.username, role: "admin" },
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
};

export { loginUser };
