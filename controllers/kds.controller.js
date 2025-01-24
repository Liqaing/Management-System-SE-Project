import expressAsyncHandler from "express-async-handler";
import { dbFindAllOrderHeaders } from "../db/order.queries.js";
import { OrderStatus } from "../utils/constants.js";

const getAllPreparingOrder = expressAsyncHandler(async (req, res) => {
    // Return all order currently in preparing status

    const { include = {} } = req.query;

    const orderHeaders = await dbFindAllOrderHeaders(
        {
            include: {
                orderDetail: true,
            },
        },
        {
            orderStatus: OrderStatus.preparing,
        }
    );

    return res.status(200).json({
        success: true,
        data: {
            value: [...orderHeaders],
        },
    });
});

export { getAllPreparingOrder };
