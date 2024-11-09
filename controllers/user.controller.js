import bcrypt from "bcrypt";
import {
    dbCreateUser,
    dbFindUserByTel,
    dbFindUserById,
    dbFindAllUser,
    dbDeleteUser,
    dbUpdateUser,
} from "../db/user.queries.js";
import saltRounds from "../config/bcrypt.config.js";
import { ROLES } from "../utils/constants.js";
import expressAsyncHandler from "express-async-handler";
import { checkImageType, constructUrl } from "../utils/utils.js";
import { dbFindRoleById } from "../db/role.queries.js";
import { query } from "express";

/**
 * Create new user with select role
 * only admin user is allow
 */
const createUser = expressAsyncHandler(async (req, res) => {
    /*
        #swagger.tags = ['User']
        #swagger.consumes = ['multipart/form-data']
        
        #swagger.requestBody = {
            required: true,
            content: {
                "multipart/form-data": {
                    schema: {
                        type: "object",
                        properties: {
                            username: { type: "string", example: "john_doe" },
                            password: { type: "string", example: "password123" },
                            telephone: { type: "string", example: "+1234567890" },
                            roleId: { type: "integer", example: 1 },
                            userImage: { type: "string", format: "binary", description: "User profile image file" }
                        },
                        required: ["username", "password", "telephone", "roleId", "userImage"]
                    }
                }
            }
        }
*/

    if (req.authData.role != ROLES.adminRole) {
        return res.status(403).json({
            success: false,
            error: {
                message:
                    "Unauthorize, you do not have permission to this operation",
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

    const existRole = await dbFindRoleById(roleId);
    if (!existRole) {
        return res.status(404).json({
            success: false,
            error: {
                message:
                    "The role does not exist, Please input a valid user role",
            },
        });
    }

    // Retreive filename and byte data
    if (req.file.mimetype != "image/jpeg" && req.file.mimetype != "image/png") {
        return res.status(415).json({
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
});

const getAllUser = expressAsyncHandler(async (req, res) => {
    /*  #swagger.tags = ['User']
        #swagger.parameters['filter[roleName]'] = {
            in: 'query',
            description: 'Filter users by role name',
            required: false,
            type: 'string',
            example: 'admin'
        }
    */

    const { filter } = req.query;
    const filterOptions = {};

    if (filter && filter.roleName) {
        filterOptions.role = { roleName: filter.roleName };
    }

    if (req.authData.role != ROLES.adminRole) {
        return res.status(403).json({
            success: false,
            error: {
                message: "Unauthorize operation",
            },
        });
    }

    const users = await dbFindAllUser(filterOptions, { role: true });
    if (users) {
        const url = constructUrl(req);
        users.map((user) => {
            const userImageUrl = `${url}/api/user/image/${user.id}`;
            user.userImage = userImageUrl;
        });
    }

    return res.status(200).json({
        success: true,
        data: {
            value: [...users],
        },
    });
});

const getOneUser = expressAsyncHandler(async (req, res) => {
    // #swagger.tags = ['User']

    const { id } = req.params;

    if (req.authData.role != ROLES.adminRole && req.authData.id != user.id) {
        return res.status(403).json({
            success: false,
            error: {
                message:
                    "Unauthorize, you do not have permission to this operation",
            },
        });
    }

    const user = await dbFindUserById(id, { role: true });
    if (!user) {
        return res.status(404).json({
            success: false,
            error: {
                message: "This user does not exist",
            },
        });
    }

    const url = constructUrl(req);
    const userImageUrl = `${url}/api/user/image/${user.id}`;
    user.userImage = userImageUrl;

    return res.status(200).json({
        success: true,
        data: {
            value: [user],
        },
    });
});

const updateUser = expressAsyncHandler(async (req, res) => {
    /*  #swagger.tags = ['User']
           #swagger.description = 'Endpoint to update user.'
           #swagger.requestBody = {
               content: {
                   "multipart/form-data": {
                       schema: {
                           type: "object",
                           properties: {
                               username: { type: "string", description: "New Username" },
                               telephone: { type: "number", description: "New telephone" },
                               roleId: { type: "integer", description: "ID of the user role" },
                                userImage: {
                                    type: "file",                                    
                                    description: "New useriamge if upload will replace old one",
                                },
                           },
                           required: ["username", "telephone", "roleId",],
                       },
                   },
               },
           }
        */

    const { id } = req.params;
    const { username, telephone, roleId } = req.body;
    const userImage = req.file;

    if (req.authData.role != ROLES.adminRole && req.authData.id != user.id) {
        return res.status(403).json({
            success: false,
            error: {
                message:
                    "Unauthorize, you do not have permission to this operation",
            },
        });
    }

    const existUser = await dbFindUserById(id);
    if (!existUser) {
        return res.status(404).json({
            success: false,
            error: {
                message: "This user does not exist",
            },
        });
    }

    const existRole = await dbFindRoleById(roleId);
    if (!existRole) {
        return res.status(404).json({
            success: false,
            error: {
                message:
                    "The role does not exist, Please input a valid user role",
            },
        });
    }

    if (userImage) {
        if (
            userImage.mimetype != "image/jpeg" &&
            userImage.mimetype != "image/png"
        ) {
            return res.status(415).json({
                success: false,
                error: {
                    message: "Only JPEG and PNG files are allowed",
                },
            });
        }
    }

    const updatedUser = await dbUpdateUser({
        id,
        username,
        telephone,
        roleId,
        userImage,
    });

    return res.status(200).json({
        success: true,
        data: {
            message: `User ${updatedUser.username} has been successfully updated`,
        },
    });
});

const deleteUser = expressAsyncHandler(async (req, res) => {
    // #swagger.tags = ['User']
    const { id } = req.params;

    if (req.authData.role != ROLES.adminRole && req.authData.id != user.id) {
        return res.status(403).json({
            success: false,
            error: {
                message:
                    "Unauthorize, you do not have permission to this operation",
            },
        });
    }

    const existUser = await dbFindUserById(id);
    if (!existUser) {
        return res.status(404).json({
            success: false,
            error: {
                message: "This user does not exist",
            },
        });
    }

    const deleteUser = await dbDeleteUser(id);
    return res.status(200).json({
        success: true,
        data: {
            message: `User ${deleteUser.username} has been successfully deleted`,
        },
    });
});

const getUserImage = expressAsyncHandler(async (req, res) => {
    // #swagger.tags = ['User']
    // Endpoint for retireving user iamge
    const { id } = req.params;
    const user = await dbFindUserById(id);

    if (!user || !user.userImage) {
        return res.sendStatus(404);
    }
    if (req.authData.role != ROLES.adminRole && req.authData.id != user.id) {
        return res.sendStatus(404);
    }

    const image = user.userImage;
    const imageType = checkImageType(image);
    res.set("Content-Type", imageType);
    res.status(200).send(image);
});

export {
    createUser,
    getUserImage,
    getAllUser,
    getOneUser,
    updateUser,
    deleteUser,
};
