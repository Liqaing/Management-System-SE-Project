import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const dbFindRole = async (roleNmae) => {
    const role = await prisma.role.findUnique({
        where: {
            roleName: roleNmae,
        },
    });
    return role;
};

const dbFindAllRoles = async () => {
    const roles = await prisma.role.findMany();
    return roles;
};

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

export { dbFindRole, dbFindAllRoles };
