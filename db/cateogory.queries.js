import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const dbFindAllCategory = async () => {
    const categories = await prisma.category.findMany();
    return categories;
};

export { dbFindAllCategory };
