const checkImageType = (image) => {
    // Check if image is jpg or png
    // param image: byte
    const isJpeg = image[0] === 0xff && image[1] === 0xd8;

    if (isJpeg) {
        return "Content-Type", "image/jpeg";
    } else {
        return "Content-Type", "image/png";
    }
};

const constructUrl = (req) => {
    // Construct url of server base on req
    return `${req.protocol}://${req.get("host")}`;
};

export { checkImageType, constructUrl };
