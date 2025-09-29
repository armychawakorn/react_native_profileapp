import { Stack, usePathname } from "expo-router";
import { ThemeProvider, useTheme } from "../contexts/ThemeContext";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { LocalAuthProvider } from "../contexts/LocalAuthContext";
import { PinAuthProvider } from "../contexts/PinAuthContext";
import LocalAuthGate from "../components/LocalAuthGate";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import LoadingScreen from "../components/LoadingScreen";

function AppStack() {
  const { theme } = useTheme();
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      // If unauthenticated, start at local-auth screen unless already on auth routes
      if (pathname !== '/local-auth' && pathname !== '/signin' && pathname !== '/signup') {
        router.replace('/local-auth');
      }
    }
  }, [isAuthenticated, isLoading, pathname]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <LocalAuthGate />
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
        name="local-auth" 
        options={{ 
          title: "ยืนยันตัวตน",
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
    </>
  );
}

export default function Layout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PinAuthProvider>
          <LocalAuthProvider>
            <AppStack />
          </LocalAuthProvider>
        </PinAuthProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
