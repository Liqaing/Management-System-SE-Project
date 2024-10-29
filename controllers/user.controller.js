import bcrypt from "bcrypt";
import {
    dbCreateUser,
    dbFindUserByTel,
    dbFindUserById,
} from "../db/user.queries.js";
import saltRounds from "../config/bcrypt.config.js";
import { ROLES } from "../utils/constants.js";
import expressAsyncHandler from "express-async-handler";
import upload from "../config/multer.config.js";
import { checkImageType } from "../utils/utils.js";

/**
 * Create new user with select role
 * only admin user is allow
 */
const createUser = [
    upload.single("userImage"),
    expressAsyncHandler(async (req, res) => {
        /*
            #swagger.tags = ['User']
            #swagger.consumes = ['multipart/form-data']
                     
            #swagger.parameters['body'] = {
            in: 'body',
            description: 'User creation data',
            required: true,
            schema: {
                    type: 'object',
                    properties: {
                    username: { type: 'string', example: 'john_doe' },
                    password: { type: 'string', example: 'password123' },
                    telephone: { type: 'string', example: '+1234567890' },
                    roleId: { type: 'integer', example: 1 },
                    userImage: { in: 'formData', type: 'file', description: 'User profile image file' }
                },
                required: ['username', 'password', 'telephone', 'roleId', 'userImage']
            }
        }         
        */

        if (req.authData.role != ROLES.adminRole) {
            return res.status(403).json({
                success: false,
                error: {
                    message: "Unauthorize operation",
                },
            });
        }

        const { username, password, telephone, roleId } = req.body;

        const existing_user = await dbFindUserByTel(telephone);
        if (existing_user != null) {
            return res.status(409).json({
                success: false,
                error: {
                    message: "A user with this telephone is already exist",
                },
            });
        }

        // Retreive filename and byte data
        if (file.mimetype != "image/jpeg" || file.mimetype != "image/png") {
            return res.status(403).json({
                success: false,
                error: {
                    message: "Only JPEG and PNG files are allowed",
                },
            });
        }
        const { buffer } = req.file;

        //hashing the password and saving it in the database
        bcrypt.hash(password, saltRounds, async (err, hash) => {
            if (err) {
                console.error("Error hashing password:", err);
                throw err;
            } else {
                await dbCreateUser(
                    username,
                    hash,
                    telephone,
                    Number(roleId),
                    buffer
                );
                return res.status(201).json({
                    success: true,
                });
            }
        });
    }),
];

const getUserImage = expressAsyncHandler(async (req, res) => {
    // Endpoint for retireving user iamge
    const { id } = req.params;
    const user = await dbFindUserById(id);

    if (req.authData.role != ROLES.adminRole && req.authData.id != user.id) {
        return res.status(403);
    }

    const image = user.userImage;
    const imageType = checkImageType(image);
    res.set("Content-Type", imageType);
    res.status(200).send(image);
});

export { createUser, getUserImage };
