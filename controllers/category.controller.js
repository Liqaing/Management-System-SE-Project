import expressAsyncHandler from "express-async-handler";
import { dbFindAllCategory } from "../db/cateogory.queries.js";

const getAllCategory = expressAsyncHandler(async (req, res) => {
    // #swagger.tags = ['Category']

    const categories = await dbFindAllCategory();
    return res.status(200).json({
        success: true,
        data: {
            ...categories,
        },
    });
});

export { getAllCategory };
