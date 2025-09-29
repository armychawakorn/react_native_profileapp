import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, SafeAreaView } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { useLocalAuth } from '../contexts/LocalAuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useRouter } from 'expo-router';
import PinModal from '../components/PinModal';

const LocalAuthScreen = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const { supported, enrolled, refreshDeviceStatus } = useLocalAuth();

  const [status, setStatus] = useState('checking'); // checking | prompt | failed | success | unsupported | pin
  const [message, setMessage] = useState('');
  const [showPin, setShowPin] = useState(false);

  const dynamic = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    card: {
      backgroundColor: theme.cardBackground,
      margin: 20,
      marginTop: 40,
      borderRadius: 16,
      padding: 24,
      alignItems: 'center',
      shadowColor: theme.shadowColor,
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
    },
    title: { fontSize: 22, fontWeight: '700', color: theme.text, marginBottom: 8, textAlign: 'center' },
    desc: { fontSize: 14, color: theme.textSecondary, textAlign: 'center' },
    btn: {
      backgroundColor: theme.secondary,
      paddingVertical: 12,
      paddingHorizontal: 18,
      borderRadius: 10,
      marginTop: 18,
    },
    btnText: { color: '#fff', fontWeight: '600' },
    hint: { marginTop: 10, color: theme.textSecondary, fontSize: 12, textAlign: 'center' },
    error: { color: theme.accent, marginTop: 12, textAlign: 'center' },
  });

  const startAuth = useCallback(async () => {
    setMessage('');
    await refreshDeviceStatus();
    if (!supported) {
      setStatus('unsupported');
      return;
    }
    if (!enrolled) {
      setStatus('unsupported');
      return;
    }
    setStatus('prompt');
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'ยืนยันตัวตน',
      fallbackLabel: 'ใช้รหัสอุปกรณ์',
      cancelLabel: 'ยกเลิก',
      disableDeviceFallback: false,
    });
    if (result.success) {
      setStatus('success');
      router.replace('/signin');
    } else {
      setStatus('failed');
      setMessage(result.warning || 'การยืนยันถูกยกเลิกหรือไม่สำเร็จ');
    }
  }, [router, enrolled, supported, refreshDeviceStatus]);

  useEffect(() => {
    const init = async () => {
      setStatus('checking');
      await startAuth();
    };
    init();
  }, [startAuth]);

  return (
    <SafeAreaView style={dynamic.container}>
      <View style={dynamic.card}>
        <Text style={dynamic.title}>🔐 Local Authentication</Text>
        {status === 'checking' && (
          <>
            <ActivityIndicator size="large" color={theme.secondary} />
            <Text style={dynamic.hint}>กำลังตรวจสอบอุปกรณ์...</Text>
          </>
        )}
        {status === 'prompt' && (
          <>
            <Text style={dynamic.desc}>โปรดยืนยันตัวตนด้วย Face ID / Touch ID หรือรหัสอุปกรณ์</Text>
            <Text style={dynamic.hint}>หน้าต่างระบบควรปรากฏขึ้นอัตโนมัติ</Text>
          </>
        )}
        {status === 'failed' && (
          <>
            <Text style={dynamic.error}>การยืนยันล้มเหลว</Text>
            {!!message && <Text style={dynamic.hint}>{message}</Text>}
            <TouchableOpacity style={dynamic.btn} onPress={startAuth}>
              <Text style={dynamic.btnText}>ลองยืนยันอีกครั้ง</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[dynamic.btn, { marginTop: 10, backgroundColor: theme.primary }]} onPress={() => { setShowPin(true); setStatus('pin'); }}>
              <Text style={dynamic.btnText}>ยืนยันด้วย PIN</Text>
            </TouchableOpacity>
          </>
        )}
        {status === 'unsupported' && (
          <>
            <Text style={dynamic.desc}>อุปกรณ์นี้ไม่รองรับหรือยังไม่ได้ลงทะเบียนข้อมูลไบโอเมตริกส์</Text>
            <Text style={dynamic.hint}>จะไปยังหน้าล็อกอินปกติ</Text>
            <TouchableOpacity style={dynamic.btn} onPress={() => router.replace('/signin')}>
              <Text style={dynamic.btnText}>ไปหน้าล็อกอิน</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[dynamic.btn, { marginTop: 10, backgroundColor: theme.primary }]} onPress={() => { setShowPin(true); setStatus('pin'); }}>
              <Text style={dynamic.btnText}>ยืนยันด้วย PIN</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
      <PinModal
        visible={showPin}
        onCancel={() => { setShowPin(false); setStatus('failed'); }}
        onSuccess={() => { setShowPin(false); router.replace('/signin'); }}
      />
    </SafeAreaView>
  );
};

export default LocalAuthScreen;
