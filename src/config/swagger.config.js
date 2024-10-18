import swaggerJsdoc from "swagger-jsdoc";

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
};

const outputFile = "./swagger/swagger-output.json";
const routes = ["../server.js"];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, routes, doc);
