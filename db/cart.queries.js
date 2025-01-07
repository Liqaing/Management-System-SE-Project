import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const dbCreateCart = async ({
    id,
    productId,
    orderQuantity,
    unitPrice,
    totalPrice,
    cartStatus,
    usersId,
    createBy,
}) => {
    const cart = await prisma.cart.create({
        data: {},
    });
    return cart;
};

const dbUpdateCart = async ({}) => {};

export { dbCreateCart, dbUpdateCart };
