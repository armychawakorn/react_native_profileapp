import { Stack } from "expo-router";
import { ThemeProvider, useTheme } from "../contexts/ThemeContext";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import LoadingScreen from "../components/LoadingScreen";

function AppStack() {
  const { theme } = useTheme();
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace('/signin');
      }
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.headerBackground,
        },
        headerTintColor: theme.headerText,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ 
          title: "Profile",
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="about" 
        options={{ 
          title: "รายวิชา",
          presentation: 'modal'
        }} 
      />
      <Stack.Screen 
        name="settings" 
        options={{ 
          title: "Settings"
        }} 
      />
      <Stack.Screen 
        name="signin" 
        options={{ 
          title: "เข้าสู่ระบบ",
          headerShown: false
        }} 
      />
      <Stack.Screen 
        name="signup" 
        options={{ 
          title: "สมัครสมาชิก",
          headerShown: false
        }} 
      />
      <Stack.Screen 
        name="book" 
        options={{ 
          title: "หนังสือ"
        }} 
      />
    </Stack>
  );
}

export default function Layout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppStack />
      </AuthProvider>
    </ThemeProvider>
  );
}