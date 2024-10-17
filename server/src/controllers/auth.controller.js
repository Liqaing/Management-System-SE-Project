import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { dbCreateUser, dbFindUser } from "../db/user.queries.js"
import { jwtSecretKey } from '../config/auth.config.js';

const loginUser = async (req, res) => {    
    const password = req.body.username
    const telephone = req.body.telephone

    const user = await dbFindUser(telephone);

    if (user == null) {
        res.status(401).json({
            success: false,
            message: "Telephone or password is not correct"
        });
    }

    bcrypt.compare(password, user.password)
        .then((err, result) => {
            if (!result) {
                res.status(401).json({
                    success: false,
                    message: "Telephone or password is not correct"
                });
            }
        });

    jwt.sign(
        {role: 'admin'}, jwtSecretKey,
        (err, token) => {
            if (err) {
                res.status(401).json({
                    message: "Unauthorized"
                });
            };

            res.json({
                token: token
            });
        }
    );
}

export {loginUser}