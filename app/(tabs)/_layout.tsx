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

import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import LessonBottomSheetHost from '@/components/Modals/LessonBottomSheetHost';
import { FontFamily } from '@/constants/GlobalStyles';

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
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.main2,
          tabBarInactiveTintColor: colors.gray,
          headerShown: false,
          tabBarHideOnKeyboard: true,
          tabBarLabelStyle: {
            fontFamily: FontFamily.lexendDecaMedium,
          fontSize: 11,
          marginTop: 4,
          },
          tabBarStyle: {
          height: Platform.OS === 'ios' ? 90 : 70, // Tăng chiều cao thêm một chút
          paddingTop: 15, // Tăng khoảng cách phía trên icon cho thoáng
          paddingBottom: Platform.OS === 'ios' ? 25 : 10, // Tối ưu vùng vuốt cho Home Indicator của iOS
            backgroundColor: colors.bg,
          borderTopWidth: 1,
          borderTopColor: colors.stroke,
          shadowColor: colors.shadow,
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
            title: t('tabs.learn', 'Học'),
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
            title: t('tabs.practice', 'Thi'),
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
            title: t('tabs.vocabulary', 'Từ vựng'),
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
            title: t('tabs.community', 'Cộng đồng'),
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
            title: t('tabs.profile', 'Tôi'),
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
