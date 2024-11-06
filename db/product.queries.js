import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const dbFindAllProduct = async (includeOptions = {}, findOptions = {}) => {
    const products = await prisma.product.findMany({
        where: {
            ...findOptions,
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

const dbUpdateProduct = async ({
    id,
    productName,
    description,
    price,
    categoryId,
    updateById,
    updateBy,
    productImages,
}) => {
    const product = prisma.product.update({
        where: {
            id: id,
        },
        data: {
            productName: productName,
            description: description,
            price: price,
            category: {
                connect: {
                    id: categoryId,
                },
            },
            updateAt: new Date(),
            updateBy: updateBy,
            updateById: updateById,
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

const dbFindProductImageById = async (id) => {
    const image = await prisma.productImage.findUnique({
        where: {
            id: id,
        },
    });
    return image;
};

const dbDeleteProductImage = async (id) => {
    const image = await prisma.productImage.delete({
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
    dbUpdateProduct,
    dbDeleteProductImage,
};
