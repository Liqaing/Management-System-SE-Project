import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const dbFindAllProduct = async (includeOptions = {}) => {
    const products = await prisma.product.findMany({
        include: {
            ...includeOptions,
        },
    });
    return products;
};

export { dbFindAllProduct };
