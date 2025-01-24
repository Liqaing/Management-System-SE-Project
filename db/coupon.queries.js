import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const dbFindAllCoupon = async (findOptions = {}, orderOption = {}) => {
    const coupons = await prisma.coupon.findMany({
        where: {
            ...findOptions,
        },
        orderBy: {
            ...orderOption,
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
    couponType,
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
            couponType,
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

const dbUpdateCoupon = async ({
    id,
    couponCode,
    DiscountPercentage,
    status,
    effectiveDate,
    couponType,
    expireDate,
    limitUsange,
    updateById,
    updateBy,
}) => {
    const coupon = prisma.coupon.update({
        where: {
            id: id,
        },
        data: {
            couponCode,
            DiscountPercentage,
            status,
            effectiveDate,
            expireDate,
            limitUsange,
            couponType,
            updateBy,
            updateById,
            updateAt: new Date(),
        },
    });
    return coupon;
};

const dbUpdateCouponUsage = async (findOptions = {}, updateUsageObj) => {
    const coupon = await prisma.coupon.update({
        where: {
            ...findOptions,
        },
        data: {
            limitUsange: { ...updateUsageObj },
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
    dbUpdateCoupon,
    dbUpdateCouponUsage,
};
