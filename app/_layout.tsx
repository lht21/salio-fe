import { DefaultTheme, ThemeProvider as NavThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import "react-native-reanimated";
import { ToastProvider } from 'react-native-toast-notifications';

import { UserProvider } from "../contexts/UserContext";
import { useAuth } from "../api/hooks/useAuth";
import { ModalProvider } from "../contexts/ModalContext"; // Giả định ModalProvider nằm ở đây
import { ThemeProvider } from "../contexts/ThemeContext";
import "../locales/config"; // Khởi tạo i18n

// Ngăn Splash Screen tự động ẩn trước khi font chữ tải xong
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Tải các font chữ cần thiết cho dự án
  const [loaded, error] = useFonts({
    "LexendDeca-Regular": require("../assets/fonts/LexendDeca-Regular.ttf"),
    "LexendDeca-Medium": require("../assets/fonts/LexendDeca-Medium.ttf"),
    "LexendDeca-SemiBold": require("../assets/fonts/LexendDeca-SemiBold.ttf"),
    "LexendDeca-Bold": require("../assets/fonts/LexendDeca-Bold.ttf"),
    "NotoSerif-Bold": require("../assets/fonts/NotoSerifKR-Bold.ttf"),
    "NotoSerif-Regular": require("../assets/fonts/NotoSerifKR-Regular.ttf"),
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
      <UserProvider>
        <ThemeProvider>
          <ModalProvider>
            <BottomSheetModalProvider>
              <ToastProvider
                placement="top"
                duration={3000}
                animationType="slide-in"
                offset={50}
                swipeEnabled={true}
              >
                <RootLayoutNav />
              </ToastProvider>
            </BottomSheetModalProvider>
          </ModalProvider>
        </ThemeProvider>
      </UserProvider>
    </GestureHandlerRootView>
  );
}

function RootLayoutNav() {
  useAuth();

  return (
    <NavThemeProvider value={DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }} initialRouteName="(auth)">
        {/* Màn hình chính là nhóm Tabs */}

        {/* Nhóm Auth (Sign-in, Register, etc.) */}
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="certificate/certificate" options={{ headerShown: false }} />
        <Stack.Screen name="streak/streak" options={{ headerShown: false }} />
        <Stack.Screen 
          name="lesson-modal" 
          options={{ presentation: 'transparentModal', animation: 'fade', headerShown: false }} 
        />
        <Stack.Screen name="+not-found" options={{ title: "Oops!" }} />
      </Stack>
    </NavThemeProvider>
  );
}
