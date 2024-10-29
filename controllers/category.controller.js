import expressAsyncHandler from "express-async-handler";
import {
    dbCreateCategory,
    dbFindAllCategory,
    dbFindCategoryById,
    dbFindCategoryByName,
    dbUpdateCategory,
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
    // Create new category
    const { categoryName, description } = req.body;
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

const updateCategory = expressAsyncHandler(async (req, res) => {
    // #swagger.tags = ['Category']
    // Update new category
    const { categoryName, description } = req.body;
    const { id } = req.params;

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

    // Find Category
    const category = await dbFindCategoryById(id);
    if (!category) {
        return res.status(404).json({
            success: false,
            error: {
                message: "Category not found",
            },
        });
    }

    // Check duplicate category
    const existingCategory = await dbFindCategoryByName(categoryName);
    if (existingCategory && existingCategory.id !== id) {
        return res.status(409).json({
            success: false,
            error: {
                message: "A category with this name already exists",
            },
        });
    }

    const updatedCategory = await dbUpdateCategory(
        id,
        categoryName,
        description,
        req.authData.username
    );

    return res.status(200).json({
        success: true,
        data: {
            message: `Category ${updatedCategory.categoryName} has been successfully updated`,
        },
    });
});

export { getAllCategory, createCategory, updateCategory };
