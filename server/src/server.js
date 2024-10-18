import express from "express";
import morgan from "morgan";
import { userRouter } from "./routes/user.route.js";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import { authRouter } from "./routes/auth.route.js";

// const swaggerFile = require("./config/swagger/swagger-output.json");

dotenv.config();

const app = express();
const port = 8000;

// middlewares
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.get("/", (req, res) => {
    return res.sendStatus(200);
});

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup("./config/swagger/swagger-output.json")
);

app.listen(port, () => {
    console.log(`Server is listening on ${port}`);
});
