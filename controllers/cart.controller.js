import expressAsyncHandler from "express-async-handler";
import {
    dbCreateCart,
    dbFindCart,
    dbUpdateCartAdd,
} from "../db/cart.queries.js";
import { dbFindProductById } from "../db/product.queries.js";

const addCart = expressAsyncHandler(async (req, res) => {
    const { userId } = req.authData;
    const { productId } = req.body;
    let orderQuantity = req.body.orderQuantity;

    const product = await dbFindProductById(productId, { category: true });
    if (!product) {
        return res.status(404).json({
            success: false,
            error: {
                message:
                    "The product is not exist, Please input a valid product",
            },
        });
    }

    let existCart = await dbFindCart({
        userId,
        productId,
        isActive: true,
    });

    if (existCart) {
        orderQuantity += existCart.orderQuantity;
    }

    if (orderQuantity > product.qty) {
        return res.status(409).json({
            success: false,
            error: {
                message:
                    "The product is does not have enough quantity for order",
            },
        });
    }

    const totalPrice = orderQuantity * product.price;

    if (existCart) {
        existCart = await dbUpdateCartAdd({
            id: existCart.id,
            orderQuantity,
            unitPrice: product.price,
            totalPrice,
            updateById: userId,
            updateBy: req.authData.username,
        });
    } else {
        existCart = await dbCreateCart({
            productId,
            productName: product.productName,
            categoryName: product.category.categoryName,
            orderQuantity,
            unitPrice: product.price,
            totalPrice,
            isActive: true,
            userId,
            createBy: req.authData.username,
        });
    }

    return res.status(200).json({
        success: true,
        data: {
            value: existCart,
            message: `${product.productName} has been successfully add to cart`,
        },
    });
});

const removeCart = expressAsyncHandler(async (req, res) => {
    return res.status(200).json({
        success: true,
        data: {
            message: `has been successfully updated`,
        },
    });
});

export { addCart, removeCart };
