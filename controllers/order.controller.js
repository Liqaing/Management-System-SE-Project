import expressAsyncHandler from "express-async-handler";
import { dbCreateOrder, dbFindAllOrder } from "../db/order.queries.js";
import { body } from "express-validator";
import { ROLES } from "../utils/constants.js";

const getAllOrder = expressAsyncHandler(async (req, res) => {
    const orders = await dbFindAllOrder();

    return res.status(200).json({
        success: true,
        data: {
            value: [...orders],
        },
    });
});

const createCounterOrder = expressAsyncHandler(async (req, res) => {
    const {
        paymentMethod,
        remark,
        orderType,
        items,
        discountPercentage,
        couponCode,
    } = req.body;

    if (req.authData.role != ROLES.adminRole) {
        return res.status(403).json({
            success: false,
            error: {
                message: "Unauthorize operation",
            },
        });
    }

    const orderHeader = await dbCreateOrder();

    return res.sendStatus(200);
});

export { getAllOrder, createCounterOrder };
