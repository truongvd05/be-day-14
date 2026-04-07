// api/validations/product.schema.js
const { z } = require("zod");

const createProductSchema = z.object({
    name: z
        .string()
        .min(2, "Tên sản phẩm tối thiểu 2 ký tự")
        .max(100, "Tên sản phẩm tối đa 100 ký tự"),

    price: z.coerce.number().gt(0, "Giá phải lớn hơn 0"),

    stock: z.coerce.number().gte(0, "Số lượng phải >= 0").default(0).optional(),

    description: z.string().max(500, "Mô tả tối đa 500 ký tự").optional(),
});

const updateProductSchema = createProductSchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
        message: "Body không được rỗng",
    });

module.exports = { createProductSchema, updateProductSchema };
