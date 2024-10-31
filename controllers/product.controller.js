import expressAsyncHandler from "express-async-handler";
import { dbCreatProduct, dbFindAllProduct } from "../db/product.queries.js";

const getAllProduct = expressAsyncHandler(async (req, res) => {
    // #swagger.tags = ['Product']

    const products = await dbFindAllProduct();

    return res.status(200).json({
        success: true,
        data: products,
    });
});

const createProduct = expressAsyncHandler(async (req, res) => {
    // #swagger.tags = ['Product']

    const { productName, description, price, categoryId } = req.body;
    const newProduct = await dbCreatProduct({
        productName,
        description,
        price,
        categoryId,
        createBy: req.authData.username,
        createById: req.authData.userId,
    });
    return res.status(201).json({
        success: true,
        data: {
            message: `Product ${newProduct.productName} has been successfully created`,
        },
    });
});

export { getAllProduct, createProduct };
