import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { getAllRoles } from "../controllers/role.controller.js";

const roleRouter = Router();

/**
 * @swagger
 * /api/role:
 *   get:
 *     tags:
 *       - Role
 *     description: Retrieve all roles from the database. Accessible only by admin users.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved all roles
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
 *                             description: Unique ID of the role
 *                             example: 1
 *                           roleName:
 *                             type: string
 *                             description: Name of the role
 *                             example: "Admin"
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
roleRouter.get("/", verifyToken, getAllRoles);

export { roleRouter };
