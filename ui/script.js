// const formEl = document.querySelector("#upload-form");

// formEl.addEventListener("submit", async (e) => {
//   e.preventDefault();

//   const fileInput = document.getElementById("fileInput");
//   const file = fileInput.files[0];

//   if (!file) {
//     alert("Vui lòng chọn file");
//     return;
//   }

//   // Hiển thị preview trước khi upload
//   const reader = new FileReader();
//   reader.onload = (e) => {
//     const preview = document.getElementById("preview");
//     preview.src = e.target.result;
//     preview.style.display = "block";
//   };
//   reader.readAsDataURL(file);

//   // Tạo FormData — đây là cách duy nhất để gửi file qua fetch
//   const formData = new FormData();
//   formData.append("avatar", file); // "avatar" phải khớp với field name trong upload.single()

//   try {
//     const res = await fetch("http://localhost:3000/upload-avatar", {
//       method: "POST",
//       // KHÔNG set Content-Type header — trình duyệt tự set multipart/form-data + boundary
//       body: formData,
//     });

//     const data = await res.json();
//     if (res.ok) {
//       console.log("URL ảnh trên server:", data.url);
//     } else {
//       alert("Lỗi: " + data.message);
//     }
//   } catch (err) {
//     console.error("Lỗi mạng:", err);
//   }
// });

document.getElementById("multiInput").addEventListener("change", async (e) => {
    const files = e.target.files; // FileList
    if (!files.length) return;

    const formData = new FormData();
    // Append từng file — tên field phải giống upload.array("images")
    for (const file of files) {
        formData.append("images", file);
    }

    // Dùng XMLHttpRequest thay fetch để có progress event
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
            const percent = Math.round((e.loaded / e.total) * 100);
            document.getElementById("bar").value = percent;
            document.getElementById("status").textContent =
                `Đang upload: ${percent}%`;
        }
    });

    xhr.addEventListener("load", () => {
        const data = JSON.parse(xhr.responseText);
        document.getElementById("status").textContent = "Hoàn thành!";
        console.log("URLs:", data.urls);
    });

    xhr.open("POST", "http://localhost:3000/upload-multiple");
    xhr.send(formData);
});
