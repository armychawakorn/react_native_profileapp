import React from 'react';
import { Text, View, StyleSheet, ScrollView, SafeAreaView, Switch, TouchableOpacity } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'expo-router';
import { useLocalAuth } from '../contexts/LocalAuthContext';
import { showAuthAlerts } from '../utils/alertUtils';

const Settings = () => {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { enabled: localAuthEnabled, setEnabled: setLocalAuthEnabled, supported, enrolled, refreshDeviceStatus, loading: localAuthLoading } = useLocalAuth();
  const router = useRouter();

  const handleLogout = () => {
    showAuthAlerts.logoutConfirm(() => {
      logout();
      router.replace('/signin');
    });
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    card: {
      backgroundColor: theme.cardBackground,
      marginHorizontal: 20,
      marginTop: 20,
      borderRadius: 15,
      padding: 20,
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
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.text,
      textAlign: 'center',
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.primary,
      marginBottom: 15,
      marginTop: 10,
    },
    settingItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    settingLabel: {
      fontSize: 16,
      color: theme.text,
      flex: 1,
    },
    settingDescription: {
      fontSize: 12,
      color: theme.textSecondary,
      marginTop: 2,
    },
    themePreview: {
      flexDirection: 'row',
      gap: 10,
      marginTop: 15,
      justifyContent: 'center',
    },
    colorBox: {
      width: 30,
      height: 30,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.border,
    },
    colorLabel: {
      fontSize: 10,
      color: theme.textSecondary,
      textAlign: 'center',
      marginTop: 5,
    },
    previewContainer: {
      alignItems: 'center',
      marginVertical: 10,
    },
    supportText: {
      fontSize: 12,
      color: theme.textSecondary,
      marginTop: 6,
    },
  });

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={dynamicStyles.card}>
          <Text style={dynamicStyles.title}>⚙️ Settings</Text>
          
          <Text style={dynamicStyles.sectionTitle}>🎨 Theme</Text>
          
          <View style={dynamicStyles.settingItem}>
            <View style={{ flex: 1 }}>
              <Text style={dynamicStyles.settingLabel}>
                {isDarkMode ? '🌙' : '☀️'} {isDarkMode ? 'Dark Mode' : 'Light Mode'}
              </Text>
              <Text style={dynamicStyles.settingDescription}>
                {isDarkMode ? 'ใช้ธีมมืดเพื่อลดแสงสีฟ้าและประหยัดแบตเตอรี่' : 'ใช้ธีมสว่างแบบมาตรฐาน เหมาะสำหรับการใช้งานในที่สว่าง'}
              </Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: '#767577', true: theme.secondary }}
              thumbColor={isDarkMode ? '#fff' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
            />
          </View>

          <View style={dynamicStyles.previewContainer}>
            <Text style={[dynamicStyles.settingDescription, { textAlign: 'center', marginBottom: 10 }]}>
              ตัวอย่างสีธีมปัจจุบัน
            </Text>
            <View style={dynamicStyles.themePreview}>
              <View style={{ alignItems: 'center' }}>
                <View style={[dynamicStyles.colorBox, { backgroundColor: theme.primary }]} />
                <Text style={dynamicStyles.colorLabel}>Primary</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <View style={[dynamicStyles.colorBox, { backgroundColor: theme.secondary }]} />
                <Text style={dynamicStyles.colorLabel}>Secondary</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <View style={[dynamicStyles.colorBox, { backgroundColor: theme.accent }]} />
                <Text style={dynamicStyles.colorLabel}>Accent</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <View style={[dynamicStyles.colorBox, { backgroundColor: theme.background }]} />
                <Text style={dynamicStyles.colorLabel}>Background</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <View style={[dynamicStyles.colorBox, { backgroundColor: theme.surface }]} />
                <Text style={dynamicStyles.colorLabel}>Surface</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Local Authentication Section */}
        <View style={dynamicStyles.card}>
          <Text style={dynamicStyles.sectionTitle}>🔐 Local Authentication</Text>
          <View style={dynamicStyles.settingItem}>
            <View style={{ flex: 1 }}>
              <Text style={dynamicStyles.settingLabel}>
                ใช้ Touch ID / Face ID / รหัสอุปกรณ์
              </Text>
              <Text style={dynamicStyles.settingDescription}>
                ล็อคหน้าจอแอปเมื่อกลับมาใช้งานอีกครั้ง (Foreground)
              </Text>
              {!localAuthLoading && (
                <Text style={dynamicStyles.supportText}>
                  สถานะอุปกรณ์: {supported ? (enrolled ? 'พร้อมใช้งาน' : 'ยังไม่ได้ลงทะเบียนไบโอเมตริกส์/รหัส') : 'ไม่รองรับ'}
                </Text>
              )}
            </View>
            <Switch
              value={localAuthEnabled}
              onValueChange={async (v) => {
                await refreshDeviceStatus();
                if (!supported) return; // ignore if unsupported
                if (v && !enrolled) return; // cannot enable without enrollment
                await setLocalAuthEnabled(v);
              }}
              disabled={!supported || (!enrolled && !localAuthEnabled)}
              trackColor={{ false: '#767577', true: theme.secondary }}
              thumbColor={localAuthEnabled ? '#fff' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
            />
          </View>
        </View>

        {/* Books Management Section */}
        <View style={dynamicStyles.card}>
          <Text style={dynamicStyles.sectionTitle}>📚 จัดการหนังสือ</Text>
          
          <TouchableOpacity 
            style={dynamicStyles.settingItem}
            onPress={() => router.push('/book')}
          >
            <Text style={dynamicStyles.settingLabel}>📖 ดูหนังสือทั้งหมด</Text>
            <Text style={[dynamicStyles.settingLabel, { color: theme.secondary, textAlign: 'right', flex: 0 }]}>
              →
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={dynamicStyles.settingItem}
            onPress={() => router.push('/my-books')}
          >
            <Text style={dynamicStyles.settingLabel}>📝 หนังสือของฉัน</Text>
            <Text style={[dynamicStyles.settingLabel, { color: theme.secondary, textAlign: 'right', flex: 0 }]}>
              →
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[dynamicStyles.settingItem, { borderBottomWidth: 0 }]}
            onPress={() => router.push({
              pathname: '/book-form',
              params: { mode: 'create' }
            })}
          >
            <Text style={dynamicStyles.settingLabel}>➕ เพิ่มหนังสือใหม่</Text>
            <Text style={[dynamicStyles.settingLabel, { color: theme.secondary, textAlign: 'right', flex: 0 }]}>
              →
            </Text>
          </TouchableOpacity>
        </View>

        <View style={dynamicStyles.card}>
          <Text style={dynamicStyles.sectionTitle}>ℹ️ About</Text>
          <View style={dynamicStyles.settingItem}>
            <Text style={dynamicStyles.settingLabel}>App Version</Text>
            <Text style={[dynamicStyles.settingLabel, { textAlign: 'right', flex: 1 }]}>
              1.0.0
            </Text>
          </View>
          <View style={dynamicStyles.settingItem}>
            <Text style={dynamicStyles.settingLabel}>Developer</Text>
            <Text style={[dynamicStyles.settingLabel, { textAlign: 'right', flex: 1 }]}>
              ชวกร เนืองภา
            </Text>
          </View>
          <View style={dynamicStyles.settingItem}>
            <Text style={dynamicStyles.settingLabel}>Framework</Text>
            <Text style={[dynamicStyles.settingLabel, { textAlign: 'right', flex: 1 }]}>
              React Native + Expo
            </Text>
          </View>
          {user && (
            <View style={dynamicStyles.settingItem}>
              <Text style={dynamicStyles.settingLabel}>ผู้ใช้งาน</Text>
              <Text style={[dynamicStyles.settingLabel, { textAlign: 'right', flex: 1 }]}>
                {user.username}
              </Text>
            </View>
          )}
        </View>

        {/* Logout Section */}
        <View style={dynamicStyles.card}>
          <Text style={dynamicStyles.sectionTitle}>🔐 บัญชีผู้ใช้</Text>
          <TouchableOpacity 
            style={[dynamicStyles.settingItem, { borderBottomWidth: 0, paddingVertical: 20 }]}
            onPress={handleLogout}
          >
            <Text style={[dynamicStyles.settingLabel, { color: theme.accent, fontWeight: 'bold' }]}>
              🚪 ออกจากระบบ
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 20,
  },
});

export default Settings;
