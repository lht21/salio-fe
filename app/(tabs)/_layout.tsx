import { Tabs } from 'expo-router';
import {
  CardsIcon,
  HouseIcon,
  IdentificationBadgeIcon,
  PenNibStraightIcon,
  UsersThreeIcon,
} from 'phosphor-react-native';
import { StyleSheet, View, Platform } from 'react-native';
import { MotiView } from 'moti';

import LessonBottomSheetHost from '@/components/Modals/LessonBottomSheetHost';
import { Color, FontFamily } from '@/constants/GlobalStyles';

// Component bọc Icon để tạo hiệu ứng Bounce khi được Focus
const AnimatedTabIcon = ({ focused, children }: { focused: boolean; children: React.ReactNode }) => {
  return (
    <MotiView
      animate={{
        scale: focused ? 1.15 : 1, // Phóng to nhẹ 15% khi được chọn
        translateY: focused ? -3 : 0, // Nảy lên trên 3px
      }}
      transition={{
        type: 'spring',
        stiffness: 300, // Độ căng của lò xo
        damping: 15,    // Lực hãm để tạo độ nảy mượt mà
      }}
    >
      {children}
    </MotiView>
  );
};

export default function TabLayout() {
  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Color.main2,
          tabBarInactiveTintColor: '#64748B',
          headerShown: false,
          tabBarHideOnKeyboard: true,
          tabBarLabelStyle: {
            fontFamily: FontFamily.lexendDecaMedium,
          fontSize: 11,
          marginTop: 4,
          },
          tabBarStyle: {
          height: Platform.OS === 'ios' ? 85 : 65, // Chiều cao chuẩn native
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 25 : 10, // Tối ưu vùng vuốt cho Home Indicator của iOS
            backgroundColor: Color.bg || '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E2E8F0',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.05,
          shadowRadius: 10,
          elevation: 10, // Đổ bóng nhẹ phân tách với nội dung
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Học',
            tabBarIcon: ({ color, focused }) => (
              <AnimatedTabIcon focused={focused}>
                <HouseIcon size={24} color={color} weight={focused ? 'fill' : 'fill'} />
              </AnimatedTabIcon>
            ),
          }}
        />
        <Tabs.Screen
          name="practice"
          options={{
            title: 'Thi',
            tabBarIcon: ({ color, focused }) => (
              <AnimatedTabIcon focused={focused}>
                <PenNibStraightIcon size={24} color={color} weight={focused ? 'fill' : 'fill'} />
              </AnimatedTabIcon>
            ),
          }}
        />
        <Tabs.Screen
          name="vocabulary"
          options={{
            title: 'Từ vựng',
            tabBarIcon: ({ color, focused }) => (
              <AnimatedTabIcon focused={focused}>
                <CardsIcon size={24} color={color} weight={focused ? 'fill' : 'fill'} />
              </AnimatedTabIcon>
            ),
          }}
        />
        <Tabs.Screen
          name="community"
          options={{
            title: 'Cộng đồng',
            tabBarIcon: ({ color, focused }) => (
              <AnimatedTabIcon focused={focused}>
                <UsersThreeIcon size={24} color={color} weight={focused ? 'fill' : 'fill'} />
              </AnimatedTabIcon>
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Tôi',
            tabBarIcon: ({ color, focused }) => (
              <AnimatedTabIcon focused={focused}>
                <IdentificationBadgeIcon size={24} color={color} weight={focused ? 'fill' : 'fill'} />
              </AnimatedTabIcon>
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
