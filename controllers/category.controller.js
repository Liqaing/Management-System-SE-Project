import expressAsyncHandler from "express-async-handler";
import {
    dbCreateCategory,
    dbDeleteCategory,
    dbFindAllCategory,
    dbFindCategoryById,
    dbFindCategoryByName,
    dbUpdateCategory,
} from "../db/cateogory.queries.js";
import { BooleanString, ROLES } from "../utils/constants.js";

const getAllCategory = expressAsyncHandler(async (req, res) => {
    // #swagger.tags = ['Category']
    const { includeProducts } = req.query;

    const categories = await dbFindAllCategory({
        product: includeProducts === BooleanString.true,
    });
    return res.status(200).json({
        success: true,
        data: {
            ...categories,
        },
    });
});

const getOneCategory = expressAsyncHandler(async (req, res) => {
    // #swagger.tags = ['Category']

    const { id } = req.params;
    const { includeProducts } = req.query;

    const category = await dbFindCategoryById(id, {
        product: includeProducts === BooleanString.true,
    });

    if (!category) {
        return res.status(404).json({
            success: false,
            error: {
                message: "Category not found",
            },
        });
    }

    return res.status(200).json({
        success: true,
        data: category,
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

    const newCategory = await dbCreateCategory({
        categoryName,
        description,
        createBy: req.authData.username,
        createById: req.authData.userId,
    });

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

    const updatedCategory = await dbUpdateCategory({
        id,
        categoryName,
        description,
        updateBy: req.authData.username,
        updateById: req.authData.userId,
    });

    return res.status(200).json({
        success: true,
        data: {
            message: `Category ${updatedCategory.categoryName} has been successfully updated`,
        },
    });
});

const deleteCategory = expressAsyncHandler(async (req, res) => {
    // #swagger.tags = ['Category']
    // Delete category
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
    const existCategory = await dbFindCategoryById(id, { product: true });
    if (!existCategory) {
        return res.status(404).json({
            success: false,
            error: {
                message: "Category not found",
            },
        });
    }
    console.log(existCategory);
    if (existCategory.product.length !== 0) {
        return res.status(409).json({
            success: false,
            error: {
                message:
                    "Cannot delete category with associated products. Please remove or update products first.",
            },
        });
    }

    const deleteCategory = await dbDeleteCategory(id);
    return res.status(200).json({
        success: true,
        data: {
            message: `Category ${deleteCategory.categoryName} has been successfully deleted`,
        },
    });
});

export {
    getAllCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    getOneCategory,
};
