# 📱 React Native ProfileApp with Complete Books Management System

แอปพลิเคชัน React Native สำหรับจัดการข้อมูลส่วนตัวและระบบจัดการหนังสือที่ครบครัน พร้อมระบบ Authentication และการเชื่อมต่อกับ Classroom API

![React Native](https://img.shields.io/badge/React%20Native-0.79.4-blue)
![Expo](https://img.shields.io/badge/Expo-SDK%2053-black)
![API](https://img.shields.io/badge/API-Classroom%20API-green)
![Theme](https://img.shields.io/badge/Theme-Light%2FDark-purple)

## 🚀 ฟีเจอร์หลัก

### 🔐 ระบบ Authentication
- **สมัครสมาชิก**: ระบบลงทะเบียนผู้ใช้ใหม่
- **เข้าสู่ระบบ**: Login ด้วย email/password
- **JWT Token Management**: เก็บ token ใน AsyncStorage
- **Auto-logout**: แจ้งเตือนเมื่อ session หมดอายุ
- **Profile Management**: จัดการข้อมูลส่วนตัว

### 📚 ระบบจัดการหนังสือ (Books Management)
- **ดูหนังสือทั้งหมด**: รายการหนังสือพร้อม pagination
- **หนังสือของฉัน**: จัดการหนังสือส่วนตัว
- **เพิ่มหนังสือใหม่**: สร้างรายการหนังสือ
- **แก้ไขหนังสือ**: อัปเดตข้อมูลหนังสือ
- **ลบหนังสือ**: ลบหนังสือที่ไม่ต้องการ
- **ค้นหาและกรอง**: ค้นหาตามชื่อ, ผู้แต่ง, หมวดหมู่
- **สถิติหนังสือ**: แสดงจำนวนหนังสือและสถานะ

### 🎨 UI/UX Features
- **Responsive Design**: ปรับขนาดตามหน้าจอ
- **Light/Dark Theme**: เปลี่ยนธีมได้
- **Pull-to-refresh**: รีเฟรชข้อมูล
- **Infinite Scrolling**: โหลดข้อมูลเพิ่มเติม
- **Loading States**: แสดงสถานะการโหลด
- **Error Handling**: จัดการข้อผิดพลาด
- **Alert System**: ระบบแจ้งเตือนภาษาไทย

## 🏗️ โครงสร้างโปรเจค

```
📦 react_native_profileapp/
├── 📂 app/                     # หน้าจอแอปพลิเคชัน
│   ├── _layout.js              # Navigation + Auth wrapper
│   ├── index.jsx               # หน้าหลัก
│   ├── signin.jsx              # หน้าเข้าสู่ระบบ
│   ├── signup.jsx              # หน้าสมัครสมาชิก
│   ├── book.jsx                # รายการหนังสือทั้งหมด
│   ├── book-detail.jsx         # รายละเอียดหนังสือ
│   ├── book-form.jsx           # ฟอร์มเพิ่ม/แก้ไขหนังสือ
│   ├── my-books.jsx            # หนังสือของฉัน
│   ├── about.jsx               # หน้าเกี่ยวกับ
│   └── settings.js             # หน้าตั้งค่า
├── 📂 contexts/                # React Context
│   ├── ThemeContext.js         # การจัดการธีม
│   └── AuthContext.js          # การจัดการ Authentication
├── 📂 utils/                   # Utilities
│   └── alertUtils.js           # ระบบแจ้งเตือน
├── 📂 config/                  # การตั้งค่า
│   └── api.js                  # การตั้งค่า API URLs
├── 📂 components/              # Components
├── 📂 assets/                  # รูปภาพและไฟล์สื่อ
└── 📄 package.json             # Dependencies
```

## 🔌 API Endpoints

### 🔐 Authentication APIs
```
POST /api/auth/register         # สมัครสมาชิก
POST /api/auth/login           # เข้าสู่ระบบ
GET  /api/auth/profile         # ดูข้อมูลโปรไฟล์
PUT  /api/auth/profile         # อัปเดตโปรไฟล์
```

### 📚 Books APIs
```
GET    /api/books              # ดูหนังสือทั้งหมด (พร้อม search & filter)
GET    /api/books/:id          # ดูหนังสือรายไอดี
POST   /api/books              # เพิ่มหนังสือใหม่ 🔒
PUT    /api/books/:id          # แก้ไขหนังสือ 🔒
DELETE /api/books/:id          # ลบหนังสือ 🔒
GET    /api/books/user/my-books # ดูหนังสือของฉัน 🔒
GET    /api/books/genres/list  # ดูหมวดหมู่ทั้งหมด
```

*🔒 = ต้อง Authentication*

## 📱 หน้าจอแอปพลิเคชัน

### 1. **หน้าหลัก (index.jsx)**
- แสดงข้อมูลผู้ใช้จาก API
- สถิติการใช้งาน
- เมนูไปหน้าต่างๆ
- ปุ่มออกจากระบบ

### 2. **หน้าเข้าสู่ระบบ (signin.jsx)**
- ฟอร์ม login ด้วย email/password
- Validation ข้อมูล
- Remember login state
- ลิงก์ไปหน้าสมัครสมาชิก

### 3. **หน้าสมัครสมาชิก (signup.jsx)**
- ฟอร์ม register (username, email, password)
- Validation แบบ real-time
- เช็ค username/email ซ้ำ
- ลิงก์กลับหน้า login

### 4. **รายการหนังสือทั้งหมด (book.jsx)**
- แสดงหนังสือทั้งหมดแบบการ์ด
- ค้นหาและกรองข้อมูล
- Infinite scrolling
- ปุ่มเพิ่มหนังสือใหม่
- แก้ไข/ลบหนังสือของตัวเอง

### 5. **รายละเอียดหนังสือ (book-detail.jsx)**
- แสดงข้อมูลหนังสือครบถ้วน
- ข้อมูลผู้เพิ่ม และวันที่
- ปุ่มแก้ไข/ลบ (สำหรับเจาของ)
- UI ที่สวยงามพร้อม icons

### 6. **ฟอร์มหนังสือ (book-form.jsx)**
- ฟอร์มเพิ่ม/แก้ไขหนังสือ
- Validation ครบถ้วน
- เลือกหมวดหมู่จากรายการ
- Switch สถานะมีสินค้า
- Auto-save draft

### 7. **หนังสือของฉัน (my-books.jsx)**
- แสดงเฉพาะหนังสือของผู้ใช้
- สถิติจำนวนหนังสือ
- การจัดการแบบ batch
- เรียงลำดับตามวันที่

### 8. **หน้าตั้งค่า (settings.js)**
- เปลี่ยน Light/Dark theme
- ข้อมูลผู้ใช้ปัจจุบัน
- เมนูจัดการหนังสือ
- ข้อมูลแอปพลิเคชัน
- ปุ่มออกจากระบบ

## 🛠️ การติดตั้งและใช้งาน

### 📋 ข้อกำหนดระบบ
- Node.js 18+ 
- npm หรือ yarn
- Expo CLI
- React Native 0.79.4
- Expo SDK 53

### 🚀 ขั้นตอนการติดตั้ง

1. **Clone โปรเจค**
```bash
git clone https://github.com/armychawakorn/react_native_profileapp.git
cd react_native_profileapp
```

2. **ติดตั้ง Dependencies**
```bash
npm install
# หรือ
yarn install
```

3. **ตั้งค่า API URL**
แก้ไขไฟล์ `config/api.js`:
```javascript
export const CONFIG = {
  API_BASE_URL: 'http://192.168.1.102:3000', // เปลี่ยนเป็น IP ของคุณ
};
```

4. **เริ่มต้น Development Server**
```bash
npx expo start
# หรือ
npm start
```

5. **เปิดแอป**
- สแกน QR code ด้วย Expo Go (iOS/Android)
- หรือกด `i` สำหรับ iOS Simulator
- หรือกด `a` สำหรับ Android Emulator

### 🔧 การตั้งค่า API Server

ต้องรัน Classroom API ที่:
```bash
# Development (Simulator)
http://localhost:3000

# Testing (Physical Device) 
http://192.168.1.102:3000

# Production
https://api.yourserver.com
```

API Documentation: `http://192.168.1.102:3000/api-docs/`

## 🎯 การใช้งานฟีเจอร์หนังสือ

### 📖 ดูหนังสือทั้งหมด
1. เข้าเมนู "📚 รายการหนังสือ"
2. ใช้ search bar ค้นหา
3. กดปุ่มกรองเพื่อเลือกหมวดหมู่
4. แตะที่หนังสือเพื่อดูรายละเอียด

### ➕ เพิ่มหนังสือใหม่
1. กดปุ่ม "เพิ่ม" ในหน้ารายการหนังสือ
2. กรอกข้อมูล: ชื่อ*, ผู้แต่ง*, คำอธิบาย, หมวดหมู่, ปี, ราคา
3. เลือกสถานะมีสินค้า
4. กดบันทึก

### ✏️ แก้ไขหนังสือ
1. เข้าหน้ารายละเอียดหนังสือ
2. กดปุ่ม "แก้ไข" (เฉพาะหนังสือของตัวเอง)
3. แก้ไขข้อมูลที่ต้องการ
4. กดบันทึกการแก้ไข

### 🗑️ ลบหนังสือ
1. เข้าหน้ารายละเอียดหนังสือ
2. กดปุ่ม "ลบ" (เฉพาะหนังสือของตัวเอง)
3. ยืนยันการลบ

### 🔍 ค้นหาและกรอง
- **ค้นหา**: พิมพ์ในช่อง search bar
- **กรองหมวดหมู่**: เลือกจาก chip buttons
- **ล้างตัวกรอง**: กดปุ่ม "ล้างทั้งหมด"

## 🎨 ระบบธีม (Theme System)

### 🌞 Light Theme
- พื้นหลังสีขาว
- ข้อความสีดำ
- เหมาะสำหรับใช้ในที่สว่าง

### 🌙 Dark Theme  
- พื้นหลังสีเข้ม
- ข้อความสีขาว
- ลดแสงสีฟ้า ประหยัดแบตเตอรี่

### 🎨 การเปลี่ยนธีม
1. ไปหน้า Settings
2. Toggle switch "Dark Mode"
3. แอปจะเปลี่ยนธีมทันที

## 🔔 ระบบแจ้งเตือน (Alert System)

### ✅ ประเภทการแจ้งเตือน
- **Success**: การดำเนินการสำเร็จ (สีเขียว)
- **Error**: ข้อผิดพลาด (สีแดง)
- **Warning**: คำเตือน (สีส้ม)
- **Info**: ข้อมูล (สีฟ้า)

### 🇹🇭 ข้อความภาษาไทย
- แปล API errors เป็นภาษาไทย
- ข้อความที่เข้าใจง่าย
- ไม่ใช้ technical terms

### 🎯 ตัวอย่างการแจ้งเตือน
```
✅ เพิ่มหนังสือสำเร็จ
   หนังสือ "React Native Guide" ถูกเพิ่มเข้าระบบแล้ว

❌ เข้าสู่ระบบไม่สำเร็จ  
   อีเมลหรือรหัสผ่านไม่ถูกต้อง

⚠️ ยืนยันการลบ
   คุณต้องการลบหนังสือ "React Native Guide" หรือไม่?
```

## 🔒 ความปลอดภัย (Security)

### 🛡️ Authentication
- JWT Token based authentication
- Token validation ทุก request
- Auto-logout เมื่อ token หมดอายุ
- Secure token storage ใน AsyncStorage

### 🔐 Authorization
- ผู้ใช้แก้ไข/ลบได้เฉพาะหนังสือของตัวเอง
- Admin สามารถจัดการหนังสือทั้งหมด
- Protected routes สำหรับหน้าที่ต้อง login

### 🛡️ Input Validation
- Client-side validation
- Server-side validation
- Sanitize input data
- Prevent injection attacks

## 📊 Performance Features

### ⚡ การโหลดข้อมูล
- **Pagination**: โหลดข้อมูลทีละหน้า
- **Infinite Scrolling**: โหลดเพิ่มเติมอัตโนมัติ
- **Pull-to-refresh**: รีเฟรชด้วยการดึงลง
- **Caching**: เก็บข้อมูลในหน่วยความจำ

### 🔄 Auto-refresh
- **useFocusEffect**: รีเฟรชเมื่อกลับมาหน้า
- **Real-time updates**: อัปเดตข้อมูลทันที
- **Background refresh**: รีเฟรชเบื้องหลัง

### 📱 Responsive Design
- **เข้ากันได้กับหน้าจอทุกขนาด**
- **Touch-friendly**: ปุ่มใหญ่พอสำหรับสัมผัส
- **Smooth animations**: การเคลื่อนไหวที่นุ่มนวล

## 🔧 การแก้ไขปัญหา (Troubleshooting)

### 🚫 ไม่สามารถเชื่อมต่อ API
```bash
# ตรวจสอบ IP Address
ipconfig          # Windows
ifconfig          # macOS/Linux

# ทดสอบการเชื่อมต่อ
ping 192.168.1.102
curl http://192.168.1.102:3000/health
```

**แก้ไข:**
- ใช้ IP address ที่ถูกต้อง
- ตรวจสอบ firewall
- ใช้ WiFi เครือข่ายเดียวกัน

### 🔑 ปัญหา Authentication
```bash
# ล้าง AsyncStorage
AsyncStorage.clear()
```

**แก้ไข:**
- ลบ cache แอป
- Login ใหม่
- ตรวจสอบ token expiry

### 📱 ปัญหา Development
```bash
# ล้าง cache
npx expo start --clear

# Restart Metro
npx expo start --reset-cache
```

**แก้ไข:**
- Restart development server
- ล้าง node_modules และ install ใหม่
- ตรวจสอบ dependencies

### 🌐 เฉพาะ iOS Simulator
```javascript
// ใช้ localhost แทน IP
API_BASE_URL: 'http://localhost:3000'
```

### 🤖 เฉพาะ Android Emulator  
```javascript
// ใช้ IP พิเศษสำหรับ Android Emulator
API_BASE_URL: 'http://10.0.2.2:3000'
```

## 🚀 แผนการพัฒนาต่อ (Roadmap)

### 📋 Phase 1: เพิ่มฟีเจอร์
- [ ] **Book Cover Upload**: อัปโหลดรูปปกหนังสือ
- [ ] **Advanced Search**: ค้นหาขั้นสูงแบบ multi-criteria
- [ ] **Categories Management**: จัดการหมวดหมู่หนังสือ
- [ ] **Bulk Operations**: จัดการหนังสือแบบ batch

### 📋 Phase 2: Social Features
- [ ] **Reviews & Ratings**: ระบบรีวิวและให้คะแนน
- [ ] **Favorites**: ระบบบุ๊กมาร์กหนังสือ
- [ ] **Sharing**: แชร์หนังสือกับเพื่อน
- [ ] **Recommendations**: แนะนำหนังสือ

### 📋 Phase 3: Advanced Features
- [ ] **Offline Support**: ใช้งานแบบ offline
- [ ] **Push Notifications**: แจ้งเตือนแบบ push
- [ ] **Export/Import**: ส่งออก/นำเข้าข้อมูล
- [ ] **Analytics**: สถิติการใช้งาน

### 📋 Phase 4: Platform Extension
- [ ] **Web Version**: เวอร์ชันเว็บ
- [ ] **Desktop App**: แอปพลิเคชันเดสก์ท็อป
- [ ] **API Documentation**: เอกสาร API แบบ interactive
- [ ] **Admin Dashboard**: หน้าจอผู้ดูแลระบบ

## 👥 การมีส่วนร่วม (Contributing)

### 🤝 วิธีการมีส่วนร่วม
1. Fork โปรเจค
2. สร้าง feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit การเปลี่ยนแปลง (`git commit -m 'Add some AmazingFeature'`)
4. Push ไปยัง branch (`git push origin feature/AmazingFeature`)
5. เปิด Pull Request

### 📝 Code Standards
- ใช้ JavaScript/JSX
- ตั้งชื่อตัวแปรแบบ camelCase
- เขียน comment เป็นภาษาไทย
- ทดสอบก่อน commit

### 🐛 รายงานจุดบกพร่อง
- เปิด Issue ใน GitHub
- ระบุขั้นตอนการทำซ้ำ
- แนบ screenshot (ถ้ามี)
- ระบุอุปกรณ์และเวอร์ชัน OS

## 📄 License

โปรเจคนี้ใช้ license แบบ MIT - ดูรายละเอียดในไฟล์ [LICENSE](LICENSE)

## 👨‍💻 ผู้พัฒนา

**ชวกร เนืองภา**
- GitHub: [@armychawakorn](https://github.com/armychawakorn)
- Email: [your-email@example.com]

## 🙏 กิตติกรรมประกาศ

- [React Native](https://reactnative.dev/) - Mobile app framework
- [Expo](https://expo.dev/) - Development platform
- [React Navigation](https://reactnavigation.org/) - Navigation library
- [AsyncStorage](https://github.com/react-native-async-storage/async-storage) - Local storage
- [Vector Icons](https://github.com/oblador/react-native-vector-icons) - Icon library

## 📈 สถิติโปรเจค

- **🗂️ Components**: 15+ หน้าจอและ component
- **🔌 API Endpoints**: 10+ endpoints
- **🎨 Themes**: 2 themes (Light/Dark)
- **🌐 Languages**: Thai/English support
- **📱 Platforms**: iOS และ Android
- **⚡ Performance**: Optimized สำหรับ mobile

---

<div align="center">

### 🎉 ขอบคุณที่ใช้ React Native ProfileApp! 

**หากโปรเจคนี้มีประโยชน์ อย่าลืมให้ ⭐ Star ใน GitHub นะครับ!**

</div>

---

**📅 Last Updated**: September 2, 2025  
**📱 Version**: 1.0.0  
**🚀 Status**: Production Ready  
**🔧 React Native**: 0.79.4  
**📦 Expo SDK**: 53