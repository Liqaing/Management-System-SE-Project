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

const dbCreatProduct = async ({
    productName,
    description,
    price,
    categoryId,
    createBy,
    createById,
}) => {
    const product = await prisma.product.create({
        data: {
            productName: productName,
            description: description,
            price: price,
            categoryId: categoryId,
            createAt: new Date(),
            createBy: createBy,
            createById: createById,
        },
    });
    return product;
};

export { dbFindAllProduct, dbCreatProduct };
