import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const dbFindRole = async (roleNmae) => {
    console.log("name", roleNmae);
    const role = await prisma.role.findUnique({
        where: {
            roleName: roleNmae,
        },
    });
    console.log(role)
    return role;
};

const dbFindAllRoles = async () => {
    const roles = await prisma.role.findMany();
    return roles;
};

export { dbFindRole, dbFindAllRoles };
