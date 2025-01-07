import expressAsyncHandler from "express-async-handler";

const addCart = expressAsyncHandler(async (req, res) => {
    return res.status(200).json({
        success: true,
        data: {
            message: `has been successfully updated`,
        },
    });
});

const removeCart = expressAsyncHandler(async (req, res) => {
    return res.status(200).json({
        success: true,
        data: {
            message: `has been successfully updated`,
        },
    });
});

export { addCart, removeCart };
