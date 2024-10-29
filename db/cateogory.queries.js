import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const dbFindAllCategory = async () => {
    const categories = await prisma.category.findMany();
    return categories;
};

const dbFindCategoryByName = async (catNmae) => {
    const category = await prisma.category.findUnique({
        where: {
            categoryName: catNmae,
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

export { dbFindAllCategory, dbFindCategoryByName, dbCreateCategory };
