const multer = require("multer");

function handleMulterError(err, req, res, next) {
    if (err instanceof multer.MulterError) {
        // Các mã lỗi phổ biến:
        // LIMIT_FILE_SIZE    → file vượt fileSize limit
        // LIMIT_FILE_COUNT   → quá số file cho phép
        // LIMIT_FIELD_COUNT  → quá số text fields cho phép
        // LIMIT_UNEXPECTED_FILE → field name không khớp
        switch (err.code) {
            case "LIMIT_FILE_SIZE":
                return res
                    .status(400)
                    .json({ message: "File quá lớn, tối đa 5mb" });
            case "LIMIT_FILE_COUNT":
                return res.status(400).json({ message: "Quá nhiều file" });
            case "LIMIT_UNEXPECTED_FILE":
                return res
                    .status(400)
                    .json({ message: `Field '${err.field}' không được phép` });
            default:
                return res
                    .status(400)
                    .json({ message: "Lỗi upload: " + err.message });
        }
    }

    if (err.message && err.message.includes("Chỉ chấp nhận file ảnh")) {
        return res.status(400).json({ message: err.message });
    }

    next(err);
}

module.exports = handleMulterError;
