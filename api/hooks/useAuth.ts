import { useEffect } from 'react';
import { Alert } from 'react-native';
import { useRouter, useSegments, useRootNavigationState } from 'expo-router';
import { useUser } from '../../contexts/UserContext';
import { AuthEventEmitter } from '../client';

// Biến global để tránh hiện Alert và chuyển hướng liên tục khi có nhiều component cùng dùng hook useAuth
let isSessionHandling = false;

/**
 * Custom hook để bảo vệ các route. 
 * Tự động điều hướng về màn hình (auth) nếu chưa đăng nhập,
 * và đưa vào màn hình (tabs) nếu đã đăng nhập mà vẫn cố vào (auth).
 */
export function useAuth() {
  // Ép kiểu (as any) để lấy thêm hàm logout hoặc setUser (tùy vào cách bạn định nghĩa trong UserContext)
  const { user, isLoading, logout, setUser } = useUser() as any;
  const router = useRouter();
  const segments = useSegments();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    // Lắng nghe sự kiện "Hết hạn Refresh Token" từ file client.ts
    const unsubscribe = AuthEventEmitter.subscribe(() => {
      if (isSessionHandling) return;
      isSessionHandling = true;

      // Bắt buộc phải xóa state user để useAuth không tự động đẩy lại vào (tabs) gây lặp vô hạn
      if (logout) {
        logout();
      } else if (setUser) {
        setUser(null);
      }

      // Hiển thị thông báo (Alert) ngay khi bị đẩy ra
      Alert.alert(
        'Phiên đăng nhập hết hạn',
        'Vui lòng đăng nhập lại để tiếp tục sử dụng ứng dụng.',
        [{ text: 'OK', onPress: () => { isSessionHandling = false; } }]
      );
      
      router.replace('/(auth)/sign-in');
      
      // Đề phòng trường hợp Alert bị lỗi hoặc dismiss ngầm, ta reset lại cờ sau 3 giây
      setTimeout(() => {
        isSessionHandling = false;
      }, 3000);
    });

    return () => unsubscribe(); // Dọn dẹp listener khi unmount
  }, [logout, setUser, router]);

  useEffect(() => {
    // Đợi kiểm tra token xong VÀ đợi Root Layout của Expo Router mount xong mới được phép điều hướng
    if (isLoading || !navigationState?.key) return; 

    // Kiểm tra xem người dùng có đang ở trong group (auth) hay không
    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      // Nếu chưa đăng nhập và không ở trang auth -> Đẩy về trang đăng nhập
      router.replace('/(auth)/sign-in');
    } else if (user && inAuthGroup) {
      // Nếu đã đăng nhập mà lại đang ở trang auth -> Đẩy vào app chính
      router.replace('/(tabs)');
    }
  }, [user, isLoading, segments, router]);

  return { user, isLoading };
}