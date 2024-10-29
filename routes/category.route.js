import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware";

const categoryRouter = Router();

categoryRouter.get("/");

export { categoryRouter };
