// Seeding database

import { PrismaClient } from "@prisma/client";
import { ROLES } from "../utils/constants.js";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function main() {
    async function seedRole() {
        // Create some roles
        const adminRole = await prisma.role.create({
            data: {
                roleName: ROLES.adminRole,
            },
        });

        const userRole = await prisma.role.create({
            data: {
                roleName: ROLES.userRole,
            },
        });

        const staffRole = await prisma.role.create({
            data: {
                roleName: ROLES.staffRole,
            },
        });
    }

    async function seedUser() {
        // Create some roles
        await prisma.users.create({
            data: {
                username: "admin",
                password: "admin",
                telephone: "010",
                role: {
                    connect: { id: 1 },
                },
            },
        });
    }

    await seedRole();
    await seedUser();
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
