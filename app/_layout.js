import { Stack } from "expo-router";
import { ThemeProvider, useTheme } from "../contexts/ThemeContext";

function AppStack() {
  const { theme } = useTheme();
  
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
    </Stack>
  );
}

export default function Layout() {
  return (
    <ThemeProvider>
      <AppStack />
    </ThemeProvider>
  );
}