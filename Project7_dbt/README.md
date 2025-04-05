
### Dự án 07: Chuyển đổi & Trực quan hóa Dữ liệu
notion : https://jumpy-humor-433.notion.site/Project-07-Data-Transformation-Visualization-1b489a1a7c7d80eba1e0f8524a967bbd?pvs=73
**Duration**: 1 week  
**Focus**: Data modeling and visualization

---

### Learning Objectives:

- Understanding dimensional modeling  
- Working with dbt  
- Creating effective visualizations  
- Business metrics analysis  

---

### Detailed Steps:

---

## 1. **dbt Setup**
- Install dbt and set up environment using `dbt-env`, a dedicated Python virtual environment folder.
- Configure connection to BigQuery.
- Project structure is managed and edited through `dbtcode`, which allows running and testing models conveniently via Visual Studio Code.
- Initialize basic dbt project files and folder structure.
> [Chi tiết seting up  🚀](https://www.notion.so/e7fd333f221145ee93fcf0e35d447e58?pvs=21)
---

## 2. **Data Modeling** 

Phần **data modeling** được triển khai trong thư mục `models/example/Data_model` của project. Tại đây, toàn bộ mô hình dữ liệu được xây dựng và chuẩn hóa theo hướng **dimensional modeling**.

### ✅ Thành phần chính:

- **Staging layer**: làm sạch dữ liệu từ bảng raw (`project_5_6_7` trong dataset `raw_layer_dataset`)
- **Dimension tables**:
  - `dim_product`: chứa thông tin sản phẩm (product_id, option_id, giá, danh mục…)
  - `dim_user`: thông tin người dùng (user_id, email, thiết bị…)
  - `dim_time`: trích xuất thông tin ngày, giờ từ timestamp để phân tích theo thời gian
- **Fact table**:
  - `fact_checkout`: chứa các lượt thanh toán thành công (`collection = 'checkout_success'`)

### 🧠 Các điểm kỹ thuật chính:
- Tên bảng và cột dùng lowercase, SQL keyword viết IN HOA
- Chia nhỏ logic bằng CTE (`WITH`) để dễ đọc và kiểm thử
- Có thêm `schema.yml` để định nghĩa test:
  - `not_null` và `unique` cho khóa chính
  - `accepted_values` cho các cột nhạy cảm nếu cần

### 💡 Một số ví dụ mẫu:

```sql
WITH base AS (
    SELECT DISTINCT
        product_id
        ,option_id
        ,price
        ,currency
    FROM `project5-unigap.Data_model.stagingTb`
    WHERE product_id IS NOT NULL
)

SELECT * FROM base
```

```yaml
# schema.yml
models:
  - name: dim_product
    columns:
      - name: product_id
        tests:
          - not_null
          - unique
```

### 📂 Cấu trúc thư mục:
```
models/
└── example/
    └── Data_model/
        ├── dim_product.sql
        ├── dim_user.sql
        ├── fact_checkout.sql
        ├── stagingTb.sql
        └── schema.yml
```

---

## 3. **Dashboard Creation** 
*... ( bổ sung sau)*

---

## 4. **Documentation & Optimization** 
*... ( bổ sung sau)*

---

## Deliverables:

- dbt models  
- dbt tests  
- Looker dashboards  
- Documentation  
- Final presentation  

---
