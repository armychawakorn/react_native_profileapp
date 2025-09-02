# 📚 Books Management System - API Documentation

## Overview
ระบบจัดการหนังสือที่ครบครันสำหรับ React Native ProfileApp ที่รองรับการสร้าง, แก้ไข, ลบ, และค้นหาหนังสือ

## API Endpoints

### 🔍 1. แสดงข้อมูลหนังสือทั้งหมด
```
GET /api/books
```

**Parameters:**
- `page` (optional): หน้าที่ต้องการ (default: 1)
- `limit` (optional): จำนวนรายการต่อหน้า (default: 10)
- `search` (optional): คำค้นหาในชื่อ, ผู้แต่ง, หรือคำอธิบาย
- `genre` (optional): กรองตามหมวดหมู่
- `available` (optional): กรองตามสถานะมีสินค้า (true/false)

**Response:**
```json
{
  "books": [
    {
      "_id": "book_id",
      "title": "ชื่อหนังสือ",
      "author": "ชื่อผู้แต่ง",
      "description": "คำอธิบาย",
      "genre": "หมวดหมู่",
      "year": 2024,
      "price": 299,
      "available": true,
      "addedBy": {
        "_id": "user_id",
        "username": "username",
        "email": "email@example.com"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

### 📖 2. แสดงข้อมูลหนังสือรายไอดี
```
GET /api/books/:id
```

**Response:**
```json
{
  "book": {
    "_id": "book_id",
    "title": "ชื่อหนังสือ",
    "author": "ชื่อผู้แต่ง",
    "description": "คำอธิบาย",
    "genre": "หมวดหมู่",
    "year": 2024,
    "price": 299,
    "available": true,
    "addedBy": {
      "_id": "user_id",
      "username": "username",
      "email": "email@example.com"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### ➕ 3. สร้างข้อมูลหนังสือใหม่
```
POST /api/books
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "ชื่อหนังสือ", // Required, max 200 chars
  "author": "ชื่อผู้แต่ง", // Required, max 100 chars
  "description": "คำอธิบาย", // Optional, max 1000 chars
  "genre": "หมวดหมู่", // Optional, max 50 chars
  "year": 2024, // Optional, 1000-current year
  "price": 299, // Optional, >= 0
  "available": true // Optional, default true
}
```

**Response:**
```json
{
  "message": "Book created successfully",
  "book": { /* book object */ }
}
```

### ✏️ 4. แก้ไขข้อมูลหนังสือ
```
PUT /api/books/:id
Authorization: Bearer <token>
```

**Request Body:** (ทุกฟิลด์เป็น optional)
```json
{
  "title": "ชื่อหนังสือใหม่",
  "author": "ชื่อผู้แต่งใหม่",
  "description": "คำอธิบายใหม่",
  "genre": "หมวดหมู่ใหม่",
  "year": 2024,
  "price": 399,
  "available": false
}
```

**Response:**
```json
{
  "message": "Book updated successfully",
  "book": { /* updated book object */ }
}
```

### 🗑️ 5. ลบข้อมูลหนังสือ
```
DELETE /api/books/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Book deleted successfully"
}
```

### 📚 6. ดูหนังสือของผู้ใช้ปัจจุบัน
```
GET /api/books/user/my-books
Authorization: Bearer <token>
```

**Parameters:**
- `page` (optional): หน้าที่ต้องการ (default: 1)
- `limit` (optional): จำนวนรายการต่อหน้า (default: 10)

**Response:** เหมือนกับ GET /api/books แต่จะแสดงเฉพาะหนังสือของผู้ใช้

### 🏷️ 7. ดูหมวดหมู่ที่มีอยู่
```
GET /api/books/genres/list
```

**Response:**
```json
{
  "genres": ["นิยาย", "วิทยาศาสตร์", "ประวัติศาสตร์", "เทคโนโลยี"]
}
```

## Frontend Implementation

### 🎯 Screen Components

#### 1. **book.jsx** - รายการหนังสือทั้งหมด
- แสดงหนังสือทั้งหมดพร้อม pagination
- ค้นหาและกรองข้อมูล
- การ์ดหนังสือแบบสวยงาม
- สามารถแก้ไข/ลบหนังสือของตัวเอง

#### 2. **book-detail.jsx** - รายละเอียดหนังสือ
- แสดงข้อมูลครบถ้วนของหนังสือ
- ปุ่มแก้ไข/ลบสำหรับเจาของ
- UI ที่สวยงามพร้อม icons

#### 3. **book-form.jsx** - ฟอร์มเพิ่ม/แก้ไขหนังสือ
- ฟอร์มที่ใช้ได้ทั้งสร้างใหม่และแก้ไข
- Validation ครบถ้วน
- เลือกหมวดหมู่จากรายการที่มีอยู่

#### 4. **my-books.jsx** - หนังสือของผู้ใช้
- แสดงเฉพาะหนังสือของผู้ใช้ปัจจุบัน
- สถิติจำนวนหนังสือ
- ลิงก์สำหรับแก้ไข/ลบ

### ✨ Features

#### 🔍 การค้นหาและกรอง
- ค้นหาในชื่อหนังสือ, ผู้แต่ง, คำอธิบาย
- กรองตามหมวดหมู่
- กรองตามสถานะมีสินค้า
- แสดงผลการค้นหาแบบ real-time

#### 🎨 UI/UX ที่สวยงาม
- การ์ดหนังสือ responsive
- แสดงสถานะหนังสือ (มีสินค้า/หมด)
- Tags สำหรับหมวดหมู่
- Loading states และ Empty states
- Pull-to-refresh
- Infinite scrolling

#### 🔐 การจัดการสิทธิ์
- ผู้ใช้สามารถแก้ไข/ลบหนังสือของตัวเองได้เท่านั้น
- Admin สามารถจัดการหนังสือทั้งหมด
- Authentication required สำหรับการสร้าง/แก้ไข/ลบ

#### 📱 Responsive Design
- ปรับขนาดตามหน้าจอ
- รองรับทั้ง light และ dark theme
- Animation และ transitions ที่นุ่มนวล

### 🛠️ Technical Implementation

#### API Integration
```javascript
// Example: Get all books with search
const fetchBooks = async (page = 1, search = '', genre = '') => {
  const url = `${getBooksUrl('list')}?page=${page}&search=${search}&genre=${genre}`;
  const response = await authenticatedFetch(url);
  const data = await response.json();
  return data;
};

// Example: Create new book
const createBook = async (bookData) => {
  const response = await authenticatedFetch(getBooksUrl('CREATE'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookData)
  });
  return response;
};
```

#### State Management
```javascript
const [books, setBooks] = useState([]);
const [loading, setLoading] = useState(false);
const [searchQuery, setSearchQuery] = useState('');
const [selectedGenre, setSelectedGenre] = useState('');
const [page, setPage] = useState(1);
const [hasMore, setHasMore] = useState(true);
```

#### Form Validation
```javascript
const validateForm = () => {
  const errors = {};
  if (!title.trim()) errors.title = 'กรุณาใส่ชื่อหนังสือ';
  if (!author.trim()) errors.author = 'กรุณาใส่ชื่อผู้แต่ง';
  if (year && (isNaN(year) || year < 1000)) errors.year = 'ปีไม่ถูกต้อง';
  if (price && (isNaN(price) || price < 0)) errors.price = 'ราคาไม่ถูกต้อง';
  return errors;
};
```

## 🎯 Usage Examples

### สร้างหนังสือใหม่
```javascript
const bookData = {
  title: "การเขียนโปรแกรม React Native",
  author: "นักพัฒนา A",
  description: "หนังสือสอนการเขียนแอป React Native ตั้งแต่เริ่มต้น",
  genre: "เทคโนโลยี",
  year: 2024,
  price: 599,
  available: true
};

// จะถูกส่งไปยัง POST /api/books
```

### ค้นหาหนังสือ
```javascript
// ค้นหาหนังสือที่มีคำว่า "React" และอยู่ในหมวด "เทคโนโลยี"
const searchResults = await fetchBooks(1, "React", "เทคโนโลยี");
```

### แก้ไขหนังสือ
```javascript
const updateData = {
  price: 399, // เปลี่ยนราคาเท่านั้น
  available: false // เปลี่ยนสถานะ
};

// จะถูกส่งไปยัง PUT /api/books/:id
```

## 🔄 Navigation Flow

```
Settings → จัดการหนังสือ → [ดูทั้งหมด / หนังสือของฉัน / เพิ่มใหม่]
                       ↓
Book List → Book Detail → [แก้ไข / ลบ]
          ↓
      Book Form (Create/Edit)
```

## 🚀 Next Steps

1. **Search Enhancement**: เพิ่มการค้นหาแบบ Advanced
2. **Categories Management**: ระบบจัดการหมวดหมู่
3. **Book Cover**: รองรับการอัปโหลดรูปปกหนังสือ
4. **Reviews System**: ระบบรีวิวและให้คะแนนหนังสือ
5. **Favorites**: ระบบบุ๊กมาร์กหนังสือ
6. **Export/Import**: ส่งออก/นำเข้าข้อมูลหนังสือ

## 📞 API Base URL
Current: `http://192.168.1.102:3000`
API Documentation: `http://192.168.1.102:3000/api-docs/`
