import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { showErrorAlert } from '../utils/alertUtils';

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();
  const { login } = useAuth();
  const router = useRouter();

  const handleSignin = async () => {
    if (!email || !password) {
      showErrorAlert("ข้อผิดพลาด", "กรุณากรอกอีเมลและรหัสผ่าน");
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      router.replace('/');
    } catch (error) {
      // Error จะถูกจัดการใน AuthContext แล้ว
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      justifyContent: 'center',
      paddingHorizontal: 20,
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
      <View style={dynamicStyles.card}>
        <Text style={dynamicStyles.title}>🔐 เข้าสู่ระบบ</Text>
        
        <TextInput
          style={dynamicStyles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="อีเมล"
          placeholderTextColor={theme.textSecondary}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isLoading}
        />
        
        <TextInput
          style={dynamicStyles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="รหัสผ่าน"
          placeholderTextColor={theme.textSecondary}
          secureTextEntry={true}
          editable={!isLoading}
        />
        
        <TouchableOpacity 
          style={[dynamicStyles.button, isLoading && dynamicStyles.disabledButton]}
          onPress={handleSignin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={dynamicStyles.buttonText}>เข้าสู่ระบบ</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={dynamicStyles.linkButton}
          onPress={() => router.push('/signup')}
          disabled={isLoading}
        >
          <Text style={dynamicStyles.linkText}>
            ยังไม่มีบัญชี? สมัครสมาชิก
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default Signin;
