# 🛒 PC Store - Full Stack Application

ระบบจัดการร้านค้าอุปกรณ์คอมพิวเตอร์แบบครบวงจร (Full Stack) พัฒนาด้วย Vue 3 (Front-end) และ NestJS (Back-end)

---

## roject Architecture

โปรเจกต์นี้แบ่งออกเป็น 2 ส่วนหลัก:
1. **Front-end**: ส่วนติดต่อผู้ใช้งาน พัฒนาด้วย Vue 3 และ Tailwind CSS
2. **Back-end**: ระบบจัดการฐานข้อมูลและ API พัฒนาด้วย NestJS และ PostgreSQL

---

## Front-end (Vue 3 + Vite)

### Installation & Running
```bash
cd front-end
npm install
npm run dev
```

---

##  Back-end (NestJS + PostgreSQL)

### Installation & Running
```bash
cd back-end
npm install
# ตั้งค่าไฟล์ .env 
npm run start:dev
```

---

## ข้อมูลบัญชีผู้ใช้ตัวอย่าง (Example Credentials)

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin1@mail.com` | `Pass@1234` |
| **Manager** | `manager1@mail.com` | `Pass@1234` |
| **Staff** | `staff1@mail.com` | `Pass@1234` |
| **Customer** | `customer1@mial.com` | `Pass@1234` |

---

## ระบบการจัดการสาขา (Branch Logic)

- **Admin:** จัดการได้ทุกสาขาทั่วประเทศ
- **Manager:** จัดการพนักงาน สต็อก และดูรายงานเฉพาะในสาขาของตนเอง
- **Staff:** จัดการคำสั่งซื้อและสต็อกในสาขาที่สังกัด
- **Customer:** เลือกซื้อสินค้าและจัดส่งตามที่อยู่

---

## วิธีการรันโปรเจกต์พร้อมกัน

1. เปิด Terminal แรกเพื่อรัน Back-end:
   ```bash
   cd back-end && npm run start:dev
   ```
2. เปิด Terminal ที่สองเพื่อรัน Front-end:
   ```bash
   cd front-end && npm run dev
   ```
3. เข้าใช้งานผ่าน Browser ที่ [http://localhost:5173](http://localhost:5173)
