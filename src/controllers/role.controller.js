import expressAsyncHandler from "express-async-handler";
import { dbFindAllRoles } from "../db/role.queries.js";
import { ROLES } from "../utils/constants.js";

const getAllRoles = expressAsyncHandler(async (req, res) => {
    // #swagger.tags = ['Role']
    // #swagger.security = [{ "bearerAuth": [] }]

    if (req.authData.role != ROLES.adminRole) {
        return res.status(403).json({
            success: false,
            message: "Unauthorize operation",
        });
    }

    const roles = await dbFindAllRoles();
    res.status(200).json({
        success: true,
        message: "Success get all roles",
        data: roles,
    });
});

export { getAllRoles };
