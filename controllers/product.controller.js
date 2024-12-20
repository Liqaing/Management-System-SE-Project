import expressAsyncHandler from "express-async-handler";
import {
    dbCreatProduct,
    dbFindAllProduct,
    dbFindProductById,
    dbFindProductImageById,
} from "../db/product.queries.js";
import { dbFindCategoryById } from "../db/cateogory.queries.js";
import { BooleanString, ROLES } from "../utils/constants.js";
import { checkImageType, constructUrl } from "../utils/utils.js";

const getAllProduct = expressAsyncHandler(async (req, res) => {
    // #swagger.tags = ['Product']
    const { includeCategory, includeProductImage } = req.query;

    const products = await dbFindAllProduct({
        category: includeCategory === BooleanString.true,
        productImage: includeProductImage === BooleanString.true,
    });

    // Use product iuamge id to construct a image url
    // which is point to an endpoint that return image
    if (includeProductImage === BooleanString.true) {
        const url = constructUrl(req);
        products.forEach((product) => {
            product.productImage.forEach((image) => {
                const imageUrl = `${url}/api/product/image/${image.id}`;
                image.imageUrl = imageUrl;
            });
        });
    }

    return res.status(200).json({
        success: true,
        data: products,
    });
});

const getOneProduct = expressAsyncHandler(async (req, res) => {
    // #swagger.tags = ['Product']
    const { id } = req.params;
    const { includeCategory, includeProductImage } = req.query;

    const product = await dbFindProductById(id, {
        category: includeCategory === BooleanString.true,
        productImage: includeProductImage === BooleanString.true,
    });

    if (includeProductImage === BooleanString.true) {
        const url = constructUrl(req);
        product.productImage.forEach((image) => {
            const imageUrl = `${url}/api/product/image/${image.id}`;
            image.imageUrl = imageUrl;
        });
    }

    return res.status(200).json({
        success: true,
        data: product,
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

const deleteProduct = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    return;
});

const getProductImage = expressAsyncHandler(async (req, res) => {
    // response product image
    const { id } = req.params;
    const productImage = await dbFindProductImageById(id);

    if (!productImage) {
        return res.sendStatus(404);
    }

    const image = productImage.image;
    const imageType = checkImageType(image);
    res.set("Content-Type", imageType);
    res.status(200).send(image);
});

export {
    getAllProduct,
    createProduct,
    getProductImage,
    getOneProduct,
    deleteProduct,
};
