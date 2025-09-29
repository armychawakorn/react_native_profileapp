import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { useLocalAuth } from '../contexts/LocalAuthContext';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import PinModal from './PinModal';

// A thin gate that prompts for local auth when enabled and app becomes active.
// Renders a simple overlay while awaiting authentication.
const LocalAuthGate = () => {
  const { enabled, supported, enrolled, refreshDeviceStatus } = useLocalAuth();
  const { isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const [authenticating, setAuthenticating] = useState(false);
  const appState = useRef(AppState.currentState);
  const blockedRef = useRef(false);
  const [showPin, setShowPin] = useState(false);

  const doAuth = useCallback(async () => {
    // Only if enabled and device supports with enrollment
    if (!enabled || !isAuthenticated) return;
    await refreshDeviceStatus();
    if (!supported || !enrolled) return;

    // Prevent re-entrance
    if (authenticating) return;
    setAuthenticating(true);
    blockedRef.current = true; // Block UI via overlay
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'ยืนยันตัวตน',
        fallbackLabel: 'ใช้รหัสผ่านของอุปกรณ์',
        disableDeviceFallback: false,
        cancelLabel: 'ยกเลิก',
      });
      if (!result.success) {
        // Keep overlay; allow PIN fallback via button
        return;
      }
      // Success: unblock
      blockedRef.current = false;
    } finally {
      setAuthenticating(false);
    }
  }, [enabled, supported, enrolled, authenticating, refreshDeviceStatus]);

  useEffect(() => {
    // Trigger on mount if applicable
    doAuth();
  }, [doAuth]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (nextState) => {
      const prev = appState.current;
      appState.current = nextState;
      if (prev.match(/inactive|background/) && nextState === 'active') {
        doAuth();
      }
    });
    return () => sub.remove();
  }, [doAuth]);

  if (!isAuthenticated || !enabled || !supported || !enrolled) return null;

  if (blockedRef.current) {
    return (
      <View style={[styles.overlay, { backgroundColor: theme.background + 'F2' }]}>
        <Text style={[styles.text, { color: theme.textSecondary }]}>🔐 รอการยืนยันตัวตน…</Text>
        <TouchableOpacity style={[styles.btn, { backgroundColor: theme.primary }]} onPress={() => setShowPin(true)}>
          <Text style={styles.btnText}>ยืนยันด้วย PIN</Text>
        </TouchableOpacity>
        <PinModal
          visible={showPin}
          onCancel={() => setShowPin(false)}
          onSuccess={() => { setShowPin(false); blockedRef.current = false; }}
        />
      </View>
    );
  }
  return null;
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  text: {
    fontSize: 16,
  },
  btn: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default LocalAuthGate;
