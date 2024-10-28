import { Router } from "express";
import { verifyToken } from "../../middlewares/auth.middleware.js";
import { getAllRoles } from "../../controllers/admin/role.controller.js";

const roleRouter = Router();

// Get all role
roleRouter.get("/", verifyToken, getAllRoles);

export { roleRouter };
