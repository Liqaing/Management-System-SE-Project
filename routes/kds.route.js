import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { getAllPreparingOrder } from "../controllers/kds.controller.js";

// Kitchen Display System
const kdsRouter = Router();

kdsRouter.get("/", verifyToken, getAllPreparingOrder);

export { kdsRouter };
