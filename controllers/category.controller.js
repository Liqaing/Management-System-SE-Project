import expressAsyncHandler from "express-async-handler";
import {
    dbCreateCategory,
    dbFindAllCategory,
    dbFindCategoryByName,
} from "../db/cateogory.queries.js";
import { ROLES } from "../utils/constants.js";

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

const createCategory = expressAsyncHandler(async (req, res) => {
    // #swagger.tags = ['Category']

    const { categoryName, description } = req.body;

    // Create new category
    if (
        req.authData.role != ROLES.adminRole &&
        req.authData.role != ROLES.staffRole
    ) {
        return res.status(403).json({
            success: false,
            error: {
                message: "Unauthorize operation",
            },
        });
    }

    const existing_category = await dbFindCategoryByName(categoryName);
    if (existing_category != null) {
        return res.status(409).json({
            success: false,
            error: {
                message: "This category is already exist",
            },
        });
    }

    const newCategory = await dbCreateCategory(
        categoryName,
        description,
        req.authData.username
    );

    return res.status(201).json({
        success: true,
        data: {
            message: `Category ${newCategory.categoryName} has been successfully created`,
        },
    });
});

export { getAllCategory, createCategory };
