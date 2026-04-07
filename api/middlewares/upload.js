// src/middlewares/upload.js
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/uploads/");
    },
    filename: function (req, file, cb) {
        // Lấy extension từ tên file gốc, thêm timestamp để tránh trùng tên
        const ext = path.extname(file.originalname);
        const uniqueName =
            Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
        cb(null, uniqueName);
    },
});

const fileFilter = function (req, file, cb) {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Chỉ chấp nhận file ảnh (jpeg, png, webp)"), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        files: 2,
        fileSize: 3 * 1024 * 1024, // 3mb
    },
});

module.exports = upload;
