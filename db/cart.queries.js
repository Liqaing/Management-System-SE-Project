import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const dbFindCart = async (findOptions = {}) => {
    const cart = await prisma.cart.findFirst({
        where: {
            ...findOptions,
        },
    });

    return cart;
};

const dbFindAllCart = async (findOptions = {}) => {
    const carts = await prisma.cart.findMany({
        where: {
            ...findOptions,
        },
    });
    return carts;
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
    const cart = await prisma.cart.update({
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

const dbUpdateCartRemove = async ({ id, updateById, updateBy }) => {
    const cart = await prisma.cart.update({
        where: {
            id: id,
        },
        data: {
            orderQuantity: {
                decrement: 1,
            },
            updateAt: new Date(),
            updateBy: updateBy,
            updateById: updateById,
        },
    });

    return cart;
};

const dbDeleteCart = async (id) => {
    const cart = prisma.cart.delete({
        where: {
            id: id,
        },
    });
    return cart;
};

export {
    dbCreateCart,
    dbUpdateCartAdd,
    dbFindCart,
    dbUpdateCartRemove,
    dbDeleteCart,
    dbFindAllCart,
};
