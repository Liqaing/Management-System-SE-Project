import expressAsyncHandler from "express-async-handler";
import { dbFindAllOrderHeaders } from "../db/order.queries.js";
import { OrderStatus } from "../utils/constants.js";

const getAllPreparingOrder = expressAsyncHandler(async (req, res) => {
    // Return all order currently in preparing status

    const { include = {}, orderBy = {} } = req.query;

    const orderHeaders = await dbFindAllOrderHeaders(
        {
            orderDetail: true,
        },
        {
            orderStatus: OrderStatus.preparing,
        },
        [{ id: "desc" }]
    );

    return res.status(200).json({
        success: true,
        data: {
            value: [...orderHeaders],
        },
    });
});

export { getAllPreparingOrder };
