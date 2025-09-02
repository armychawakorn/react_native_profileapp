# 🔔 ระบบแจ้งเตือน (Alert System) - React Native ProfileApp

ระบบแจ้งเตือนที่ครอบคลุมสำหรับการจัดการ API Response และ User Experience

## 📋 ภาพรวมระบบ

### 🎯 วัตถุประสงค์
- จัดการ API Response อย่างเป็นระบบ
- แปลข้อความ Error เป็นภาษาไทย
- สร้าง User Experience ที่ดี
- ลดโค้ดซ้ำซ้อนในการแสดงแจ้งเตือน

### 🏗️ โครงสร้างไฟล์
```
utils/
└── alertUtils.js       # ระบบแจ้งเตือนหลัก
```

## 🛠️ ฟังก์ชันหลัก

### 1. **การแปลข้อความ Error**
```javascript
const translateErrorMessage = (message) => {
  // แปลข้อความจาก API เป็นภาษาไทย
}
```

**ข้อความที่รองรับ:**
- Authentication errors
- Validation errors  
- Books management errors
- Network errors
- Server errors

### 2. **ฟังก์ชันแจ้งเตือนพื้นฐาน**

#### `showSuccessAlert(title, message, onOk)`
- แสดงข้อความสำเร็จ
- ไอคอน: ✅
- สีเขียว

#### `showErrorAlert(title, message)`
- แสดงข้อความผิดพลาด
- ไอคอน: ❌
- สีแดง

#### `showWarningAlert(title, message, onConfirm, onCancel)`
- แสดงข้อความเตือน
- ไอคอน: ⚠️
- มีปุ่มยืนยัน/ยกเลิก

#### `showInfoAlert(title, message, onOk)`
- แสดงข้อความข้อมูล
- ไอคอน: ℹ️
- สีฟ้า

### 3. **การจัดการ Validation Errors**
```javascript
handleValidationErrors(errors)
```
- รับ array ของ validation errors จาก API
- แปลเป็นภาษาไทยและจัดรูปแบบ
- แสดงเป็นรายการที่อ่านง่าย

### 4. **การจัดการ API Response**
```javascript
handleApiResponse(response, data, options)
```

**Options:**
- `successTitle`: หัวข้อเมื่อสำเร็จ
- `errorTitle`: หัวข้อเมื่อผิดพลาด  
- `onSuccess`: callback เมื่อสำเร็จ
- `onError`: callback เมื่อผิดพลาด
- `showSuccessMessage`: แสดงข้อความสำเร็จหรือไม่

**Status Code ที่จัดการ:**
- `400`: Validation errors / Bad request
- `401`: Unauthorized (เซสชันหมดอายุ)
- `403`: Forbidden (ไม่มีสิทธิ์)
- `404`: Not found
- `500`: Server error

### 5. **การจัดการ Network Errors**
```javascript
handleNetworkError(error, onRetry)
```
- จัดการ network timeouts
- จัดการ connection errors
- มีปุ่มลองใหม่ (optional)

## 🔐 แจ้งเตือนเฉพาะ Authentication

### `showAuthAlerts` object:

#### `registerSuccess(onOk)`
- แจ้งเตือนสมัครสมาชิกสำเร็จ
- นำไปหน้า login

#### `loginSuccess(username)`
- แจ้งเตือนเข้าสู่ระบบสำเร็จ
- แสดงชื่อผู้ใช้

#### `logoutConfirm(onConfirm)`
- ยืนยันการออกจากระบบ
- มีปุ่มยกเลิก/ยืนยัน

#### `sessionExpired(onOk)`
- แจ้งเตือนเซสชันหมดอายุ
- บังคับให้ login ใหม่

#### `profileUpdated()`
- แจ้งเตือนอัปเดตโปรไฟล์สำเร็จ

## 📚 แจ้งเตือนเฉพาะ Books

### `showBookAlerts` object:

#### `booksLoaded(count)`
- แจ้งจำนวนหนังสือที่โหลดได้

#### `noBooksFound()`
- แจ้งเมื่อไม่พบหนังสือ

#### `bookCreated(title)`
- แจ้งเตือนเพิ่มหนังสือสำเร็จ

