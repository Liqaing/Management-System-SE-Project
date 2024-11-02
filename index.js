import express from "express";
import morgan from "morgan";
import { userRouter } from "./routes/user.route.js";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import { authRouter } from "./routes/auth.route.js";
import fs from "fs";
import path from "path";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";
import { roleRouter } from "./routes/role.route.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { categoryRouter } from "./routes/category.route.js";
import { productRouter } from "./routes/product.route.js";

dotenv.config();

const swaggerFilePath = path.join(
    process.cwd(),
    "config/swagger/swagger-output.json"
);

const swaggerFile = JSON.parse(fs.readFileSync(swaggerFilePath, "utf-8"));

const app = express();
const port = 8000;

// middlewares]
app.use(cors());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/role", roleRouter);
app.use("/api/category", categoryRouter);
app.use("/api/product", productRouter);

app.get("/api", (req, res) => {
    return res.status(200).json({
        success: true,
        message: "receive",
    });
});

app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is listening on ${port}`);
});
