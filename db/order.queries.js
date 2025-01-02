import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const dbFindAllOrder = async () => {
    const orders = await prisma.order.findMany();
    return orders;
};

export { dbFindAllOrder };
