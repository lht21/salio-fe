import React from 'react';
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Màn hình đăng nhập */}
      <Stack.Screen name="sign-in" />
      
      {/* Bạn có thể khai báo rõ các màn hình khác ở đây nếu muốn ghi đè options, 
        nếu không Expo Router sẽ tự động nhận diện các file trong thư mục (auth) 
        và áp dụng headerShown: false từ thẻ Stack cha.
      */}
        <Stack.Screen name="register/email" />
        <Stack.Screen name="register/verify-otp" />
        <Stack.Screen name="register/set-credentials" />
      <Stack.Screen name="forgot-password/email" />
        <Stack.Screen name="forgot-password/verify-otp" />
        <Stack.Screen name="forgot-password/reset-password" />
    </Stack>
  );
}