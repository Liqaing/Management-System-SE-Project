import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const dbFindAllProduct = async (includeOptions = {}) => {
    const products = await prisma.product.findMany({
        include: {
            category: includeOptions.category
                ? {
                      select: {
                          id: true,
                          categoryName: true,
                      },
                  }
                : false,
            productImage: includeOptions.productImage
                ? {
                      select: {
                          id: true,
                      },
                  }
                : false,
        },
    });
    return products;
};

const dbFindProductById = async (id, includeOptions = {}) => {
    const product = await prisma.product.findUnique({
        where: {
            id: id,
        },
        include: {
            category: includeOptions.category
                ? {
                      select: {
                          id: true,
                          categoryName: true,
                      },
                  }
                : false,
            productImage: includeOptions.productImage
                ? {
                      select: {
                          id: true,
                      },
                  }
                : false,
        },
    });

    return product;
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

const dbDeleteProduct = async (id) => {
    const product = prisma.product.delete({
        where: {
            id: id,
        },
    });
    return product;
};

const dbFindProductImageById = async (id) => {
    const image = await prisma.productImage.findUnique({
        where: {
            id: id,
        },
    });
    return image;
};

export {
    dbFindAllProduct,
    dbCreatProduct,
    dbFindProductImageById,
    dbFindProductById,
    dbDeleteProduct,
};
