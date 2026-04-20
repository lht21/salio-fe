import { Tabs } from 'expo-router';
import {
  CardsIcon,
  HouseIcon,
  IdentificationBadgeIcon,
  PenNibStraightIcon,
  UsersThreeIcon,
} from 'phosphor-react-native';
import { StyleSheet, View } from 'react-native';

import LessonBottomSheetHost from '@/components/Modals/LessonBottomSheetHost';
import { Color, FontFamily } from '@/constants/GlobalStyles';

export default function TabLayout() {
  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Color.color,
          tabBarInactiveTintColor: '#64748B',
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
