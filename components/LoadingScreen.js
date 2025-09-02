import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

const LoadingScreen = () => {
  const { theme } = useTheme();

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      marginTop: 20,
      fontSize: 16,
      color: theme.textSecondary,
    },
  });

  return (
    <View style={dynamicStyles.container}>
      <ActivityIndicator size="large" color={theme.secondary} />
      <Text style={dynamicStyles.text}>กำลังโหลด...</Text>
    </View>
  );
};

export default LoadingScreen;
