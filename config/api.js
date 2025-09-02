// Environment Configuration
// กำหนดค่าสำหรับการเชื่อมต่อ API

export const CONFIG = {
  // API Base URL - เปลี่ยนตรงนี้เมื่อต้องการใช้ server อื่น
  API_BASE_URL: 'http://192.168.1.102:3000',
  
  // API Endpoints
  API_ENDPOINTS: {
    // Authentication
    AUTH: {
      REGISTER: '/api/auth/register',
      LOGIN: '/api/auth/login',
      PROFILE: '/api/auth/profile',
    },
    
    // Books
    BOOKS: {
      LIST: '/api/books',
      CREATE: '/api/books',
      GET_BY_ID: (id) => `/api/books/${id}`,
      UPDATE: (id) => `/api/books/${id}`,
      DELETE: (id) => `/api/books/${id}`,
      MY_BOOKS: '/api/books/user/my-books',
      GENRES: '/api/books/genres/list',
    },
    
    // Health Check
    HEALTH: '/health',
  },
  
  // Request Configuration
  REQUEST_CONFIG: {
    TIMEOUT: 10000, // 10 seconds
    RETRY_ATTEMPTS: 3,
  },
  
  // Pagination
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 50,
  }
};

// Helper functions
export const getFullApiUrl = (endpoint) => {
  return `${CONFIG.API_BASE_URL}${endpoint}`;
};

export const getAuthUrl = (type) => {
  return getFullApiUrl(CONFIG.API_ENDPOINTS.AUTH[type.toUpperCase()]);
};

export const getBooksUrl = (type, id = null) => {
  const endpoint = typeof CONFIG.API_ENDPOINTS.BOOKS[type.toUpperCase()] === 'function'
    ? CONFIG.API_ENDPOINTS.BOOKS[type.toUpperCase()](id)
    : CONFIG.API_ENDPOINTS.BOOKS[type.toUpperCase()];
  
  return getFullApiUrl(endpoint);
};

// Development/Production check
export const isDevelopment = __DEV__;

// Network info for debugging
export const NETWORK_INFO = {
  API_SERVER: CONFIG.API_BASE_URL,
  LAST_UPDATED: '2025-09-02',
  NOTES: 'IP address 192.168.1.102 is for local network access from physical devices'
};
