import expressAsyncHandler from "express-async-handler";
import {
    dbCreateCart,
    dbDeleteCart,
    dbFindCart,
    dbUpdateCartAdd,
    dbUpdateCartRemove,
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
        if (existCart.userId !== userId) {
            return res.status(403).json({
                success: false,
                error: {
                    message: "Unauthorize operation",
                },
            });
        }

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
    const { userId } = req.authData;
    const { cartId, deleteAll } = req.body;

    const cart = await dbFindCart({
        id: cartId,
    });

    if (!cart) {
        return res.status(404).json({
            success: false,
            error: {
                message: "This item deos not exist in cart",
            },
        });
    }

    if (cart.userId !== userId) {
        return res.status(403).json({
            success: false,
            error: {
                message: "Unauthorize operation",
            },
        });
    }

    if (cart.orderQuantity === 1 || deleteAll === true) {
        // delete cart
        await dbDeleteCart(id);

        return res.status(200).json({
            success: true,
            data: {
                message: `${cart.productName} has been successfully remove from cart`,
            },
        });
    } else {
        const updateCart = await dbUpdateCartRemove({
            id: cartId,
            updateById: userId,
            updateBy: req.authData.username,
        });

        return res.status(200).json({
            success: true,
            data: {
                value: updateCart,
                message: `${cart.productName} has been successfully remove from cart`,
            },
        });
    }
});

export { addCart, removeCart };
