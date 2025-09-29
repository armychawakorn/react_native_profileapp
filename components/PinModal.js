import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Modal, View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { usePinAuth } from '../contexts/PinAuthContext';

// Simple PIN modal: verify existing PIN or create new if none.
// Props:
// - visible
// - onSuccess()
// - onCancel()
const PinModal = ({ visible, onSuccess, onCancel }) => {
  const { theme } = useTheme();
  const { hasPin, setPin, verifyPin } = usePinAuth();
  const [mode, setMode] = useState('verify'); // verify | create | confirm
  const [pin, setPinValue] = useState('');
  const [firstPin, setFirstPin] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (visible) {
      setMode(hasPin ? 'verify' : 'create');
      setPinValue('');
      setFirstPin('');
      setError('');
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [visible, hasPin]);

  const styles = useMemo(() => StyleSheet.create({
    overlay: { flex: 1, backgroundColor: theme.background, justifyContent: 'center', padding: 24 },
    card: { backgroundColor: theme.cardBackground, borderRadius: 14, padding: 20 },
    title: { fontSize: 20, fontWeight: '700', color: theme.text, textAlign: 'center', marginBottom: 6 },
    desc: { fontSize: 13, color: theme.textSecondary, textAlign: 'center', marginBottom: 16 },
    dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 12 },
    dot: { width: 14, height: 14, borderRadius: 8, borderWidth: 1, borderColor: theme.border, backgroundColor: 'transparent' },
    dotFilled: { backgroundColor: theme.text },
    input: { position: 'absolute', opacity: 0, height: 0 },
    row: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginTop: 8 },
    btn: { backgroundColor: theme.secondary, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 10 },
    btnOutline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: theme.border },
    btnText: { color: '#fff', fontWeight: '600' },
    btnTextOutline: { color: theme.text },
    error: { color: theme.accent, textAlign: 'center', marginTop: 8 },
  }), [theme]);

  const handleChange = async (v) => {
    const onlyDigits = v.replace(/\D/g, '').slice(0, 6);
    setPinValue(onlyDigits);
    setError('');
    if (onlyDigits.length === 6) {
      if (mode === 'verify') {
        const ok = await verifyPin(onlyDigits);
        if (ok) {
          onSuccess?.();
        } else {
          setError('PIN ไม่ถูกต้อง');
          setPinValue('');
        }
      } else if (mode === 'create') {
        setFirstPin(onlyDigits);
        setPinValue('');
        setMode('confirm');
      } else if (mode === 'confirm') {
        if (onlyDigits === firstPin) {
          await setPin(onlyDigits);
          onSuccess?.();
        } else {
          setError('PIN ไม่ตรงกัน');
          setPinValue('');
          setMode('create');
        }
      }
    }
  };

  const renderDots = () => {
    const filled = pin.length;
    return (
      <View style={styles.dots}>
        {Array.from({ length: 6 }).map((_, i) => (
          <View key={i} style={[styles.dot, i < filled && styles.dotFilled]} />
        ))}
      </View>
    );
  };

  const title = mode === 'verify' ? 'กรอก PIN' : mode === 'create' ? 'สร้าง PIN ใหม่' : 'ยืนยัน PIN';
  const desc = mode === 'verify' ? 'กรอก PIN 6 หลักเพื่อยืนยันตัวตน' : 'กรอก PIN 6 หลัก';

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>🔢 {title}</Text>
          <Text style={styles.desc}>{desc}</Text>
          {renderDots()}
          <TextInput
            ref={inputRef}
            value={pin}
            onChangeText={handleChange}
            keyboardType="number-pad"
            secureTextEntry
            maxLength={6}
            style={styles.input}
            autoFocus
          />
          {!!error && <Text style={styles.error}>{error}</Text>}
          <View style={styles.row}>
            <TouchableOpacity style={[styles.btn, styles.btnOutline]} onPress={onCancel}>
              <Text style={[styles.btnText, styles.btnTextOutline]}>ยกเลิก</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={() => inputRef.current?.focus()}>
              <Text style={styles.btnText}>กรอก PIN</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default PinModal;

