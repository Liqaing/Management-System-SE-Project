const errorHandler = (err, req, res, next) => {
    console.log("Error here:", err.message);

    const statusCode = res.statusCode ? res.statusCode : 500;

    return res.status(statusCode).json({
        success: false,
        error: {
            message: "Internal Server Error",
        },
    });
};

export { errorHandler };
