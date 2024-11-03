import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const dbCreateUser = async (
    username,
    password,
    telephone,
    roleId,
    userImage
) => {
    const user = await prisma.users.create({
        data: {
            username: username,
            password: password,
            telephone: telephone,
            userImage: userImage,
            roleId: roleId,
        },
    });
    return user;
};

const dbFindAllUser = async () => {
    const users = await prisma.users.findMany({
        select: {
            id: true,
            username: true,
            telephone: true,
            createAt: true,
            createBy: true,
        },
    });
    return users;
};

const dbFindUserByTel = async (telephone, includeOptions = {}) => {
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

const dbFindUserById = async (id, includeOptions = {}) => {
    const user = await prisma.users.findUnique({
        where: {
            id: id,
        },
        include: {
            ...includeOptions,
        },
    });
    return user;
};

const dbDeleteUser = async (id) => {
    const user = prisma.users.delete({
        where: {
            id: id,
        },
    });
    return user;
};

export {
    dbCreateUser,
    dbFindUserById,
    dbFindUserByTel,
    dbFindAllUser,
    dbDeleteUser,
};
