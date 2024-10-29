import { Router } from "express";
import { getAllCategory } from "../controllers/category.controller.js";

const categoryRouter = Router();

categoryRouter.get("/", getAllCategory);

export { categoryRouter };
