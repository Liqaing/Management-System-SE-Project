import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { ROLES } from "../utils/constants.js";
import dotenv from "dotenv";
import saltRounds from "../config/bcrypt.config.js";

dotenv.config();

const prisma = new PrismaClient();

async function main() {
    async function seedRole() {
        const roles = await prisma.role.findMany();
        if (roles.length === 0) {
            await prisma.role.createMany({
                data: [
                    { roleName: ROLES.adminRole },
                    { roleName: ROLES.userRole },
                    { roleName: ROLES.staffRole },
                ],
            });
        }
    }

    async function seedUser() {
        const users = await prisma.users.findMany();
        if (users.length === 0) {
            await prisma.users.create({
                data: {
                    username: "admin",
                    password: bcrypt.hashSync("admin", saltRounds),
                    telephone: "011",
                    role: {
                        connect: { id: 1 }, // Assuming admin role has ID 1
                    },

                    username: "Soda",
                    password: bcrypt.hashSync("sodaIT@123", saltRounds),
                    telephone: "010987001",
                    role: {
                        connect: { id: 1 },
                    },
                },
            });
        }
    }

    async function seedCategories() {
        const categories = await prisma.category.findMany();
        // if (categories.length === 0) {
        await prisma.category.createMany({
            data: [
                {
                    categoryName: "Burgers",
                    description: "Delicious burgers",
                },
                {
                    categoryName: "Fries",
                    description: "Crispy french fries",
                },
                {
                    categoryName: "Drinks",
                    description: "Refreshing beverages",
                },
                { categoryName: "Desserts", description: "Sweet treats" },
            ],
        });
        // }
    }

    async function seedProducts() {
        const products = await prisma.product.findMany();
        // if (products.length === 0) {
        const categories = await prisma.category.findMany();
        const categoryIds = categories.reduce((acc, category) => {
            acc[category.categoryName] = category.id;
            return acc;
        }, {});

        const productData = [
            {
                name: "Cheeseburger",
                description: "Juicy cheeseburger",
                price: 5.99,
                category: "Burgers",
            },
            {
                name: "Veggie Burger",
                description: "Healthy veggie burger",
                price: 4.99,
                category: "Burgers",
            },
            {
                name: "French Fries",
                description: "Crispy french fries",
                price: 2.99,
                category: "Fries",
            },
            {
                name: "Curly Fries",
                description: "Spiral cut seasoned fries",
                price: 3.49,
                category: "Fries",
            },
            {
                name: "Soda",
                description: "Refreshing cola",
                price: 1.49,
                category: "Drinks",
            },
            {
                name: "Milkshake",
                description: "Creamy milkshake",
                price: 3.99,
                category: "Drinks",
            },
            {
                name: "Apple Pie",
                description: "Classic apple pie",
                price: 2.99,
                category: "Desserts",
            },
            {
                name: "Ice Cream Sundae",
                description: "Sundae with toppings",
                price: 3.49,
                category: "Desserts",
            },
        ];

        for (const product of productData) {
            await prisma.product.create({
                data: {
                    productName: product.name,
                    description: product.description,
                    price: product.price,
                    categoryId: categoryIds[product.category],
                },
            });
        }
        // }
    }

    await seedRole();
    await seedUser();
    await seedCategories();
    await seedProducts();
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
