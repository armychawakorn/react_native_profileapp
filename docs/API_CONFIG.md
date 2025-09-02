# 🌐 API Configuration Guide

คู่มือการตั้งค่าและเปลี่ยน API URL สำหรับ React Native ProfileApp

## 📊 ข้อมูลปัจจุบัน

### 🔗 **API Base URL**
- **Current**: `http://192.168.1.102:3000`
- **Last Updated**: September 2, 2025
- **Purpose**: เพื่อให้ physical device เข้าถึง API ได้

### 📱 **Network Requirements**
- อุปกรณ์ต้องอยู่ในเครือข่าย WiFi เดียวกัน
- API Server ต้องรันที่ `192.168.1.102:3000`
- Firewall ต้องอนุญาตการเชื่อมต่อ port 3000

## 🔧 การเปลี่ยน API URL

### **วิธีที่ 1: ใช้ Config File (แนะนำ)**

แก้ไขไฟล์ `config/api.js`:

```javascript
export const CONFIG = {
  // เปลี่ยน URL ตรงนี้
  API_BASE_URL: 'http://YOUR_NEW_IP:3000',
  
  // หรือใช้ localhost สำหรับ simulator
  // API_BASE_URL: 'http://localhost:3000',
  
  // หรือใช้ production server
  // API_BASE_URL: 'https://api.yourserver.com',
};
```

### **วิธีที่ 2: แก้ไขแต่ละไฟล์**

ถ้าไม่ใช้ config file ต้องแก้ไขไฟล์เหล่านี้:

1. **`contexts/AuthContext.js`**
2. **`app/book.jsx`**
3. **`README_AUTH.md`**

## 🚀 สถานการณ์การใช้งาน

### **1. Development (Simulator/Emulator)**
```javascript
API_BASE_URL: 'http://localhost:3000'
```
- ใช้กับ iOS Simulator
- ใช้กับ Android Emulator
- ง่ายต่อการ debug

### **2. Testing (Physical Device)**
```javascript
API_BASE_URL: 'http://192.168.1.102:3000'
```
- ใช้กับ iPhone/Android device จริง
- ต้องอยู่ในเครือข่ายเดียวกัน
- เหมาะสำหรับการทดสอบ

### **3. Production**
```javascript
API_BASE_URL: 'https://api.yourserver.com'
```
- ใช้ HTTPS
- ใช้ domain name
- มี SSL certificate

## 🛠️ การหา IP Address

### **Windows**
```bash
ipconfig
# ดู IPv4 Address ในส่วน WiFi adapter
```

### **macOS/Linux**
```bash
ifconfig
# หรือ
ip addr show
```

### **ทางเลือกอื่น**
- เข้า Router admin panel
- ใช้แอป network scanner
- ใช้คำสั่ง `arp -a`

## 🔍 การตรวจสอบการเชื่อมต่อ

### **1. Ping Test**
```bash
ping 192.168.1.102
```

### **2. Curl Test**
```bash
curl http://192.168.1.102:3000/health
```

### **3. Browser Test**
เปิดในเบราว์เซอร์:
```
http://192.168.1.102:3000/api-docs/
```

## ⚠️ การแก้ไขปัญหา

### **Cannot connect to API**

1. **ตรวจสอบ IP Address**
   ```bash
   ipconfig  # Windows
   ifconfig  # macOS/Linux
   ```

2. **ตรวจสอบ API Server**
   ```bash
   curl http://192.168.1.102:3000/health
   ```

3. **ตรวจสอบ Firewall**
   - Windows: ปิด Windows Firewall ชั่วคราว
   - macOS: ตรวจสอบ System Preferences > Security

4. **ตรวจสอบ Network**
   - ใช้ WiFi เดียวกัน
   - ไม่ใช้ VPN
   - ไม่ใช้ Guest network

### **iOS Simulator Issues**
```javascript
// ใช้ localhost สำหรับ iOS Simulator
API_BASE_URL: 'http://localhost:3000'
```

### **Android Emulator Issues**
```javascript
// ใช้ IP พิเศษสำหรับ Android Emulator
API_BASE_URL: 'http://10.0.2.2:3000'
```

## 📋 Checklist ก่อนเปลี่ยน URL

- [ ] API Server รันอยู่ที่ IP ใหม่
- [ ] Ping ได้จากอุปกรณ์ที่จะใช้
- [ ] Curl test สำเร็จ
- [ ] Browser test สำเร็จ
- [ ] Backup โค้ดเดิม
- [ ] Update documentation

## 🔄 การ Rollback

หากมีปัญหา สามารถเปลี่ยนกลับได้:

```javascript
// เปลี่ยนกลับเป็น localhost
API_BASE_URL: 'http://localhost:3000'
```

## 🎯 Best Practices

### **1. ใช้ Environment Variables**
```javascript
const API_BASE_URL = __DEV__ 
  ? 'http://192.168.1.102:3000'  // Development
  : 'https://api.production.com'; // Production
```

### **2. ใช้ Config File**
- แยกการตั้งค่าออกจากโค้ด
- ง่ายต่อการเปลี่ยนแปลง
- รองรับหลาย environment

### **3. Error Handling**
- ตรวจสอบ network connectivity
- มี fallback URL
- แสดงข้อความ error ที่เข้าใจง่าย

### **4. Security**
- ใช้ HTTPS ใน production
- ตรวจสอบ SSL certificate
- ไม่ hardcode sensitive data

---

**สำหรับข้อสงสัยเพิ่มเติม**
- ดูที่ `utils/alertUtils.js` สำหรับ error messages
- ดูที่ `contexts/AuthContext.js` สำหรับ authentication
- ดูที่ `README_AUTH.md` สำหรับระบบ authentication

**Updated**: September 2, 2025
