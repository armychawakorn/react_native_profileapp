// ระบบแจ้งเตือนสำหรับ API Response
import { Alert } from 'react-native';

/**
 * แปลงข้อความ error จาก API เป็นภาษาไทย
 */
const translateErrorMessage = (message) => {
  const translations = {
    // Authentication errors
    'Invalid email or password': 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
    'User with this email or username already exists': 'มีผู้ใช้ที่ใช้อีเมลหรือชื่อผู้ใช้นี้แล้ว',
    'Registration failed': 'การสมัครสมาชิกล้มเหลว',
    'Login failed': 'การเข้าสู่ระบบล้มเหลว',
    'Failed to get profile': 'ไม่สามารถดึงข้อมูลโปรไฟล์ได้',
    'Failed to update profile': 'ไม่สามารถอัปเดตโปรไฟล์ได้',
    'Unauthorized': 'ไม่มีสิทธิ์เข้าถึง',
    'Invalid or missing token': 'Token ไม่ถูกต้องหรือหายไป',
    
    // Validation errors
    'Username must be between 3 and 30 characters': 'ชื่อผู้ใช้ต้องมี 3-30 ตัวอักษร',
    'Username can only contain letters, numbers, and underscores': 'ชื่อผู้ใช้ใช้ได้เฉพาะตัวอักษร ตัวเลข และขีดล่าง (_)',
    'Please enter a valid email': 'กรุณากรอกอีเมลที่ถูกต้อง',
    'Password must be at least 6 characters long': 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร',
    'Password is required': 'กรุณากรอกรหัสผ่าน',
    
    // Books errors
    'Book not found': 'ไม่พบหนังสือ',
    'Failed to create book': 'ไม่สามารถสร้างหนังสือได้',
    'Failed to update book': 'ไม่สามารถอัปเดตหนังสือได้',
    'Failed to delete book': 'ไม่สามารถลบหนังสือได้',
    'Failed to get books': 'ไม่สามารถดึงข้อมูลหนังสือได้',
    'Access denied': 'ไม่มีสิทธิ์เข้าถึง',
    
    // General errors
    'Server error': 'เกิดข้อผิดพลาดที่เซิร์ฟเวอร์',
    'Network error': 'เกิดข้อผิดพลาดเครือข่าย',
    'Request timeout': 'หมดเวลาการเชื่อมต่อ',
  };
  
  return translations[message] || message;
};

/**
 * แสดงข้อความแจ้งเตือนความสำเร็จ
 */
export const showSuccessAlert = (title, message, onOk = null) => {
  Alert.alert(
    `✅ ${title}`,
    message,
    [
      {
        text: "ตกลง",
        style: "default",
        onPress: onOk
      }
    ]
  );
};

/**
 * แสดงข้อความแจ้งเตือนข้อผิดพลาด
 */
export const showErrorAlert = (title, message) => {
  const translatedMessage = translateErrorMessage(message);
  Alert.alert(
    `❌ ${title}`,
    translatedMessage,
    [
      {
        text: "ตกลง",
        style: "default"
      }
    ]
  );
};

/**
 * แสดงข้อความแจ้งเตือนคำเตือน
 */
export const showWarningAlert = (title, message, onConfirm, onCancel = null) => {
  Alert.alert(
    `⚠️ ${title}`,
    message,
    [
      {
        text: "ยกเลิก",
        style: "cancel",
        onPress: onCancel
      },
      {
        text: "ยืนยัน",
        style: "destructive",
        onPress: onConfirm
      }
    ]
  );
};

/**
 * แสดงข้อความแจ้งเตือนข้อมูล
 */
export const showInfoAlert = (title, message, onOk = null) => {
  Alert.alert(
    `ℹ️ ${title}`,
    message,
    [
      {
        text: "ตกลง",
        style: "default",
        onPress: onOk
      }
    ]
  );
};

/**
 * จัดการ validation errors จาก API
 */
export const handleValidationErrors = (errors) => {
  if (!errors || !Array.isArray(errors)) {
    showErrorAlert("ข้อผิดพลาด", "เกิดข้อผิดพลาดในการตรวจสอบข้อมูล");
    return;
  }

  const translatedErrors = errors.map(error => {
    const field = error.path || error.field || 'ข้อมูล';
    const message = translateErrorMessage(error.msg || error.message);
    return `• ${message}`;
  }).join('\n');

  showErrorAlert("ข้อมูลไม่ถูกต้อง", translatedErrors);
};

/**
 * จัดการ API Response แบบครอบคลุม
 */
