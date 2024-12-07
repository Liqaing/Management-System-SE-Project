import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const dbFindAllCoupon = async () => {
    const coupons = await prisma.coupon.findMany();
    return coupons;
};

export { dbFindAllCoupon };
