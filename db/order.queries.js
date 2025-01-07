import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const dbFindAllOrder = async () => {
    const orders = await prisma.order.findMany();
    return orders;
};

const dbCreateOrder = async ({
    orderStatus,
    paymentMethod,
    remark,
    orderType,
    orderDetails,
    discountPercentage,
    totalPrice,
    discount,
    grandTotal,
    couponCode,
    telephone,
    createBy,
    createById,
}) => {
    const orderHeader = await prisma.orderHeader.create({
        data: {
            orderDate: new Date(),
            totalPrice: totalPrice,
            grandTotal: grandTotal,
            orderStatus: orderStatus,
            paymentMethod: paymentMethod,
            remark: remark,
            orderType: orderType,
            ...(couponCode !== undefined && {
                discountPercentage: discountPercentage,
                couponCode: couponCode,
                discount: discount,
            }),

            telephone: telephone,
            createBy: createBy,
            createById: createById,

            orderDetail: {
                create: orderDetails.map((item) => ({
                    productId: item.productId,
                    productName: item.productName,
                    categoryName: item.categoryName,
                    orderQuantity: item.orderQuantity,
                    unitPrice: item.unitPrice,
                    totalPrice: item.totalPrice,
                })),
            },
        },
    });

    return orderHeader;
};

export { dbFindAllOrder, dbCreateOrder };
