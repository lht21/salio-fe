import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';



// Ngăn Splash Screen tự động ẩn trước khi font chữ tải xong
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  
  
  // Tải các font chữ cần thiết cho dự án
  const [loaded, error] = useFonts({
    'LexendDeca-Regular': require('../assets/fonts/LexendDeca-Regular.ttf'),
    'LexendDeca-Medium': require('../assets/fonts/LexendDeca-Medium.ttf'),
    'LexendDeca-SemiBold': require('../assets/fonts/LexendDeca-SemiBold.ttf'),
  });

  // Xử lý lỗi tải font
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  // Ẩn Splash Screen khi font đã sẵn sàng
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }} initialRouteName='(auth)'>
        {/* Màn hình chính là nhóm Tabs */}
        
        {/* Nhóm Auth (Sign-in, Register, etc.) */}
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
        </Stack>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