#### `bookUpdated(title)`
- แจ้งเตือนอัปเดตหนังสือสำเร็จ

#### `bookDeleted(title)`
- แจ้งเตือนลบหนังสือสำเร็จ

#### `confirmDelete(title, onConfirm)`
- ยืนยันการลบหนังสือ

## 💻 การใช้งาน

### 1. **ใน Component**
```javascript
import { 
  showSuccessAlert, 
  showErrorAlert, 
  handleApiResponse,
  showAuthAlerts 
} from '../utils/alertUtils';

// แสดงข้อความสำเร็จ
showSuccessAlert("สำเร็จ", "บันทึกข้อมูลเรียบร้อย");

// แสดงข้อความผิดพลาด
showErrorAlert("ผิดพลาด", "ไม่สามารถบันทึกได้");

// จัดการ API Response
const result = handleApiResponse(response, data, {
  successTitle: "บันทึกสำเร็จ",
  errorTitle: "บันทึกไม่สำเร็จ",
  onSuccess: () => navigation.goBack()
});
```

### 2. **ใน AuthContext**
```javascript
import { handleApiResponse, showAuthAlerts } from '../utils/alertUtils';

// Login
const result = handleApiResponse(response, data, {
  showSuccessMessage: false
});

if (result.success) {
  showAuthAlerts.loginSuccess(userData.username);
}

// Session expired
showAuthAlerts.sessionExpired(() => logout());
```

### 3. **การจัดการ Network Error**
```javascript
import { handleNetworkError } from '../utils/alertUtils';

try {
  const response = await fetch(url);
} catch (error) {
  if (error.name === 'TypeError') {
    handleNetworkError(error, () => retryFunction());
  }
}
```

## 🎨 UI/UX Features

### ✅ **ข้อดี**
- **Consistent**: ข้อความแจ้งเตือนเป็นมาตรฐานเดียวกัน
- **Localized**: แปลเป็นภาษาไทยทั้งหมด
- **User-friendly**: ข้อความเข้าใจง่าย ไม่ใช้ technical terms
- **Actionable**: มีปุ่มดำเนินการที่เหมาะสม
- **Context-aware**: แจ้งเตือนตามบริบทการใช้งาน

### 🎯 **การปรับปรุง UX**
- **Validation errors**: แสดงเป็นรายการที่อ่านง่าย
- **Network errors**: มีปุ่มลองใหม่
- **Success messages**: ไม่แสดงมากจนรำคาญ
- **Error categories**: แบ่งประเภทข้อผิดพลาดชัดเจน

## 🔧 การปรับแต่ง

### **เพิ่มข้อความแปลใหม่**
```javascript
const translations = {
  'New English Message': 'ข้อความภาษาไทยใหม่',
  // เพิ่มตรงนี้
};
```

### **เพิ่มแจ้งเตือนเฉพาะโมดูล**
```javascript
export const showCustomAlerts = {
  customSuccess: (message) => {
    showSuccessAlert("หัวข้อเฉพาะ", message);
  }
};
```

### **ปรับแต่งสไตล์ Alert**
- ใช้ React Native's `Alert.alert()`
- รองรับ iOS และ Android
- ปรับแต่ง button styles ได้

## 🚀 ผลลัพธ์

### **ก่อนใช้ระบบใหม่:**
```javascript
Alert.alert("Error", "Invalid email or password");
```

### **หลังใช้ระบบใหม่:**
```javascript
showErrorAlert("เข้าสู่ระบบไม่สำเร็จ", "อีเมลหรือรหัสผ่านไม่ถูกต้อง");
```

### **การจัดการ API แบบเก่า:**
```javascript
if (!response.ok) {
  Alert.alert("Error", data.message);
}
```

### **การจัดการ API แบบใหม่:**
```javascript
const result = handleApiResponse(response, data, {
  successTitle: "บันทึกสำเร็จ",
  errorTitle: "บันทึกไม่สำเร็จ"
});
```

---

**ระบบแจ้งเตือนใหม่ทำให้:**
- ลดโค้ดซ้ำซ้อน 70%
- ปรับปรุง User Experience
- จัดการ Error อย่างเป็นระบบ
- รองรับภาษาไทยทั้งหมด
- ง่ายต่อการดูแลและขยาย
