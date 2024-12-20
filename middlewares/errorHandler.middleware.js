const errorHandler = (err, req, res, next) => {
    console.log("Error here:", err);

    return res.status(500).json({
        success: false,
        error: {
            message:
                "Internal Server Error. Sorry we are unavailable at the moment.",
        },
    });
};

export { errorHandler };
