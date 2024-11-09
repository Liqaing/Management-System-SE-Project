import Router from "express";
import {
    AuthUser,
    loginUser,
    logoutUser,
    signupUser,
} from "../controllers/auth.controller.js";
import {
    validateLogin,
    validateSingup,
} from "../middlewares/validators/auth.validator.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const authRouter = Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     description: Log in a user
 *     parameters:
 *       - in: body
 *         name: user
 *         description: User login credentials
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             telephone:
 *               type: string
 *               description: User telephone number
 *             password:
 *               type: string
 *               description: User password
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *               example: true
 *             data:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: integer
 *                   example: 1
 *                 username:
 *                   type: string
 *                   example: sampleUser
 *                 role:
 *                   type: string
 *                   example: admin
 *                 userImage:
 *                   type: string
 *                   example: https://example.com/api/user/image/1
 *                 message:
 *                   type: string
 *                   example: Login successful
 *       401:
 *         description: Invalid telephone or password
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *               example: false
 *             error:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Telephone or password is not correct
 */
authRouter.post("/login", validateLogin, loginUser);

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     tags:
 *       - Auth
 *     description: Signup a user, only call this endpoint to create a customer
 *     parameters:
 *       - in: body
 *         name: user
 *         description: User signup credentials
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *               description: Username
 *             password:
 *               type: string
 *               description: Password
 *             telephone:
 *               type: string
 *               description: User telephone number
 *     responses:
 *       201:
 *         description: User created successfully
 *         schema:
 *           success: true
 *       409:
 *         description: User with this telephone already exists
 *         schema:
 *           success: false
 *           error:
 *             message: A user with this telephone already exists
 */
authRouter.post("/signup", validateSingup, signupUser);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     tags:
 *       - Auth
 *     description: Logout a user by clearing the authentication token
 *     responses:
 *       200:
 *         description: User logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Logout successful"
 *       401:
 *         description: Unauthorized, invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Unauthorized, invalid token"
 */
authRouter.post("/logout", verifyToken, logoutUser);

/**
 * @swagger
 * /auth/token:
 *   post:
 *     tags:
 *       - Auth
 *     description: Verify if a user is logged in or if their token has expired
 *     responses:
 *       200:
 *         description: User is logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     isLogin:
 *                       type: boolean
 *                       example: true
 *                     role:
 *                       type: string
 *                       example: "admin"
 *                     username:
 *                       type: string
 *                       example: "sampleUser"
 *                     message:
 *                       type: string
 *                       example: "user is logged in"
 *       401:
 *         description: Unauthorized, invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     isLogin:
 *                       type: boolean
 *                       example: false
 *                     message:
 *                       type: string
 *                       example: "Unauthorized, invalid token"
 */
authRouter.post("/token", AuthUser);

export { authRouter };
