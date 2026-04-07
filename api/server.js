require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cloudinary = require("./config/cloudinary");
const handleMulterError = require("./middlewares/handleMulterError");
const validate = require("./middlewares/validate");
const { registerSchema, loginSchema } = require("./validations/auth.schema");

const upload = require("./middlewares/upload");
const router = require("./routes");
const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(router);
app.use(cors());
app.use(express.json());
app.use(handleMulterError);

app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.post("/upload-avatar", upload.single("avatar"), (req, res) => {
    console.log(req.file); // Thông tin về file được upload
});
app.post("/upload-multiple", upload.array("images"), (req, res) => {
    // console.log(req.files); // Thông tin về các file được upload
    console.log(req.files);
});
app.get("/delete-file/:publicId", async (req, res) => {
    // publicId có thể chứa "/" nên cần encode khi gửi từ client
    const result = await cloudinary.uploader.destroy(req.params.publicId);
    // result.result === 'ok' nếu xóa thành công
    res.json({ result });
});

app.post("/register", validate(registerSchema), async (req, res) => {
    const { username, email, password } = req.body;
    res.json({ message: "Đăng ký thành công" });
});
app.post("/login", validate(loginSchema), async (req, res) => {
    const { email, password } = req.body;
    res.json({ message: "Đăng nhập thành công" });
});
app.use(handleMulterError); // Middleware xử lý lỗi từ Multer

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
