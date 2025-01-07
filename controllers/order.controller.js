import expressAsyncHandler from "express-async-handler";
import { dbCreateOrder, dbFindAllOrder } from "../db/order.queries.js";
import { OrderStatus, PaymentMethod, ROLES } from "../utils/constants.js";
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
    const { paymentMethod, remark, orderType, items, couponId, telephone } =
        req.body;

    if (
        req.authData.role != ROLES.adminRole &&
        req.authData.role != ROLES.staffRole
    ) {
        return res.status(403).json({
            success: false,
            error: {
                message: "Unauthorize operation",
            },
        });
    }

    if (
        paymentMethod != PaymentMethod.cash &&
        paymentMethod != PaymentMethod.qr
    ) {
        return res.status(403).json({
            success: false,
            error: {
                message: "Invalid Payment Method",
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
                    message: `Order Coupon does not exist`,
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
                    message: `Order Coupon ${coupon.couponCode} is not available, please check expire and effective date and limited usage`,
                },
            });
        }
    }

    // caculate individual product price and construct orderDeatial obj
    const orderDetails = [];
    for (const item of items) {
        const product = await dbFindProductById(item.productId);
        if (!product) {
            return res.status(409).json({
                success: false,
                error: {
                    message: `Product ${item.productName} is not exist`,
                },
            });
        }

        if (item.orderQuantity > product.qty) {
            return res.status(409).json({
                success: false,
                error: {
                    message: `Order Product ${item.productName}} does not have enough in stock`,
                },
            });
        }

        const orderDetail = {
            productId: item.productId,
            productName: item.productName,
            categoryName: item.categoryName,
            orderQuantity: item.orderQuantity,
            unitPrice: product.price,
            totalPrice: item.orderQuantity * product.price,
        };
        console.log(orderDetail);
        orderDetails.push(orderDetail);
    }

    // Calculate order total price
    let totalPrice = orderDetails.reduce(
        (totalSum, orderDetail) => totalSum + orderDetail.totalPrice,
        0
    );

    // Calculate discount if have
    let discount = 0;
    let grandTotal = totalPrice;
    if (coupon) {
        discount = (totalPrice * coupon.DiscountPercentage) / 100;
        grandTotal -= discount;
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
            discount,
        }),
        telephone: telephone,
        totalPrice: totalPrice,
        grandTotal,
    });

    // Reduce product qty
    items.forEach(async (item) => {
        await dbUpdateProductQty(item.productId, {
            decrement: item.orderQuantity,
        });
    });

    if (coupon) {
        await dbUpdateCouponUsage(couponId, {
            decrement: 1,
        });
    }

    return res.status(201).json({
        success: true,
        data: {
            orderId: orderHeader.id,
            orderStatus: orderHeader.orderStatus,
            totalPrice: orderHeader.totalPrice,
            message: `Order Id ${orderHeader.id} has been successfully placed`,
        },
    });
});

export { getAllOrder, createCounterOrder };
