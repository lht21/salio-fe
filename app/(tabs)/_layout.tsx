import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import {
  HouseIcon,
  PenNibStraightIcon,
  CardsIcon,
  UsersThreeIcon,
  IdentificationBadgeIcon,
} from 'phosphor-react-native';

import { Color, FontFamily } from '@/constants/GlobalStyles';
import LessonBottomSheetHost from '@/components/Modals/LessonBottomSheetHost';

export default function TabLayout() {
  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Color.main2 || '#02B0A0',
          tabBarInactiveTintColor: Color.gray || '#64748B',
          headerShown: false,
          tabBarLabelStyle: {
            fontFamily: FontFamily.lexendDecaMedium,
            fontSize: 10,
            marginTop: -5,
            marginBottom: 5,
          },
          tabBarStyle: {
            height: 100,
            paddingTop: 10,
            backgroundColor: Color.bg || '#FFFFFF',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Học',
            tabBarIcon: ({ color, focused }) => (
              <HouseIcon size={24} color={color} weight={focused ? 'fill' : 'fill'} />
            ),
          }}
        />
        <Tabs.Screen
          name="practice"
          options={{
            title: 'Thi',
            tabBarIcon: ({ color, focused }) => (
              <PenNibStraightIcon size={24} color={color} weight={focused ? 'fill' : 'fill'} />
            ),
          }}
        />
        <Tabs.Screen
          name="vocabulary"
          options={{
            title: 'Từ vựng',
            tabBarIcon: ({ color, focused }) => (
              <CardsIcon size={24} color={color} weight={focused ? 'fill' : 'fill'} />
            ),
          }}
        />
        <Tabs.Screen
          name="community"
          options={{
            title: 'Cộng đồng',
            tabBarIcon: ({ color, focused }) => (
              <UsersThreeIcon size={24} color={color} weight={focused ? 'fill' : 'fill'} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Tôi',
            tabBarIcon: ({ color, focused }) => (
              <IdentificationBadgeIcon size={24} color={color} weight={focused ? 'fill' : 'fill'} />
            ),
          }}
        />
        <Tabs.Screen
          name="streak"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="certificate"
          options={{
            href: null,
          }}
        />
      </Tabs>
      <LessonBottomSheetHost />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
