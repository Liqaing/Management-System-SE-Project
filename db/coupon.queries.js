import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const dbFindAllCoupon = async (findOptions = {}) => {
    const coupons = await prisma.coupon.findMany({
        where: {
            ...findOptions,
        },
    });
    return coupons;
};

const dbFindCouponByCode = async (couponCode) => {
    const coupon = await prisma.coupon.findUnique({
        where: {
            couponCode: couponCode,
        },
    });
    return coupon;
};

const dbFindCouponById = async (id) => {
    const coupon = await prisma.coupon.findUnique({
        where: {
            id: id,
        },
    });
    return coupon;
};

const dbCreateCoupon = async ({
    couponCode,
    DiscountPercentage,
    status,
    effectiveDate,
    expireDate,
    limitUsange,
    createBy,
    createById,
}) => {
    const coupon = await prisma.coupon.create({
        data: {
            couponCode,
            DiscountPercentage,
            status,
            effectiveDate,
            expireDate,
            limitUsange,
            createBy,
            createById,
        },
    });

    return coupon;
};

const dbDeleteCoupon = async (id) => {
    const coupon = prisma.coupon.delete({
        where: {
            id: id,
        },
    });
    return coupon;
};

export {
    dbFindAllCoupon,
    dbFindCouponByCode,
    dbCreateCoupon,
    dbFindCouponById,
    dbDeleteCoupon,
};
