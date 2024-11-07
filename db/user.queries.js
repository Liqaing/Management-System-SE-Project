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

const dbFindAllUser = async (filterOptions = {}, includeOptions = {}) => {
    const users = await prisma.users.findMany({
        where: {
            ...filterOptions,
        },
        select: {
            id: true,
            username: true,
            telephone: true,
            createAt: true,
            createBy: true,
            ...includeOptions,
        },
    });
    return users;
};

const dbFindUserByTel = async (telephone, includeOptions = {}) => {
    const user = await prisma.users.findUnique({
        where: {
            telephone: telephone,
        },
        select: {
            id: true,
            username: true,
            password: true,
            telephone: true,
            createAt: true,
            createBy: true,
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
        select: {
            id: true,
            username: true,
            telephone: true,
            createAt: true,
            createBy: true,
            ...includeOptions,
        },
    });
    return user;
};

const dbUpdateUser = async ({ id, username, telephone, roleId, userImage }) => {
    const user = prisma.users.update({
        where: {
            id: id,
        },
        data: {
            username: username,
            telephone: telephone,
            role: {
                connect: {
                    id: roleId,
                },
            },
            ...(userImage && { userImage: userImage.buffer }),
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
    dbUpdateUser,
    dbDeleteUser,
};
