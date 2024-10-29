import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const dbFindAllCategory = async () => {
    const categories = await prisma.category.findMany();
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

const dbCreateCategory = async (catName, description, createBy) => {
    const category = await prisma.category.create({
        data: {
            categoryName: catName,
            description: description,
            createBy: createBy,
        },
    });
    return category;
};

const dbUpdateCategory = async (id, cateName, description, updateBy) => {
    const category = await prisma.category.update({
        where: {
            id: id,
        },
        data: {
            categoryName: cateName,
            description: description,
            updateBy: updateBy,
            updateAt: new Date(),
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
};
