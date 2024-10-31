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
    productImages,
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
            ...(productImages && {
                productImage: {
                    create: productImages.map((image) => ({
                        image: image.buffer,
                    })),
                },
            }),
        },
    });
    return product;
};

export { dbFindAllProduct, dbCreatProduct };
