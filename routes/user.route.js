import { Router } from "express";
import {
    createUser,
    deleteUser,
    getAllUser,
    getOneUser,
    getUserImage,
    updateUser,
} from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
    validateUserCreate,
    validateUserUpdate,
} from "../middlewares/validators/user.validator.js";
import { validateParamId } from "../middlewares/validators/others.validator.js";
import upload from "../config/multer.config.js";

const userRouter = Router();

/**
 * @swagger
 * /api/user:
 *   get:
 *     tags:
 *       - User
 *     description: Retrieve all users, with optional filtering by role. Accessible only by admin users.
 *     parameters:
 *       - in: query
 *         name: filter[roleName]
 *         required: false
 *         schema:
 *           type: string
 *           description: Role name to filter users by
 *           example: "Admin"
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved all users
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
 *                     value:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             description: Unique ID of the user
 *                             example: 1
 *                           username:
 *                             type: string
 *                             description: Username of the user
 *                             example: "johndoe"
 *                           role:
 *                             type: object
 *                             description: Role assigned to the user
 *                             properties:
 *                               roleName:
 *                                 type: string
 *                                 description: Name of the user's role
 *                                 example: "Admin"
 *                           userImage:
 *                             type: string
 *                             description: URL for the user's image
 *                             example: "https://example.com/api/user/image/1"
 *       403:
 *         description: Unauthorized operation, user is not an admin
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
 *                       example: "Unauthorized operation"
 */
userRouter.get("/", verifyToken, getAllUser);

/**
 * @swagger
 * /api/user/{id}:
 *   get:
 *     tags:
 *       - User
 *     description: Retrieve details for a single user by ID. Accessible only by admin users or the user themselves.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           description: Unique ID of the user
 *           example: 1
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user details
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
 *                     value:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             description: Unique ID of the user
 *                             example: 1
 *                           username:
 *                             type: string
 *                             description: Username of the user
 *                             example: "johndoe"
 *                           role:
 *                             type: object
 *                             description: Role assigned to the user
 *                             properties:
 *                               roleName:
 *                                 type: string
 *                                 description: Name of the user's role
 *                                 example: "Admin"
 *                           userImage:
 *                             type: string
 *                             description: URL for the user's image
 *                             example: "https://example.com/api/user/image/1"
 *       403:
 *         description: Unauthorized operation, user is not authorized
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
 *                       example: "Unauthorized, you do not have permission for this operation"
 *       404:
 *         description: User not found
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
 *                       example: "This user does not exist"
 */
userRouter.get("/:id", verifyToken, validateParamId, getOneUser);

/**
 * @swagger
 * /api/user:
 *   post:
 *     tags:
 *       - User
 *     description: Create a new user. Accessible only by admin users.
 *     parameters:
 *       - in: body
 *         name: user
 *         description: User information
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *               description: The username for the new user.
 *               example: "john_doe"
 *             password:
 *               type: string
 *               description: The password for the new user.
 *               example: "password123"
 *             telephone:
 *               type: string
 *               description: User's telephone number.
 *               example: "+1234567890"
 *             roleId:
 *               type: integer
 *               description: ID of the role to assign to the user.
 *               example: 1
 *             userImage:
 *               type: string
 *               format: binary
 *               description: User profile image file in JPEG or PNG format.
 *     responses:
 *       201:
 *         description: Successfully created a new user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       403:
 *         description: Unauthorized operation, user is not an admin
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
 *                       example: "Unauthorized operation"
 *       404:
 *         description: Role not found
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
 *                       example: "The role does not exist, please input a valid user role"
 *       409:
 *         description: User already exists with the given telephone
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
 *                       example: "A user with this telephone already exists"
 *       415:
 *         description: Unsupported media type for user image
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
 *                       example: "Only JPEG and PNG files are allowed"
 */
userRouter.post(
    "/",
    verifyToken,
    upload.single("userImage"),
    validateUserCreate,
    createUser
);

/**
 * @swagger
 * /api/user/{id}:
 *   put:
 *     tags:
 *       - User
 *     description: Update user information. Only accessible by admin users or the user themselves.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user to update.
 *       - in: body
 *         name: user
 *         description: Updated user information.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *               description: The new username for the user.
 *               example: "john_doe_updated"
 *             telephone:
 *               type: string
 *               description: The new telephone number for the user.
 *               example: "+1234567891"
 *             roleId:
 *               type: integer
 *               description: The ID of the new role for the user.
 *               example: 2
 *             userImage:
 *               type: string
 *               format: binary
 *               description: The new user profile image in JPEG or PNG format. Uploading a new image will replace the old one.
 *     responses:
 *       200:
 *         description: Successfully updated the user
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
 *                       example: "User john_doe_updated has been successfully updated"
 *       403:
 *         description: Unauthorized operation, only accessible by admin or the user themselves.
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
 *                       example: "Unauthorized, you do not have permission to this operation"
 *       404:
 *         description: User or role not found
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
 *                       example: "This user does not exist"
 *       415:
 *         description: Unsupported media type for user image
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
 *                       example: "Only JPEG and PNG files are allowed"
 */
userRouter.put(
    "/:id",
    verifyToken,
    upload.single("userImage"),
    validateParamId,
    validateUserUpdate,
    updateUser
);

/**
 * @swagger
 * /api/user/{id}:
 *   delete:
 *     tags:
 *       - User
 *     description: Delete a user. Only accessible by admin users or the user themselves.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user to delete.
 *     responses:
 *       200:
 *         description: Successfully deleted the user
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
 *                       example: "User john_doe has been successfully deleted"
 *       403:
 *         description: Unauthorized operation, only accessible by admin or the user themselves.
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
 *                       example: "Unauthorized, you do not have permission to this operation"
 *       404:
 *         description: User not found
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
 *                       example: "This user does not exist"
 */
userRouter.delete("/:id", verifyToken, validateParamId, deleteUser);

/**
 * @swagger
 * /api/user/{id}/image:
 *   get:
 *     tags:
 *       - User
 *     description: Retrieve the image of a user. Only accessible by the admin or the user themselves.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user whose image is to be retrieved.
 *     responses:
 *       200:
 *         description: Successfully retrieved the user image
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
       404:
 *         description: User or user image not found, or unauthorized operation
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
 *                       example: "User does not exist or image not found, or unauthorized operation"
 *       403:
 *         description: Unauthorized operation, only accessible by admin or the user themselves.
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
 *                       example: "Unauthorized, you do not have permission to this operation"
 */
userRouter.get("/image/:id", verifyToken, validateParamId, getUserImage);

export { userRouter };
