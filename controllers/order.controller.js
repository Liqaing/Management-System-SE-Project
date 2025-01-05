import expressAsyncHandler from "express-async-handler";
import { dbCreateOrder, dbFindAllOrder } from "../db/order.queries.js";
import { body } from "express-validator";
import { OrderStatus, ROLES } from "../utils/constants.js";
import {
    dbFindProductById,
    dbUpdateProductQty,
} from "../db/product.queries.js";
import {
    dbFindCouponByCode,
    dbFindCouponById,
    dbUpdateCouponUsage,
} from "../db/coupon.queries.js";

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
    const { paymentMethod, remark, orderType, items, couponId } = req.body;

    if (req.authData.role != ROLES.adminRole) {
        return res.status(403).json({
            success: false,
            error: {
                message: "Unauthorize operation",
            },
        });
    }

    let coupon = null;
    if (couponId) {
        coupon = await dbFindCouponById(couponId);
        if (!coupon) {
            return res.status(409).json({
                success: false,
                error: {
                    message: `Order Coupon ${coupon}} does not exist`,
                },
            });
        }

        if (
            coupon.limitUsange <= 0 ||
            coupon.expireDate < new Date() ||
            coupon.effectiveDate > new Date()
        ) {
            return res.status(409).json({
                success: false,
                error: {
                    message: `Order Coupon ${coupon}} is not available, please check expire and effective date and limited usage`,
                },
            });
        }

        await dbUpdateCouponUsage(couponId, {
            decrement: 1,
        });
    }

    // Decrement qty of product and construct orderDeatial obj
    const orderDetails = [];
    items.forEach(async (item) => {
        const product = await dbFindProductById(item.productId);
        if (item.orderQuantity > product.qty) {
            return res.status(409).json({
                success: false,
                error: {
                    message: `Order Product ${item.productName}} does not have enough in stock`,
                },
            });
        }

        await dbUpdateProductQty(item.productId, {
            decrement: item.orderQuantity,
        });

        const orderDetail = {
            productId: item.productId,
            productName: item.productName,
            categoryName: item.categoryName,
            orderQuantity: item.orderQuantity,
            unitPrice: product.price,
            totalPrice: item.orderQuantity * product.price,
        };
        orderDetails.push(orderDetail);
    });

    // Calculate order total price
    let totalPrice = orderDetails.reduce(
        (totalSum, orderDetail) => totalSum + orderDetail.totalPrice,
        0
    );

    if (coupon) {
        totalPrice * (coupon.DiscountPercentage / 100);
    }

    const orderHeader = await dbCreateOrder({
        paymentMethod,
        remark,
        orderType,
        orderStatus: OrderStatus.preparing,
        orderDetails,
        ...(coupon && {
            couponCode: coupon.couponCode,
            discountPercentage: coupon.discountPercentage,
        }),
        telephone: telephone,
        totalPrice: totalPrice,
    });

    return res.status(201).json({
        success: true,
        data: {
            message: `Order Id ${orderHeader.id} has been successfully placed`,
        },
    });
});

export { getAllOrder, createCounterOrder };
