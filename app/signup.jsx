import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, ScrollView } from "react-native";
import { useRouter } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { showAuthAlerts, showErrorAlert } from '../utils/alertUtils';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();
  const { register } = useAuth();
  const router = useRouter();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const { username, email, password, confirmPassword } = formData;
    
    if (!username || !email || !password) {
      showErrorAlert("ข้อผิดพลาด", "กรุณากรอกข้อมูลให้ครบถ้วน");
      return false;
    }

    if (username.length < 3 || username.length > 30) {
      showErrorAlert("ข้อผิดพลาด", "ชื่อผู้ใช้ต้องมี 3-30 ตัวอักษร");
      return false;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      showErrorAlert("ข้อผิดพลาด", "ชื่อผู้ใช้ใช้ได้เฉพาะตัวอักษร ตัวเลข และขีดล่าง (_)");
      return false;
    }

    if (password !== confirmPassword) {
      showErrorAlert("ข้อผิดพลาด", "รหัสผ่านไม่ตรงกัน");
      return false;
    }

    if (password.length < 6) {
      showErrorAlert("ข้อผิดพลาด", "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showErrorAlert("ข้อผิดพลาด", "รูปแบบอีเมลไม่ถูกต้อง");
      return false;
    }

    return true;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // ส่งเฉพาะข้อมูลที่ API ต้องการ
      const { username, email, password } = formData;
      await register({ username, email, password });
      
      // แสดงข้อความสำเร็จและไปหน้า signin
      showAuthAlerts.registerSuccess(() => router.replace('/signin'));
    } catch (error) {
      // Error จะถูกจัดการใน AuthContext แล้ว
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollContainer: {
      flexGrow: 1,
      justifyContent: 'center',
      paddingHorizontal: 20,
      paddingVertical: 40,
    },
    card: {
      backgroundColor: theme.cardBackground,
      borderRadius: 15,
      padding: 30,
      shadowColor: theme.shadowColor,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.text,
      textAlign: 'center',
      marginBottom: 30,
    },
    input: {
      backgroundColor: theme.surface,
      borderRadius: 10,
      padding: 15,
      marginBottom: 15,
      fontSize: 16,
      color: theme.text,
      borderWidth: 1,
      borderColor: theme.border,
    },
    button: {
      backgroundColor: theme.primary,
      borderRadius: 10,
      padding: 15,
      alignItems: 'center',
      marginTop: 10,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    linkButton: {
      marginTop: 20,
      alignItems: 'center',
    },
    linkText: {
      color: theme.secondary,
      fontSize: 16,
    },
    disabledButton: {
      backgroundColor: theme.textSecondary,
    },
  });

  return (
    <View style={dynamicStyles.container}>
      <ScrollView contentContainerStyle={dynamicStyles.scrollContainer}>
        <View style={dynamicStyles.card}>
          <Text style={dynamicStyles.title}>📝 สมัครสมาชิก</Text>
          
          <TextInput
            style={dynamicStyles.input}
            value={formData.username}
            onChangeText={(text) => handleInputChange('username', text)}
            placeholder="ชื่อผู้ใช้ (3-30 ตัวอักษร, a-z, 0-9, _)"
            placeholderTextColor={theme.textSecondary}
            autoCapitalize="none"
            editable={!isLoading}
          />
          
          <TextInput
            style={dynamicStyles.input}
            value={formData.email}
            onChangeText={(text) => handleInputChange('email', text)}
            placeholder="อีเมล"
            placeholderTextColor={theme.textSecondary}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isLoading}
          />
          
          <TextInput
            style={dynamicStyles.input}
            value={formData.password}
            onChangeText={(text) => handleInputChange('password', text)}
            placeholder="รหัสผ่าน (อย่างน้อย 6 ตัวอักษร)"
            placeholderTextColor={theme.textSecondary}
            secureTextEntry={true}
            editable={!isLoading}
          />

          <TextInput
            style={dynamicStyles.input}
            value={formData.confirmPassword}
            onChangeText={(text) => handleInputChange('confirmPassword', text)}
            placeholder="ยืนยันรหัสผ่าน"
            placeholderTextColor={theme.textSecondary}
            secureTextEntry={true}
            editable={!isLoading}
          />
          
          <TouchableOpacity 
            style={[dynamicStyles.button, isLoading && dynamicStyles.disabledButton]}
            onPress={handleSignup}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={dynamicStyles.buttonText}>สมัครสมาชิก</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={dynamicStyles.linkButton}
            onPress={() => router.push('/signin')}
            disabled={isLoading}
          >
            <Text style={dynamicStyles.linkText}>
              มีบัญชีแล้ว? เข้าสู่ระบบ
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};
export default Signup;
