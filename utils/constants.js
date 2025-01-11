const ROLES = {
    adminRole: "ADMIN",
    userRole: "USER",
    staffRole: "STAFF",
};

const BooleanString = {
    true: "true",
    false: "false",
};

const CouponStatus = {
    active: "Active",
    inActive: "Inactive",
    expire: "expire",
};

const OrderStatus = {
    // Order online need to be confirm byy staff
    pending: "Pending",
    preparing: "Preparing",
    orderReady: "Ready",
    delivering: "Delivering",
    complete: "Completed",
};

const PaymentMethod = {
    cash: "Cash",
    qr: "QR",

    // online order
    card: "Card",
};

const OrderType = {
    counter: "Counter",
    online: "Online",
};

export {
    ROLES,
    BooleanString,
    CouponStatus,
    OrderStatus,
    PaymentMethod,
    OrderType,
};
