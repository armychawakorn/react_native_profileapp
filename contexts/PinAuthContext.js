import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';

const PIN_KEY = 'appPinHash';

const PinAuthContext = createContext(null);

export const usePinAuth = () => {
  const ctx = useContext(PinAuthContext);
  if (!ctx) throw new Error('usePinAuth must be used within PinAuthProvider');
  return ctx;
};

async function hashPin(pin) {
  // 6-digit PIN expected, but hash regardless
  return await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, String(pin));
}

export const PinAuthProvider = ({ children }) => {
  const [hasPin, setHasPin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const stored = await SecureStore.getItemAsync(PIN_KEY);
        setHasPin(!!stored);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const setPin = async (pin) => {
    const hashed = await hashPin(pin);
    await SecureStore.setItemAsync(PIN_KEY, hashed, { keychainAccessible: SecureStore.WHEN_UNLOCKED });
    setHasPin(true);
  };

  const clearPin = async () => {
    await SecureStore.deleteItemAsync(PIN_KEY);
    setHasPin(false);
  };

  const verifyPin = async (pin) => {
    const stored = await SecureStore.getItemAsync(PIN_KEY);
    if (!stored) return false;
    const hashed = await hashPin(pin);
    return stored === hashed;
  };

  const value = useMemo(() => ({ hasPin, loading, setPin, clearPin, verifyPin }), [hasPin, loading]);

  return (
    <PinAuthContext.Provider value={value}>
      {children}
    </PinAuthContext.Provider>
  );
};

