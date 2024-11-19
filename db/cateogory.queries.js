import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const dbFindAllCategory = async (includeOptions = {}) => {
    const categories = await prisma.category.findMany({
        include: {
            ...includeOptions,
        },
    });
    return categories;
};

const dbFindCategoryByName = async (catNmae, includeOptions = {}) => {
    const category = await prisma.category.findUnique({
        where: {
            categoryName: catNmae,
        },
        include: {
            ...includeOptions,
        },
    });
    return category;
};

const dbFindCategoryById = async (id, includeOptions = {}) => {
    const category = await prisma.category.findUnique({
        where: {
            id: id,
        },
        include: {
            ...includeOptions,            
        },
    });
    return category;
};

const dbCreateCategory = async ({
    categoryName,
    description,
    createBy,
    createById,
}) => {
    const category = await prisma.category.create({
        data: {
            categoryName: categoryName,
            description: description,
            createById: createById,
            createBy: createBy,
            createAt: new Date(),
        },
    });
    return category;
};

const dbUpdateCategory = async ({
    id,
    categoryName,
    description,
    updateBy,
    updateById,
}) => {
    const category = await prisma.category.update({
        where: {
            id: id,
        },
        data: {
            categoryName: categoryName,
            description: description,
            updateById: updateById,
            updateBy: updateBy,
            updateAt: new Date(),
        },
    });
    return category;
};

const dbDeleteCategory = async (id) => {
    const category = await prisma.category.delete({
        where: {
            id: id,
        },
    });
    return category;
};

export {
    dbFindAllCategory,
    dbFindCategoryByName,
    dbCreateCategory,
    dbFindCategoryById,
    dbUpdateCategory,
    dbDeleteCategory,
};
