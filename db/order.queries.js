import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const dbFindAllOrderHeaders = async (includeOptions = {}, findOptions = {}) => {
    const orderHeaders = await prisma.orderHeader.findMany({
        ...includeOptions,
    });
    return orderHeaders;
};

const dbFindOrderHeader = async (findOptions = {}, includeOptions = {}) => {
    const orderHeader = await prisma.orderHeader.findFirst({
        where: {
            ...findOptions,
        },
        include: {
            ...includeOptions,
        },
    });
    return orderHeader;
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
            }),
            discount: discount,
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

const dbUpdateOrder = async (findOptions = {}, data = {}) => {
    const orderHeader = await prisma.orderHeader.update({
        where: {
            ...findOptions,
        },
        data: {
            ...data,
        },
    });
    return orderHeader;
};

export {
    dbFindAllOrderHeaders,
    dbCreateOrder,
    dbFindOrderHeader,
    dbUpdateOrder,
};
