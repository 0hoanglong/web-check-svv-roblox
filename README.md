# Web Check & Run VIP Server Roblox

Đây là một công cụ web đơn giản và hiệu quả giúp người chơi Roblox kiểm tra tính hợp lệ của các liên kết VIP Server, trích xuất thông tin cần thiết và tạo đường dẫn để mở trực tiếp trò chơi trong ứng dụng Roblox (Deep Link).

Dự án hoạt động hoàn toàn trên trình duyệt (Client-side), không yêu cầu cài đặt phần mềm phụ trợ hay server backend.

## 🚀 Tính năng chính

- **Kiểm tra & Xác thực Link**: Tự động phân tích domain để phát hiện các liên kết giả mạo (phishing) không thuộc về `roblox.com`.
- **Tạo Deep Link (`roblox://`)**: Chuyển đổi link web thành link giao thức ứng dụng, giúp mở game trực tiếp mà không cần thông qua trình duyệt web, giảm thiểu lỗi.
- **Quản lý danh sách**:
  - Lưu trữ các link VIP Server yêu thích ngay trên trình duyệt (sử dụng LocalStorage).
  - Đặt tên gợi nhớ cho từng link (Ví dụ: "Blox Fruits Farm", "Pet Sim X").
  - Xóa link cũ với xác nhận an toàn.
- **Giao diện hiện đại**:
  - Hỗ trợ **Dark Mode** (Chế độ tối) bảo vệ mắt.
  - Thiết kế **Responsive**, tối ưu tốt cho cả máy tính và điện thoại di động.

## 🛠️ Công nghệ sử dụng

- **HTML5**: Cấu trúc ngữ nghĩa (Semantic HTML).
- **CSS3**: Sử dụng CSS Variables để quản lý theme, Flexbox để dàn trang.
- **JavaScript (Vanilla)**: Xử lý logic phân tích URL, quản lý LocalStorage và DOM manipulation.

## 📖 Hướng dẫn sử dụng

1. **Nhập Link**: Copy link VIP Server Roblox của bạn và dán vào ô "Nhập link VIP server".
2. **Đặt tên (Tùy chọn)**: Nhập tên game hoặc ghi chú để dễ nhớ.
3. **Thao tác**:
   - Nhấn **Lưu**: Để lưu link vào danh sách bên dưới.
   - Nhấn **Mở / Chạy**: Để kiểm tra link ngay lập tức. Nếu link hợp lệ, trình duyệt sẽ cố gắng mở ứng dụng Roblox.
4. **Quản lý**:
   - Tại danh sách đã lưu, nhấn **Mở** để vào game nhanh.
   - Nhấn **Xóa** để loại bỏ link khỏi danh sách.
5. **Giao diện**: Nhấn vào biểu tượng 🌓 ở góc trên để chuyển đổi giữa Sáng/Tối.

## 📦 Cài đặt & Chạy

Dự án này là trang web tĩnh, bạn không cần cài đặt môi trường phức tạp (như Node.js hay Python).

1. Tải toàn bộ mã nguồn về máy.
2. Mở file `index.html` bằng bất kỳ trình duyệt web nào (Chrome, Edge, Firefox, Safari...).

## 📄 License

Dự án mã nguồn mở, được phép sử dụng và chỉnh sửa tự do cho mục đích cá nhân.