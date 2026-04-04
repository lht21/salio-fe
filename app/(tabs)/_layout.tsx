import React from 'react';
import { Tabs } from 'expo-router';

import { Color, FontFamily } from '@/constants/GlobalStyles';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

// Import bộ icon từ phosphor-react-native tương ứng với thiết kế
import { HouseIcon, PenNibStraightIcon, CardsIcon, UsersThreeIcon, IdentificationBadgeIcon } from 'phosphor-react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        // Màu xanh ngọc (teal) cho tab đang chọn
        tabBarActiveTintColor: Color.main2 || '#02B0A0',
        // Màu xám cho tab không chọn
        tabBarInactiveTintColor: Color.gray || '#64748B',
        headerShown: useClientOnlyValue(false, false),
        
        // Chỉnh lại style chữ của Tab Bar cho giống thiết kế
        tabBarLabelStyle: {
          fontFamily: FontFamily.lexendDecaMedium,
          fontSize: 10,
          marginTop: -5,
          marginBottom: 5,
        },
        tabBarStyle: {
          height: 60,
          paddingTop: 8,
          backgroundColor: Color.bg || '#FFFFFF',
        }
      }}>
      
      {/* 1. Học */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Học',
          tabBarIcon: ({ color, focused }) => (
            <HouseIcon size={24} color={color} weight={focused ? "fill" : "regular"} />
          ),
        }}
      />

      {/* 2. Thi */}
      <Tabs.Screen
        name="practice" // Tạm dùng practice.tsx, bạn có thể đổi tên thành exam.tsx sau
        options={{
          title: 'Thi',
          tabBarIcon: ({ color, focused }) => (
            <PenNibStraightIcon size={24} color={color} weight={focused ? "fill" : "regular"} />
          ),
        }}
      />

      {/* 3. Từ vựng */}
      <Tabs.Screen
        name="vocabulary"
        options={{
          title: 'Từ vựng',
          tabBarIcon: ({ color, focused }) => (
            <CardsIcon size={24} color={color} weight={focused ? "fill" : "regular"} />
          ),
        }}
      />

      {/* 4. Cộng đồng */}
      <Tabs.Screen
        name="community"
        options={{
          title: 'Cộng đồng',
          tabBarIcon: ({ color, focused }) => (
            <UsersThreeIcon size={24} color={color} weight={focused ? "fill" : "regular"} />
          ),
        }}
      />

      {/* 5. Tôi */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Tôi',
          tabBarIcon: ({ color, focused }) => (
            <IdentificationBadgeIcon size={24} color={color} weight={focused ? "fill" : "regular"} />
          ),
        }}
      />
    </Tabs>
  );
}