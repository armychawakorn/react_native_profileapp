import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';

const STORAGE_KEY = 'localAuthEnabled';

const LocalAuthContext = createContext(null);

export const useLocalAuth = () => {
  const ctx = useContext(LocalAuthContext);
  if (!ctx) throw new Error('useLocalAuth must be used within LocalAuthProvider');
  return ctx;
};

export const LocalAuthProvider = ({ children }) => {
  const [enabled, setEnabled] = useState(false);
  const [supported, setSupported] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const [hasHardware, isEnrolled, stored] = await Promise.all([
          LocalAuthentication.hasHardwareAsync(),
          LocalAuthentication.isEnrolledAsync(),
          AsyncStorage.getItem(STORAGE_KEY),
        ]);
        setSupported(hasHardware);
        setEnrolled(isEnrolled);
        setEnabled(stored === 'true');
      } catch (e) {
        setSupported(false);
        setEnrolled(false);
        setEnabled(false);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const refreshDeviceStatus = async () => {
    try {
      const [hasHardware, isEnrolled] = await Promise.all([
        LocalAuthentication.hasHardwareAsync(),
        LocalAuthentication.isEnrolledAsync(),
      ]);
      setSupported(hasHardware);
      setEnrolled(isEnrolled);
      if (!hasHardware || !isEnrolled) {
        // Auto-disable if device becomes unsupported or enrollment removed
        await AsyncStorage.setItem(STORAGE_KEY, 'false');
        setEnabled(false);
      }
    } catch (e) {}
  };

  const setEnabledPersist = async (value) => {
    setEnabled(value);
    await AsyncStorage.setItem(STORAGE_KEY, value ? 'true' : 'false');
  };

  const value = useMemo(() => ({
    enabled,
    setEnabled: setEnabledPersist,
    supported,
    enrolled,
    refreshDeviceStatus,
    loading,
  }), [enabled, supported, enrolled, loading]);

  return (
    <LocalAuthContext.Provider value={value}>
      {children}
    </LocalAuthContext.Provider>
  );
};

