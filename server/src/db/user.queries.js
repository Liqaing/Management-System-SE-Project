import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const dbCreateUser = async(username, password, telephone) => {
    try {
        const user = await prisma.users.create({
            data: {
                username: username,
                password: password,
                telephone: telephone
            }
        })
        return user;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}

const dbFindUser = async (telephone) => {
    const user = await prisma.users.findUnique({
        where: {            
            telephone: telephone
        }
    })
    return user;
}

export { dbCreateUser, dbFindUser }