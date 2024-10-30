import expressAsyncHandler from "express-async-handler";
import { dbFindAllProduct } from "../db/product.queries";

const getAllProduct = expressAsyncHandler(async (req, res) => {
    // #swagger.tags = ['Category']

    const products = await dbFindAllProduct();

    return res.status(200).json({
        success: true,
        data: products,
    });
});
