import expressAsyncHandler from "express-async-handler";
import {
    dbCreatProduct,
    dbDeleteProduct,
    dbDeleteProductImage,
    dbFindAllProduct,
    dbFindProductById,
    dbFindProductImageById,
    dbUpdateProduct,
} from "../db/product.queries.js";
import { dbFindCategoryById } from "../db/cateogory.queries.js";
import { BooleanString, ROLES } from "../utils/constants.js";
import {
    checkImageType,
    constructUrl,
    productImageUrl,
} from "../utils/utils.js";

const getAllProduct = expressAsyncHandler(async (req, res) => {
    const { include = {} } = req.query;
    const { search = {} } = req.query;

    const products = await dbFindAllProduct(
        {
            category: include.category === BooleanString.true,
            productImage: include.productImage === BooleanString.true,
        },
        {
            productName: { contains: search.productName, mode: "insensitive" },
        }
    );

    // Use product iuamge id to construct a image url
    // which is point to an endpoint that return image
    if (include.productImage === BooleanString.true) {
        const url = constructUrl(req);
        products.forEach((product) => {
            product.productImage.forEach((image) => {
                image.imageUrl = productImageUrl(url, image.id);
            });
        });
    }

    return res.status(200).json({
        success: true,
        data: {
            value: [...products],
        },
    });
});

const getOneProduct = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    const { include = {} } = req.query;

    const product = await dbFindProductById(id, {
        category: include.category === BooleanString.true,
        productImage: include.productImage === BooleanString.true,
    });

    if (!product) {
        return res.status(404).json({
            success: false,
            error: {
                message: "The product does not exist",
            },
        });
    }

    if (include.productImage === BooleanString.true) {
        const url = constructUrl(req);
        product.productImage.forEach((image) => {
            image.imageUrl = productImageUrl(url, image.id);
        });
    }

    return res.status(200).json({
        success: true,
        data: {
            value: product,
        },
    });
});

const createProduct = expressAsyncHandler(async (req, res) => {
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
        return res.status(404).json({
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

    const existProduct = await dbFindProductById(id);
    if (!existProduct) {
        return res.status(404).json({
            success: false,
            error: {
                message: "Product not found",
            },
        });
    }

    const deleteProduct = await dbDeleteProduct(id);
    return res.status(200).json({
        success: true,
        data: {
            message: `Product ${deleteProduct.productName} has been successfully deleted`,
        },
    });
});

const updateProduct = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    const { productName, description, price, categoryId } = req.body;

    // Parsing and validator imagesToDeleteId as array of integer
    if (typeof req.body.imagesToDeleteId === "string") {
        req.body.imagesToDeleteId = req.body.imagesToDeleteId
            .split(",")
            .map((id) => parseInt(id.trim(), 10))
            .filter(Number.isInteger);
    }

    if (!Array.isArray(req.body.imagesToDeleteId)) {
        return res.status(422).json({
            success: false,
            error: {
                message: "Please input a list of product image ids to delete",
            },
        });
    }

    req.body.imagesToDeleteId.map((id) => {
        if (!Number.isInteger(id)) {
            return res.status(422).json({
                success: false,
                error: {
                    message: "Invalid, Please provide a valid image id",
                },
            });
        }
    });

    const imagesToDeleteId = req.body.imagesToDeleteId;
    const productImages = req.files;

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

    const product = await dbFindProductById(id);
    if (!product) {
        return res.status(404).json({
            success: false,
            error: {
                message:
                    "The product is not exist, Please input a valid product",
            },
        });
    }

    const category = await dbFindCategoryById(categoryId);
    if (!category) {
        return res.status(404).json({
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

    if (imagesToDeleteId) {
        imagesToDeleteId.map(async (id) => {
            try {
                await dbDeleteProductImage(id);
            } catch (err) {
                // pass, unable to delete image, maybe due to iamge not exist or other cause
            }
        });
    }

    const updatedProduct = await dbUpdateProduct({
        id,
        productName,
        description,
        price,
        categoryId,
        updateBy: req.authData.username,
        updateById: req.authData.userId,
        productImages,
    });

    return res.status(200).json({
        success: true,
        data: {
            message: `Product ${updatedProduct.productName} has been successfully updated`,
        },
    });
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
    updateProduct,
    getSearchProduct,
};