export const handleApiResponse = (response, data, options = {}) => {
  const {
    successTitle = "สำเร็จ",
    errorTitle = "เกิดข้อผิดพลาด",
    onSuccess = null,
    onError = null,
    showSuccessMessage = true
  } = options;

  // กรณี response สำเร็จ
  if (response.ok) {
    const message = data.message || "ดำเนินการเสร็จสิ้น";
    
    if (showSuccessMessage) {
      showSuccessAlert(successTitle, message, onSuccess);
    } else if (onSuccess) {
      onSuccess();
    }
    
    return { success: true, data };
  }

  // กรณี response ไม่สำเร็จ
  let errorMessage = "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ";

  switch (response.status) {
    case 400:
      // Validation errors
      if (data.errors && Array.isArray(data.errors)) {
        handleValidationErrors(data.errors);
        if (onError) onError(data);
        return { success: false, error: data };
      }
      // Other 400 errors
      errorMessage = data.error || data.message || "ข้อมูลไม่ถูกต้อง";
      break;

    case 401:
      errorMessage = "เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่";
      break;

    case 403:
      errorMessage = "ไม่มีสิทธิ์เข้าถึงข้อมูลนี้";
      break;

    case 404:
      errorMessage = "ไม่พบข้อมูลที่ต้องการ";
      break;

    case 500:
      errorMessage = "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์";
      break;

    default:
      errorMessage = data.error || data.message || `เกิดข้อผิดพลาด (${response.status})`;
  }

  showErrorAlert(errorTitle, errorMessage);
  
  if (onError) {
    onError(data);
  }

  return { success: false, error: data };
};

/**
 * จัดการ Network errors
 */
export const handleNetworkError = (error, onRetry = null) => {
  console.error('Network error:', error);
  
  let message = "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้";
  
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    message = "ตรวจสอบการเชื่อมต่ออินเทอร์เน็ตของคุณ";
  } else if (error.name === 'AbortError') {
    message = "หมดเวลาการเชื่อมต่อ";
  }

  if (onRetry) {
    Alert.alert(
      "❌ เชื่อมต่อไม่ได้",
      message,
      [
        {
          text: "ยกเลิก",
          style: "cancel"
        },
        {
          text: "ลองใหม่",
          style: "default",
          onPress: onRetry
        }
      ]
    );
  } else {
    showErrorAlert("เชื่อมต่อไม่ได้", message);
  }
};

/**
 * แจ้งเตือนสำหรับ Authentication เฉพาะ
 */
export const showAuthAlerts = {
  // Register success
  registerSuccess: (onOk) => {
    showSuccessAlert(
      "สมัครสมาชิกสำเร็จ",
      "ยินดีต้อนรับ! คุณสามารถเข้าสู่ระบบได้แล้ว",
      onOk
    );
  },

  // Login success
  loginSuccess: (username) => {
    showSuccessAlert(
      "เข้าสู่ระบบสำเร็จ",
      `ยินดีต้อนรับคุณ ${username}!`
    );
  },

  // Logout confirmation
  logoutConfirm: (onConfirm) => {
    showWarningAlert(
      "ออกจากระบบ",
      "คุณต้องการออกจากระบบหรือไม่?",
      onConfirm
    );
  },

  // Session expired
  sessionExpired: (onOk) => {
    showWarningAlert(
      "เซสชันหมดอายุ",
      "กรุณาเข้าสู่ระบบใหม่อีกครั้ง",
      onOk
    );
  },

  // Profile updated
  profileUpdated: () => {
    showSuccessAlert(
      "อัปเดตโปรไฟล์สำเร็จ",
      "ข้อมูลของคุณได้รับการอัปเดตแล้ว"
    );
  }
};

/**
 * แจ้งเตือนสำหรับ Books เฉพาะ
 */
export const showBookAlerts = {
  // Books loaded
  booksLoaded: (count) => {
    showInfoAlert(
      "โหลดข้อมูลสำเร็จ",
      `พบหนังสือ ${count} เล่ม`
    );
  },

  // No books found
  noBooksFound: () => {
    showInfoAlert(
      "ไม่พบหนังสือ",
      "ยังไม่มีหนังสือในระบบ"
    );
  },

  // Book created
  bookCreated: (title) => {
    showSuccessAlert(
      "เพิ่มหนังสือสำเร็จ",
      `หนังสือ "${title}" ถูกเพิ่มเข้าระบบแล้ว`
    );
  },

  // Book updated
  bookUpdated: (title) => {
    showSuccessAlert(
      "อัปเดตหนังสือสำเร็จ",
      `หนังสือ "${title}" ได้รับการอัปเดตแล้ว`
    );
  },

  // Book deleted
  bookDeleted: (title) => {
    showSuccessAlert(
      "ลบหนังสือสำเร็จ",
      `หนังสือ "${title}" ถูกลบออกจากระบบแล้ว`
    );
  },

  // Delete confirmation
  confirmDelete: (title, onConfirm) => {
    showWarningAlert(
      "ยืนยันการลบ",
      `คุณต้องการลบหนังสือ "${title}" หรือไม่?`,
      onConfirm
    );
  }
};
