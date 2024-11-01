import swaggerAutogen from "swagger-autogen";

const doc = {
    info: {
        version: "1.0.0",
        title: "My API",
        description:
            "Documentation automatically generated by the <b>swagger-autogen</b> module.",
    },
    host: "localhost:8000",
    basePath: "/",
    schemes: ["http", "https"],
    consumes: ["application/json"],
    produces: ["application/json"],
    tags: [
        {
            name: "Auth", // Tag name
            description: "authentication user", // Tag description
        },
        {
            name: "User",
            description: "operation on user",
        },
        {
            name: "Role",
            description: "operation on role",
        },
        {
            name: "Category",
            description: "operation on product category",
        },
        {
            name: "Product",
            description: "operation on product",
        },
    ],
    components: {
        securitySchemes: {
            // bearerAuth: {
            //     type: "http",
            //     in: "header",
            //     name: "Authorization",
            //     description: "Bearer token to access these api endpoints",
            //     scheme: "bearer",
            //     bearerFormat: "JWT",
            // },
            cookieAuth: {
                type: "apiKey",
                in: "cookie",
                name: "token",
            },
        },
    },
    security: [
        {
            bearerAuth: [],
        },
    ],
};

const outputFile = "./swagger/swagger-output.json";
const routes = ["./index.js"];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, routes, doc);
