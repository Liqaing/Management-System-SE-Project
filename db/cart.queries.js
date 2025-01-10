import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const dbFindCartByUserId = async (userId, findOptions = {}) => {
    const cart = await prisma.cart.findFirst({
        where: {
            userId,
            ...findOptions,
        },
    });

    return cart;
};

const dbCreateCart = async ({
    productId,
    productName,
    categoryName,
    orderQuantity,
    unitPrice,
    totalPrice,
    isActive,
    userId,
    createBy,
}) => {
    const cart = await prisma.cart.create({
        data: {
            productId,
            productName,
            categoryName,
            orderQuantity,
            unitPrice,
            totalPrice,
            isActive,
            userId,
            createAt: new Date(),
            createBy,
            createById: userId,
        },
    });
    return cart;
};

const dbUpdateCartAdd = async ({
    id,
    orderQuantity,
    unitPrice,
    totalPrice,
    updateById,
    updateBy,
}) => {
    const cart = prisma.cart.update({
        where: {
            id: id,
        },
        data: {
            orderQuantity,
            unitPrice,
            totalPrice,
            updateAt: new Date(),
            updateBy: updateBy,
            updateById: updateById,
        },
    });

    return cart;
};

export { dbCreateCart, dbUpdateCartAdd, dbFindCartByUserId };
