import { Router } from "express";
import {
    createCategory,
    deleteCategory,
    getAllCategory,
    getOneCategory,
    updateCategory,
} from "../controllers/category.controller.js";
import { validateCategoryUpsert } from "../middlewares/validators/category.validator.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { validateParamId } from "../middlewares/validators/others.validator.js";
import { validateCategoryQueryParams } from "../middlewares/validators/category.validator.js";

const categoryRouter = Router();

/**
 * @swagger
 * /api/category:
 *   get:
 *     tags:
 *       - Category
 *     description: Retrieve all categories, optionally including associated products
 *     parameters:
 *       - in: query
 *         name: include[product]
 *         description: Object to specify what additional data to include in the response
 *         required: false
 *         style: deepObject
 *         explode: true
 *         schema:
 *           type: object
 *           properties:
 *             product:
 *               type: string
 *               enum: [true, false]
 *               description: Flag to include associated products
 *               default: "false"
 *     responses:
 *       200:
 *         description: Successfully retrieved all categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     value:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           name:
 *                             type: string
 *                             example: "Beverages"
 *                           description:
 *                             type: string
 *                             example: "Drinks and beverages"
 *       400:
 *         description: Bad request if invalid query parameters are provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Invalid query parameter"
 */
categoryRouter.get("/", validateCategoryQueryParams, getAllCategory);

/**
 * @swagger
 * /api/category/{id}:
 *   get:
 *     tags:
 *       - Category
 *     description: Retrieve a specific category by ID, optionally including associated products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the category to retrieve
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: include[product]
 *         description: Object to specify if associated products should be included in the response
 *         required: false
 *         style: deepObject
 *         explode: true
 *         schema:
 *           type: object
 *           properties:
 *             product:
 *               type: string
 *               enum: [true, false]
 *               description: Flag to include associated products
 *               default: "false"
 *     responses:
 *       200:
 *         description: Successfully retrieved the category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     value:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           name:
 *                             type: string
 *                             example: "Beverages"
 *                           description:
 *                             type: string
 *                             example: "Drinks and beverages"
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Category not found"
 *       400:
 *         description: Bad request if invalid query parameters are provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Invalid query parameter"
 */
categoryRouter.get(
    "/:id",
    validateParamId,
    validateCategoryQueryParams,
    getOneCategory
);

/**
 * @swagger
 * /api/category:
 *   post:
 *     tags:
 *       - Category
 *     description: Create a new category. Accessible only by admin and staff users.
 *     parameters:
 *       - in: body
 *         name: category
 *         description: Category information
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             categoryName:
 *               type: string
 *               description: The name of the category.
 *             description:
 *               type: string
 *               description: A description of the category.
 *     responses:
 *       201:
 *         description: Successfully created a new category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Category [categoryName] has been successfully created"
 *       403:
 *         description: Unauthorized operation, user is not an admin or staff
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Unauthorized operation"
 *       409:
 *         description: Category already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "This category already exists"
 */
categoryRouter.post("/", verifyToken, validateCategoryUpsert, createCategory);

/**
 * @swagger
 * /api/category/{id}:
 *   put:
 *     tags:
 *       - Category
 *     description: Update an existing category. Accessible only by admin and staff users.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the category to be updated
 *         schema:
 *           type: string
 *       - in: body
 *         name: category
 *         description: Updated category information
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             categoryName:
 *               type: string
 *               description: The new name of the category.
 *             description:
 *               type: string
 *               description: The new description of the category.
 *     responses:
 *       200:
 *         description: Successfully updated the category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Category [categoryName] has been successfully updated"
 *       403:
 *         description: Unauthorized operation, user is not an admin or staff
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Unauthorized operation"
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Category not found"
 *       409:
 *         description: Category with this name already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "A category with this name already exists"
 */
categoryRouter.put(
    "/:id",
    verifyToken,
    validateParamId,
    validateCategoryUpsert,
    updateCategory
);

/**
 * @swagger
 * /api/category/{id}:
 *   delete:
 *     tags:
 *       - Category
 *     description: Delete a category. Accessible only by admin and staff users. The category cannot be deleted if it has associated products.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the category to be deleted
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully deleted the category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Category [categoryName] has been successfully deleted"
 *       403:
 *         description: Unauthorized operation, user is not an admin or staff
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Unauthorized operation"
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Category not found"
 *       409:
 *         description: Category has associated products and cannot be deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Cannot delete category with associated products. Please remove or update products first."
 */
categoryRouter.delete("/:id", verifyToken, validateParamId, deleteCategory);

export { categoryRouter };
