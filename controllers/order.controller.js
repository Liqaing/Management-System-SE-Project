import expressAsyncHandler from "express-async-handler";
import { dbFindAllOrder } from "../db/order.queries.js";

const getAllOrder = expressAsyncHandler(async (req, res) => {
    const orders = await dbFindAllOrder();

    return res.status(200).json({
        success: true,
        data: {
            value: [...orders],
        },
    });
});

const createOrder = expressAsyncHandler(async (req, res) => {});

export { getAllOrder, createOrder };
