const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { Readable } = require("stream");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const multerUpload = multer({
    storage: multer.memoryStorage(), // lưu vào RAM, không lưu vào disk
    limits: { fileSize: 5 * 1024 * 1024 }, // giới hạn 5MB
    fileFilter: (req, file, cb) => {
        // chỉ chấp nhận file ảnh
        if (!file.mimetype.startsWith("image/")) {
            return cb(new Error("Chỉ chấp nhận file ảnh"));
        }
        cb(null, true);
    },
});

module.exports = {
    single: async (req, res, next) => {
        if (!req.file) return next(); // không có file → bỏ qua, để handler tự xử lý

        try {
            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: "products" }, // lưu vào thư mục products trên cloudinary
                    (error, result) =>
                        error ? reject(error) : resolve(result),
                );
                Readable.from(req.file.buffer).pipe(stream); // stream buffer lên cloudinary
            });

            req.file.path = result.secure_url;
            next();
        } catch (error) {
            next(error);
        }
    },
    array: async (req, res, next) => {
        if (!req.files?.length) return next();

        try {
            const results = await Promise.all(
                req.files.map(
                    (file) =>
                        new Promise((resolve, reject) => {
                            const stream = cloudinary.uploader.upload_stream(
                                { folder: "products" },
                                (error, result) =>
                                    error ? reject(error) : resolve(result),
                            );
                            Readable.from(file.buffer).pipe(stream);
                        }),
                ),
            );

            req.files = req.files.map((file, i) => ({
                ...file,
                path: results[i].secure_url,
            }));
            next();
        } catch (error) {
            next(error);
        }
    },
};
