# 📊 Data Modeling with DBT

## 📌 Giới thiệu
💼 Họ tên: 

📅 Ngày cập nhật: 2025-04-05

## 🧱 Kiến trúc dữ liệu tổng thể

Luồng dữ liệu gồm các bước sau:
=> raw_layer_dataset.project_5_6_7(data tai bigquery)  ↓ Data_model.stagingTb ← staging (làm sạch ban đầu) ↓ dim_product dim_user ← bảng dimension ↓ fact_checkout ← bảng fact 

---
## 📁 Các bảng chính và vai trò
### ( Các bảng  được tạo trong bảng Data_model)
### 1. `raw_layer_dataset.project_5_6_7` (bảng raw) (  phần này ở  trên bigquery)
- Nguồn dữ liệu gốc chứa toàn bộ event logs từ hệ thống web
- Bao gồm: thông tin user, hành vi click, lượt xem, checkout, thông tin sản phẩm, giá, thiết bị,...

### 2. `stagingTb`
- Là bảng **staging**: dùng để chuẩn hóa dữ liệu thô
- Loại bỏ dữ liệu không hợp lệ
- Cung cấp dữ liệu sạch  hơn   cho các bảng dimension và fact

---

### 3. `dim_product`
- Bảng dimension chứa thông tin sản phẩm
- Dùng để phân tích theo từng loại sản phẩm, nhóm danh mục, giá bán

#### 🧩 Cấu trúc chính:
| Trường         | Ý nghĩa                                 |
|----------------|------------------------------------------|
| `product_id`   | ID sản phẩm                              |
| `option_id`    | Tùy chọn sản phẩm                        |
| `cat_id`       | Mã danh mục                              |
| `collect_id`   | Bộ sưu tập sản phẩm                      |
| `price`        | Giá bán                                  |
| `currency`     | Đơn vị tiền tệ                           |

---

### 4. `dim_user`
- Bảng dimension chứa thông tin người dùng
- Hữu ích để phân tích hành vi người dùng theo thiết bị, vùng, loại trình duyệt

#### 🧩 Cấu trúc chính:
| Trường         | Ý nghĩa                                  |
|----------------|-------------------------------------------|
| `user_id_db`   | ID người dùng trong hệ thống              |
| `device_id`    | Mã thiết bị dùng để truy cập              |
| `email_address`| Địa chỉ email người dùng (nếu có)         |
| `user_agent`   | Trình duyệt / ứng dụng truy cập           |
| `resolution`   | Độ phân giải màn hình                     |

---

### 5. `dim_time`
- Bảng dimension về thời gian (dùng để phân tích theo ngày, giờ, ngày trong tuần,...)
- Thường dùng để tạo dashboard có trục thời gian

#### 🧩 Cấu trúc chính:
| Trường         | Ý nghĩa                                 |
|----------------|------------------------------------------|
| `time_stamp`   | Dấu thời gian gốc                        |
| `date`         | Ngày (yyyy-mm-dd)                        |
| `hour`         | Giờ trong ngày                           |
| `day_of_week`  | Ngày trong tuần                          |

---

### 6. `fact_checkout`
- Bảng fact chứa thông tin các lượt checkout thành công
- Là bảng trung tâm trong phân tích doanh thu, chuyển đổi người dùng

#### 🧩 Cấu trúc chính:
| Trường             | Ý nghĩa                                 |
|--------------------|------------------------------------------|
| `user_id_db`       | Người dùng thực hiện checkout            |
| `product_id`       | Sản phẩm được mua                        |
| `option_id`        | Tùy chọn sản phẩm                        |
| `order_id`         | Mã đơn hàng                              |
| `checkout_time`    | Thời điểm thực hiện checkout             |
| `price`            | Giá trị giao dịch                        |
| `currency`         | Loại tiền tệ                             |
| `is_paypal`        | Hình thức thanh toán (true nếu dùng Paypal) |

---


--------
###    Run project
 - dbt run  (chay toan bo cac file)
 - dbt test sẽ kiểm tra:
    + Các cột bắt buộc không được null
    + Các ID là duy nhất
    + Các giá trị đúng định nghĩa

