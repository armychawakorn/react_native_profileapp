import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  handleApiResponse, 
  handleNetworkError, 
  showAuthAlerts 
} from '../utils/alertUtils';
import { CONFIG, getAuthUrl } from '../config/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // ตรวจสอบ token เมื่อเริ่มแอป
  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('authToken');
      const storedUser = await AsyncStorage.getItem('userData');
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        
        // ตรวจสอบว่า token ยังใช้งานได้หรือไม่
        await validateToken(storedToken);
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
      await logout();
    } finally {
      setIsLoading(false);
    }
  };

  const validateToken = async (authToken) => {
    try {
      const response = await fetch(getAuthUrl('profile'), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          showAuthAlerts.sessionExpired(() => logout());
          return false;
        }
        throw new Error(data.error || 'Token validation failed');
      }

      setUser(data.user);
      return true;
    } catch (error) {
      console.error('Token validation error:', error);
      if (error.name === 'TypeError' || error.name === 'AbortError') {
        // Network error - don't logout, just log the error
        console.warn('Network error during token validation:', error.message);
        return true; // Allow app to continue with stored data
      }
      await logout();
      return false;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch(getAuthUrl('login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      const result = handleApiResponse(response, data, {
        successTitle: "เข้าสู่ระบบสำเร็จ",
        errorTitle: "เข้าสู่ระบบไม่สำเร็จ",
        showSuccessMessage: false // เราจะแสดงข้อความเองด้านล่าง
      });

      if (result.success) {
        // เก็บ token และข้อมูลผู้ใช้
        const { token: authToken, user: userData } = data;
        
        await AsyncStorage.setItem('authToken', authToken);
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
        
        setToken(authToken);
        setUser(userData);

        // แสดงข้อความต้อนรับ
        showAuthAlerts.loginSuccess(userData.username);

        return data;
      } else {
        throw new Error(data.error || data.message || 'Login failed');
      }
    } catch (error) {
      if (error.name === 'TypeError' || error.name === 'AbortError') {
        handleNetworkError(error);
      }
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await fetch(getAuthUrl('register'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      const result = handleApiResponse(response, data, {
        successTitle: "สมัครสมาชิกสำเร็จ",
        errorTitle: "สมัครสมาชิกไม่สำเร็จ",
        showSuccessMessage: false // เราจะแสดงข้อความเองใน signup.jsx
      });

      if (result.success) {
        return data;
      } else {
        throw new Error(data.error || data.message || 'Registration failed');
      }
    } catch (error) {
      if (error.name === 'TypeError' || error.name === 'AbortError') {
        handleNetworkError(error);
      }
      console.error('Register error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userData');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setToken(null);
      setUser(null);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await fetch(getAuthUrl('profile'), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      const result = handleApiResponse(response, data, {
        successTitle: "อัปเดตโปรไฟล์สำเร็จ",
        errorTitle: "อัปเดตโปรไฟล์ไม่สำเร็จ",
        onSuccess: () => {
          showAuthAlerts.profileUpdated();
        }
      });

      if (result.success) {
        // อัปเดตข้อมูลผู้ใช้ในหน่วยความจำและ AsyncStorage
        setUser(data.user);
        await AsyncStorage.setItem('userData', JSON.stringify(data.user));
        return data;
      } else {
        if (response.status === 401) {
          showAuthAlerts.sessionExpired(() => logout());
          return;
        }
        throw new Error(data.error || data.message || 'Update failed');
      }
    } catch (error) {
      if (error.name === 'TypeError' || error.name === 'AbortError') {
        handleNetworkError(error);
      }
      console.error('Update profile error:', error);
      throw error;
    }
  };

  // ฟังก์ชันสำหรับการเรียก API ที่ต้องการ authentication
  const authenticatedFetch = async (url, options = {}) => {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (response.status === 401) {
        showAuthAlerts.sessionExpired(() => logout());
        throw new Error('Unauthorized');
      }

      return response;
    } catch (error) {
      if (error.name === 'TypeError' || error.name === 'AbortError') {
        handleNetworkError(error);
      }
      console.error('Authenticated fetch error:', error);
      throw error;
    }
  };

  const value = {
    user,
    token,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    authenticatedFetch,
    isAuthenticated: !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
