import expressAsyncHandler from "express-async-handler";
import { dbCreatProduct, dbFindAllProduct } from "../db/product.queries.js";
import { dbFindCategoryById } from "../db/cateogory.queries.js";
import upload from "../config/multer.config.js";
import { ROLES } from "../utils/constants.js";

const getAllProduct = expressAsyncHandler(async (req, res) => {
    // #swagger.tags = ['Product']

    const products = await dbFindAllProduct();

    return res.status(200).json({
        success: true,
        data: products,
    });
});

const createProduct = expressAsyncHandler(async (req, res) => {
    /* #swagger.tags = ['Product']
           #swagger.description = 'Endpoint to create a product with image uploads in the request body.'
           #swagger.requestBody = {
               content: {
                   "multipart/form-data": {
                       schema: {
                           type: "object",
                           properties: {
                               productName: { type: "string", description: "Name of the product" },
                               description: { type: "string", description: "Product description" },
                               price: { type: "number", description: "Product price" },
                               categoryId: { type: "integer", description: "ID of the product category" },
                               userImage: {
                                   type: "array",
                                   items: {
                                       type: "string",
                                       format: "binary",
                                   },
                                   description: "Upload up to 10 images in JPEG or PNG format for the product.",
                               },
                           },
                           required: ["productName", "price", "categoryId", "userImage"],
                       },
                   },
               },
           }
        */
    const { productName, description, price, categoryId } = req.body;
    const productImages = req.files;

    if (req.authData.role != ROLES.adminRole) {
        return res.status(403).json({
            success: false,
            error: {
                message: "Unauthorize operation",
            },
        });
    }

    const category = await dbFindCategoryById(categoryId);
    if (!category) {
        return res.status(415).json({
            success: false,
            error: {
                message:
                    "The category is not exist, Please input a valid category",
            },
        });
    }

    if (productImages) {
        productImages.forEach((productImage) => {
            if (
                productImage.mimetype != "image/jpeg" &&
                productImage.mimetype != "image/png"
            ) {
                return res.status(415).json({
                    success: false,
                    error: {
                        message: "Only JPEG and PNG files are allowed",
                    },
                });
            }
        });
    }

    const newProduct = await dbCreatProduct({
        productName,
        description,
        price,
        categoryId,
        createBy: req.authData.username,
        createById: req.authData.userId,
        productImages,
    });

    return res.status(201).json({
        success: true,
        data: {
            message: `Product ${newProduct.productName} has been successfully created`,
        },
    });
});

export { getAllProduct, createProduct };
