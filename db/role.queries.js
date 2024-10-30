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

export { dbFindRole, dbFindAllRoles };
