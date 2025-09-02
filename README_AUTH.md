# React Native Profile App with Authentication

โปรเจค React Native สำหรับแสดงข้อมูลส่วนตัว พร้อมระบบ Authentication ที่เชื่อมต่อกับ Classroom API

## 🚀 ฟีเจอร์ใหม่ที่เพิ่มเข้ามา

### 🔐 ระบบ Authentication
- **หน้าสมัครสมาชิก (Register)**: `/signup`
- **หน้าเข้าสู่ระบบ (Login)**: `/signin`
- **การจัดการ Token**: เก็บ JWT token ใน AsyncStorage
- **Auto-logout**: แจ้งเตือนเมื่อ token หมดอายุ
- **Token Validation**: ตรวจสอบ token อัตโนมัติ

### 📱 หน้าจอที่อัปเดต
1. **หน้าหลัก (index.jsx)**
   - แสดงข้อมูลผู้ใช้จาก API
   - ปุ่มออกจากระบบ
   - ปุ่มไปหน้าหนังสือ

2. **หน้าหนังสือ (book.jsx)**
   - เปลี่ยน API URL จาก `10.0.15.16` เป็น `192.168.1.102`
   - ใช้ authenticated requests
   - เพิ่ม Loading states และ Error handling
   - Pull-to-refresh และ infinite scroll

3. **หน้า Settings (settings.js)**
   - เพิ่มปุ่มออกจากระบบ
   - แสดงข้อมูลผู้ใช้ปัจจุบัน

### 🎨 UI/UX Improvements
- Loading screen สำหรับการตรวจสอบ authentication
- Alert dialogs สำหรับการยืนยัน
- Responsive design รองรับ Light/Dark theme
- Error handling ที่ดีขึ้น

## 🏗️ โครงสร้างไฟล์ใหม่

```
app/
├── _layout.js          # Navigation + Auth wrapper
├── index.jsx           # หน้าหลัก (อัปเดต)
├── signin.jsx          # หน้าเข้าสู่ระบบ (ใหม่)
├── signup.jsx          # หน้าสมัครสมาชิก (ใหม่)
├── book.jsx            # หน้าหนังสือ (อัปเดต)
├── about.jsx           # หน้ารายวิชา
└── settings.js         # หน้าตั้งค่า (อัปเดต)

contexts/
├── ThemeContext.js     # การจัดการธีม
└── AuthContext.js      # การจัดการ Authentication (ใหม่)

components/
└── LoadingScreen.js    # หน้าจอ Loading (ใหม่)
```

## 🔌 API Endpoints ที่ใช้

### Authentication
- `POST /api/auth/register` - สมัครสมาชิก
- `POST /api/auth/login` - เข้าสู่ระบบ
- `GET /api/auth/profile` - ดูข้อมูลโปรไฟล์
- `PUT /api/auth/profile` - อัปเดตโปรไฟล์

### Books
- `GET /api/books` - ดึงรายการหนังสือ (พร้อม pagination)

## 📦 Dependencies ใหม่

```json
{
  "@react-native-async-storage/async-storage": "^1.x.x"
}
```

## 🚀 การติดตั้งและรัน

1. ติดตั้ง dependencies:
```bash
npm install
```

2. รัน development server:
```bash
npx expo start
```

3. เปิด Expo Go บนมือถือและสแกน QR code

## 🔒 การทำงานของระบบ Authentication

### 1. การเข้าสู่ระบบ
- ผู้ใช้กรอก email และ password
- ส่งข้อมูลไปยัง API `/api/auth/login`
- เก็บ JWT token และข้อมูลผู้ใช้ใน AsyncStorage
- นำไปใช้ในการเรียก API ครั้งต่อไป

### 2. การตรวจสอบ Token
- ตรวจสอบ token ทุกครั้งที่เปิดแอป
- ส่ง request ไปยัง `/api/auth/profile`
- หาก token หมดอายุ (401) จะแจ้งเตือนและออกจากระบบ

### 3. การออกจากระบบ
- ลบ token และข้อมูลผู้ใช้จาก AsyncStorage
- นำกลับไปหน้า login

## 🛡️ Security Features

- **Token-based Authentication** ด้วย JWT
- **Automatic token validation** ตรวจสอบความถูกต้องของ token
- **Secure storage** ใช้ AsyncStorage สำหรับเก็บข้อมูลสำคัญ
- **Auto-logout** เมื่อ token หมดอายุ
- **Input validation** ตรวจสอบข้อมูลก่อนส่ง

## 🎯 การใช้งาน

1. **สมัครสมาชิก**: กรอกข้อมูลและสมัครสมาชิกใหม่
2. **เข้าสู่ระบบ**: ใช้ email/password ที่สมัครไว้
3. **ดูข้อมูลส่วนตัว**: หน้าหลักจะแสดงข้อมูลจาก API
4. **ดูรายการหนังสือ**: เข้าหน้าหนังสือผ่านเมนู
5. **จัดการธีม**: เปลี่ยน Light/Dark mode ในหน้า Settings
6. **ออกจากระบบ**: ผ่านปุ่มในหน้าหลักหรือ Settings

## ⚠️ หมายเหตุ

- **API Server**: ต้องรัน Classroom API ที่ `http://192.168.1.102:3000`
- **Network**: API ใช้ IP address `192.168.1.102` เพื่อให้ physical device เข้าถึงได้
- **Development**: ใช้ Expo Go สำหรับการทดสอบ

## 🔧 การแก้ไขปัญหา

### 1. Cannot connect to API
- ตรวจสอบว่า API server รันอยู่ที่ `192.168.1.102:3000`
- ตรวจสอบว่าอุปกรณ์อยู่ในเครือข่ายเดียวกัน

### 2. Authentication issues
- ลบ cache: ไปที่ Settings > Apps > Expo Go > Storage > Clear
- หรือใช้ `AsyncStorage.clear()` ในโค้ด

### 3. Loading issues
- Restart Metro bundler: กด `r` ใน terminal
- Clear cache: `npx expo start --clear`

---

**Developer**: ชวกร เนืองภา
**Version**: 1.0.0 with Authentication
**Framework**: React Native + Expo + Classroom API
