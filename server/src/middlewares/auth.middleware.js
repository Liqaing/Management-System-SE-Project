import jwt from 'jsonwebtoken';
import { jwtSecretKey } from '../config/auth.config';

const verifyToken = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    if (!bearerHeader) {
        res.status(401).json({
            success: false,
            message: "Unauthorize request"
        });
    }

    const bearerToken = bearerHeader.split(' ')[1];
    jwt.verifyToken(bearerToken, jwtSecretKey, (err, authData) => {
        
    });
}
