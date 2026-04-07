const cloudinary = require("cloudinary").v2;

const createProduct = async (req, res) => {
    if (!req.file) {
        return res
            .status(400)
            .json({ message: "Vui lòng upload ảnh sản phẩm" });
    }

    const imageUrl = req.file.path;
    const { name, price, stock, description } = req.body; // đã được Zod transform

    return res.status(201).json({
        message: "Tạo sản phẩm thành công",
        data: { name, price, stock, description, imageUrl },
    });
};

const uploadGallery = async (req, res) => {
    if (!req.files?.length) {
        return res.status(400).json({ message: "Vui lòng chọn ít nhất 1 ảnh" });
    }

    const urls = req.files.map((file) => file.path);

    return res.status(200).json({
        message: `Upload thành công ${urls.length} ảnh`,
        urls,
    });
};

const updateProduct = async (req, res) => {
    const { id } = req.params;

    const productExists = true;
    if (!productExists) {
        return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    const { oldImageUrl, ...fields } = req.body;

    const imageUrl = req.file ? req.file.path : oldImageUrl;

    return res.status(200).json({
        message: "Cập nhật thành công",
        data: { id, ...fields, imageUrl },
    });
};

const deleteImage = async (req, res) => {
    const { publicId } = req.query;

    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result !== "ok") {
        return res
            .status(400)
            .json({ message: "Không tìm thấy ảnh hoặc publicId không hợp lệ" });
    }

    return res.status(200).json({ message: "Xoá ảnh thành công" });
};

module.exports = { createProduct, uploadGallery, updateProduct, deleteImage };
