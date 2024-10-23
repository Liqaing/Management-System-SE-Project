import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const dbCreateUser = async (username, password, telephone, roleId) => {
    const user = await prisma.users.create({
        data: {
            username: username,
            password: password,
            telephone: telephone,
            roleId: roleId,
        },
    });
    return user;
};

const dbFindUser = async (telephone, includeOptions = {}) => {
    const user = await prisma.users.findUnique({
        where: {
            telephone: telephone,
        },
        include: {
            ...includeOptions,
        },
    });
    return user;
};

export { dbCreateUser, dbFindUser };
