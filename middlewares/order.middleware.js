import { dbFindOrderHeader } from "../db/order.queries.js";
import { OrderStatus } from "../utils/constants.js";

const validateOrderPaymentStatus = async (req, res, next) => {
    const orderHeaderId = req.query;

    const order = await dbFindOrderHeader({ id: orderHeaderId });
    if (order !== OrderStatus.pendingPayment) {
        return res.status(400).json({
            success: false,
            error: "This order is no longer valid.",
        });
    }
    next();
};

export { validateOrderPaymentStatus };
