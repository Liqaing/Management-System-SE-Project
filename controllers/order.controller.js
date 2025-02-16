import expressAsyncHandler from "express-async-handler";
import {
    dbCreateOrder,
    dbFindAllOrderHeaders,
    dbFindOrderHeader,
    dbUpdateOrder,
} from "../db/order.queries.js";
import {
    BooleanString,
    CouponType,
    OrderStatus,
    PaymentMethod,
    ROLES,
} from "../utils/constants.js";
import {
    dbFindProductById,
    dbUpdateProductQty,
} from "../db/product.queries.js";
import { dbFindCouponById, dbUpdateCouponUsage } from "../db/coupon.queries.js";
import { dbFindAllCart, dbUpdateCartStatus } from "../db/cart.queries.js";
import { dbFindUserById } from "../db/user.queries.js";
import stripe from "../config/stipe.config.js";
import { constructUrl } from "../utils/utils.js";

const getAllOrder = expressAsyncHandler(async (req, res) => {
    const { include = {} } = req.query;

    const orders = await dbFindAllOrderHeaders({
        include: {
            orderDetail: include.OrderDetail === BooleanString.true,
        },
    });

    return res.status(200).json({
        success: true,
        data: {
            value: [...orders],
        },
    });
});

const createCounterOrder = expressAsyncHandler(async (req, res) => {
    const { paymentMethod, remark, items, couponId, telephone } = req.body;

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

        if (coupon.limitUsange <= 0 || coupon.expireDate < new Date()) {
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
        orderType: "Counter",
        orderStatus: OrderStatus.preparing,
        orderDetails,
        ...(coupon && {
            couponCode: coupon.couponCode,
            discountPercentage: coupon.discountPercentage,
        }),
        discount,
        telephone: telephone,
        totalPrice: totalPrice,
        grandTotal,
    });

    // Reduce product qty
    items.forEach((item) => {
        dbUpdateProductQty(item.productId, {
            decrement: item.orderQuantity,
        });
    });

    if (coupon) {
        dbUpdateCouponUsage(
            { id: couponId },
            {
                decrement: 1,
            }
        );
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

const createOnlineOrder = expressAsyncHandler(async (req, res) => {
    const { paymentMethod, remark, couponId } = req.body;
    const { userId } = req.authData;

    // Find user and address (todo)
    const user = await dbFindUserById(userId);

    if (
        paymentMethod != PaymentMethod.cash &&
        paymentMethod != PaymentMethod.card
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

        if (coupon.couponType !== CouponType.online) {
            if (!coupon) {
                return res.status(409).json({
                    success: false,
                    error: {
                        message: `This Coupon cannot be use for online order`,
                    },
                });
            }
        }

        if (coupon.limitUsange <= 0 || coupon.expireDate < new Date()) {
            return res.status(409).json({
                success: false,
                error: {
                    message: `Order Coupon ${coupon.couponCode} is not available`,
                },
            });
        }
    }

    const carts = await dbFindAllCart({ userId, isActive: true });
    if (carts.length === 0) {
        return res.status(409).json({
            success: false,
            error: {
                message: `You don't have any item in your cart`,
            },
        });
    }

    const orderDetails = [];
    for (const cart of carts) {
        const product = await dbFindProductById(cart.productId, {
            category: true,
        });

        if (!product) {
            return res.status(409).json({
                success: false,
                error: {
                    message: `Product ${cart.productName} is not exist`,
                },
            });
        }

        if (cart.orderQuantity > product.qty) {
            return res.status(409).json({
                success: false,
                error: {
                    message: `Order Product ${cart.productName}} does not have enough in stock`,
                },
            });
        }

        const orderDetail = {
            productId: cart.productId,
            productName: product.productName,
            categoryName: product.category.categoryName,
            orderQuantity: cart.orderQuantity,
            unitPrice: product.price,
            totalPrice: cart.orderQuantity * product.price,
        };
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

    // Checkout
    const lineItems = orderDetails.map((item) => ({
        price_data: {
            currency: "usd",
            unit_amount: Math.round(item.unitPrice * 100),
            product_data: {
                name: item.productName,
                description: item.categoryName,
                // images: ["https://example.com/t-shirt.png"],
            },
        },
        quantity: item.orderQuantity,
    }));

    // if (discount > 0) {
    //     lineItems.push({
    //         price_data: {
    //             currency: "usd",
    //             product_data: { name: "Discount" },
    //             unit_amount: Math.round(-discount * 100), // Negative amount for discount
    //         },
    //         quantity: 1,
    //     });
    // }

    const orderHeader = await dbCreateOrder({
        paymentMethod,
        remark,
        orderType: "Online",
        orderStatus: OrderStatus.pendingPayment,
        orderDetails,
        ...(coupon && {
            couponCode: coupon.couponCode,
            discountPercentage: coupon.discountPercentage,
            discount,
        }),
        telephone: user.telephone,
        totalPrice: totalPrice,
        grandTotal,
    });

    carts.forEach((cart) => {
        // Reduce product qty
        dbUpdateProductQty(cart.productId, {
            decrement: cart.orderQuantity,
        });

        // update cart status inactive
        dbUpdateCartStatus(cart.id, false);
    });

    if (coupon) {
        dbUpdateCouponUsage(
            { id: couponId },
            {
                decrement: 1,
            }
        );
    }

    const url = constructUrl(req);
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: `${url}/api/order/online/success?orderHeaderId=${orderHeader.id}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${url}/api/order/online/cancel?orderHeaderId=${orderHeader.id}&session_id={CHECKOUT_SESSION_ID}`,
        ...(coupon && {
            discounts: [
                {
                    coupon: coupon.couponCode,
                },
            ],
        }),
        metadata: {
            userId,
            remark,
            couponId: coupon?.id || null,
        },
    });

    return res.status(200).json({
        success: true,
        data: {
            orderId: orderHeader.id,
            orderStatus: orderHeader.orderStatus,
            totalPrice: orderHeader.totalPrice,
            paymentSessionUrl: session.url,
            message: `Order Id ${orderHeader.id} has been successfully placed`,
        },
    });
});

const onlineOrderCancel = expressAsyncHandler(async (req, res) => {
    const { orderHeaderId, session_id } = req.query;

    const orderHeader = await dbFindOrderHeader(
        { id: orderHeaderId },
        { orderDetail: true }
    );

    if (orderHeader.orderStatus === OrderStatus.cancel) {
        return res.status(400).json({
            success: true,
            data: {
                message: `Your Order has been already been cancelled`,
            },
        });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);

    // Update order cancel
    await dbUpdateOrder(
        { id: orderHeader.id },
        { orderStatus: OrderStatus.cancel, SessionId: session.id }
    );

    orderHeader.orderDetail.forEach((item) => {
        // Increase product qty back
        dbUpdateProductQty(item.productId, {
            increment: item.orderQuantity,
        });
    });

    if (orderHeader.couponCode) {
        dbUpdateCouponUsage(
            { couponCode: orderHeader.couponCode },
            {
                increment: 1,
            }
        );
    }

    return res.status(200).json({
        success: true,
        data: {
            message: `Your Order has been successfully cancelled`,
        },
    });
});

export {
    getAllOrder,
    createCounterOrder,
    createOnlineOrder,
    onlineOrderCancel,
};
