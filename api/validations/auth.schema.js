const { z } = require("zod");

const registerSchema = z.object({
    username: z
        .string({ required_error: "Username không được để trống" })
        .min(3, "Username phải từ 3 đến 20 ký tự")
        .max(20, "Username tối đa 20 ký tự")
        .regex(/^[a-zA-Z0-9_]+$/, "Username chỉ chứa chữ, số và dấu gạch dưới"),

    email: z
        .string({ required_error: "Email không được để trống" })
        .email("Email không hợp lệ")
        .toLowerCase(), // Transform: tự động lowercase sau khi validate

    password: z
        .string({ required_error: "Mật khẩu không được để trống" })
        .min(6, "Mật khẩu tối thiểu 6 ký tự")
        .regex(/[A-Z]/, "Mật khẩu phải có ít nhất 1 chữ hoa"),

    age: z
        .number()
        .int("Tuổi phải là số nguyên")
        .min(1, "Tuổi không hợp lệ")
        .max(120, "Tuổi không hợp lệ")
        .optional(),
});

const loginSchema = z.object({
    email: z.string().email("Email không hợp lệ").toLowerCase(),
    password: z.string().min(1, "Mật khẩu không được để trống"),
});

module.exports = { registerSchema, loginSchema };
