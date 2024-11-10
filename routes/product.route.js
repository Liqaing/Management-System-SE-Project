import { Router } from "express";
import {
    createProduct,
    deleteProduct,
    getAllProduct,
    getOneProduct,
    getProductImage,
    updateProduct,
} from "../controllers/product.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
    validateProductUpSert,
    validateProductQueryParams,
} from "../middlewares/validators/product.validator.js";
import upload from "../config/multer.config.js";
import { validateParamId } from "../middlewares/validators/others.validator.js";

const productRouter = Router();

/**
 * @swagger
 * /api/product:
 *   get:
 *     tags:
 *       - Product
 *     description: Retrieve all products, optionally including associated categories and product images.
 *     parameters:
 *       - in: query
 *         name: include[category]
 *         required: false
 *         description: Flag to include associated categories for each product
 *         schema:
 *           type: string
 *           enum: [true, false]
 *           default: "false"
 *       - in: query
 *         name: include[productImage]
 *         required: false
 *         description: Flag to include product images for each product
 *         schema:
 *           type: string
 *           enum: [true, false]
 *           default: "false"
 *       - in: query
 *         name: search[productName]
 *         required: false
 *         description: The product name to search for
 *         schema:
 *           type: string
 *           example: "product a"
 *     responses:
 *       200:
 *         description: Successfully retrieved all products
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
 *                             example: "Burger"
 *                           description:
 *                             type: string
 *                             example: "A delicious beef burger"
 *                           category:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                                 example: 1
 *                               name:
 *                                 type: string
 *                                 example: "Fast Food"
 *                           productImage:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 id:
 *                                   type: integer
 *                                   example: 101
 *                                 imageUrl:
 *                                   type: string
 *                                   example: "https://example.com/images/101"
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
 *                       example: "Invalid query parameters"
 */
productRouter.get("/", validateProductQueryParams, getAllProduct);

/**
 * @swagger
 * /api/product/{id}:
 *   get:
 *     tags:
 *       - Product
 *     description: Retrieve a single product by its ID, optionally including associated category and product images.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the product to retrieve
 *         schema:
 *           type: integer
 *       - in: query
 *         name: include[category]
 *         required: false
 *         description: Flag to include associated category in the response
 *         schema:
 *           type: string
 *           enum: [true, false]
 *           default: "false"
 *       - in: query
 *         name: include[productImage]
 *         required: false
 *         description: Flag to include product images in the response
 *         schema:
 *           type: string
 *           enum: [true, false]
 *           default: "false"
 *     responses:
 *       200:
 *         description: Successfully retrieved the product
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
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         name:
 *                           type: string
 *                           example: "Burger"
 *                         description:
 *                           type: string
 *                           example: "A delicious beef burger"
 *                         category:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                               example: 1
 *                             name:
 *                               type: string
 *                               example: "Fast Food"
 *                         productImage:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                                 example: 101
 *                               imageUrl:
 *                                 type: string
 *                                 example: "https://example.com/images/101"
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
 *                       example: "Invalid query parameters"
 *       404:
 *         description: Product not found
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
 *                       example: "The product does not exist"
 */
productRouter.get(
    "/:id",
    validateParamId,
    validateProductQueryParams,
    getOneProduct
);

/**
 * @swagger
 * /api/product:
 *   post:
 *     tags:
 *       - Product
 *     description: Create a new product. Accessible only by admin users.
 *     parameters:
 *       - in: body
 *         name: product
 *         description: Product information
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             productName:
 *               type: string
 *               description: The name of the product.
 *               example: "Cheeseburger"
 *             description:
 *               type: string
 *               description: A description of the product.
 *               example: "A delicious cheeseburger with fresh ingredients."
 *             price:
 *               type: number
 *               format: float
 *               description: Price of the product.
 *               example: 5.99
 *             qty:
 *               type: number
 *               format: integer
 *               description: quantity of a product.
 *               example: 1
 *             categoryId:
 *               type: integer
 *               description: ID of the category the product belongs to.
 *               example: 1
 *             productImages:
 *               type: array
 *               items:
 *                 type: string
 *                 description: Base64 encoded image string of the product image.
 *                 example: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
 *     responses:
 *       201:
 *         description: Successfully created a new product
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
 *                       example: "Product Cheeseburger has been successfully created"
 *       403:
 *         description: Unauthorized operation, user is not an admin
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
 *                       example: "The category does not exist, Please input a valid category"
 *       415:
 *         description: Unsupported media type for product images
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
 *                       example: "Only JPEG and PNG files are allowed"
 */
productRouter.post(
    "/",
    verifyToken,
    upload.array("productImages", 8),
    validateProductUpSert,
    createProduct
);

/**
 * @swagger
 * /api/product/{id}:
 *   put:
 *     tags:
 *       - Product
 *     description: Update an existing product. Accessible only by admin or staff users.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the product to be updated.
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: body
 *         name: product
 *         description: Product information for update.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             productName:
 *               type: string
 *               description: The name of the product.
 *               example: "Cheeseburger Deluxe"
 *             description:
 *               type: string
 *               description: A description of the product.
 *               example: "An upgraded cheeseburger with extra toppings."
 *             price:
 *               type: number
 *               format: float
 *               description: Price of the product.
 *               example: 7.99
 *             qty:
 *               type: number
 *               format: integer
 *               description: quantity of a product.
 *               example: 1
 *             categoryId:
 *               type: integer
 *               description: ID of the category the product belongs to.
 *               example: 1
 *             imagesToDeleteId:
 *               type: array
 *               items:
 *                 type: integer
 *               description: List of image IDs to delete from the product.
 *               example: [1, 3]
 *             productImages:
 *               type: array
 *               items:
 *                 type: string
 *                 description: Base64 encoded string for the product image.
 *                 example: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
 *     responses:
 *       200:
 *         description: Successfully updated the product
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
 *                       example: "Product Cheeseburger Deluxe has been successfully updated"
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
 *         description: Product or category not found
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
 *                       example: "The product or category does not exist, please provide valid IDs"
 *       415:
 *         description: Unsupported media type for product images
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
 *                       example: "Only JPEG and PNG files are allowed"
 */
productRouter.put(
    "/:id",
    verifyToken,
    upload.array("productImages", 8),
    validateParamId,
    validateProductUpSert,
    updateProduct
);

/**
 * @swagger
 * /api/product/{id}:
 *   delete:
 *     tags:
 *       - Product
 *     description: Delete a product by its ID. Accessible only by admin or staff users.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the product to delete.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Successfully deleted the product
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
 *                       example: "Product Cheeseburger has been successfully deleted"
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
 *         description: Product not found
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
 *                       example: "Product not found"
 */
productRouter.delete("/:id", verifyToken, validateParamId, deleteProduct);

/**
 * @swagger
 * /api/product/image/{id}:
 *   get:
 *     tags:
 *       - Product
 *     description: Retrieve a product image by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the product image to retrieve.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Successfully retrieved the product image
 *         content:
 *           image/jpeg:
 *             schema:
 *               type: string
 *               format: binary
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Product image not found
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
 *                       example: "Product image not found"
 */
productRouter.get("/image/:id", validateParamId, getProductImage);

export { productRouter };
