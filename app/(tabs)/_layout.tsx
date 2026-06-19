import { Tabs } from 'expo-router';
import {
  CardsIcon,
  HouseIcon,
  IdentificationBadgeIcon,
  PenNibStraightIcon,
  CompassIcon,
} from 'phosphor-react-native';
import { StyleSheet, View, Platform, Text } from 'react-native';
import { MotiView } from 'moti';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
// Import thêm Color từ GlobalStyles
import { FontFamily, Color } from '@/constants/GlobalStyles';

// Component bọc Icon và Text để tạo hiệu ứng hình viên thuốc (Capsule)
const AnimatedTabItem = ({ 
  focused, 
  label, 
  children 
}: { 
  focused: boolean; 
  label: string; 
  children: React.ReactNode 
}) => {
  return (
    <MotiView
      animate={{
        backgroundColor: focused ? Color.main : 'transparent', // Dùng Color.main khi active
        paddingHorizontal: focused ? 24 : 10, // Tăng padding ngang để rộng rãi, không bị cắt chữ
      }}
      transition={{
        type: 'timing',
        duration: 250,
      } as any} 
      style={{
        height: 64, // Chiều cao cố định để tạo hình viên thuốc hoàn hảo
        borderRadius: 32, // Bo tròn tuyệt đối (50% của height)
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 90
      }}
    >
      {children}
      <Text 
        numberOfLines={2} // Cho phép nhảy tối đa 2 dòng nếu label quá dài
        style={{
          color: focused ? '#FFFFFF' : '#909C8F',
          fontFamily: focused ? FontFamily.lexendDecaBold : FontFamily.lexendDecaMedium,
          fontSize: 11, // Giảm font size xuống một chút để chữ gọn gàng hơn
          marginTop: 4,
          textAlign: 'center', // Căn giữa phòng trường hợp chữ rớt dòng
        }}
      >
        {label}
      </Text>
    </MotiView>
  );
};

export default function TabLayout() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false, // Ẩn label mặc định để dùng custom label trong AnimatedTabItem
          headerShown: false,
          tabBarHideOnKeyboard: true,
          tabBarItemStyle: {
            justifyContent: 'center',
            alignItems: 'center',
          },
          tabBarStyle: {
            position: 'absolute',
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            // Tăng chiều cao tổng thể của TabBar để bọc vừa vặn viên thuốc 64px bên trong
            height: Platform.OS === 'ios' ? 86 + insets.bottom : 86 + Math.max(insets.bottom, 16), 
            paddingTop: 30,
            paddingBottom: Platform.OS === 'ios' ? insets.bottom : Math.max(insets.bottom, 16),
            backgroundColor: '#FFFFFF',
            borderTopWidth: 0,
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: -6 },
            shadowOpacity: 0.08,
            shadowRadius: 15,
            elevation: 15,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: t('tabs.learn', 'Học'),
            tabBarIcon: ({ focused }) => (
              <AnimatedTabItem focused={focused} label={t('tabs.learn', 'Học')}>
                {/* Làm icon đậm lên khi active để giống ảnh thiết kế */}
                <HouseIcon size={26} color={focused ? '#FFFFFF' : '#909C8F'} weight={"regular"} />
              </AnimatedTabItem>
            ),
          }}
        />
        <Tabs.Screen
          name="practice"
          options={{
            title: t('tabs.practice', 'Thi'),
            tabBarIcon: ({ focused }) => (
              <AnimatedTabItem focused={focused} label={t('tabs.practice', 'Thi')}>
                <PenNibStraightIcon size={26} color={focused ? '#FFFFFF' : '#909C8F'} weight={"regular"} />
              </AnimatedTabItem>
            ),
          }}
        />
        <Tabs.Screen
          name="discover"
          options={{
            title: t('tabs.discover', 'Khám phá'),
            tabBarIcon: ({ focused }) => (
              <AnimatedTabItem focused={focused} label={t('tabs.discover', 'Khám phá')}>
                <CompassIcon size={26} color={focused ? '#FFFFFF' : '#909C8F'} weight={"regular"} />
              </AnimatedTabItem>
            ),
          }}
        />
        <Tabs.Screen
          name="vocabulary"
          options={{
            title: t('tabs.vocabulary', 'Từ vựng'),
            tabBarIcon: ({ focused }) => (
              <AnimatedTabItem focused={focused} label={t('tabs.vocabulary', 'Từ vựng')}>
                <CardsIcon size={26} color={focused ? '#FFFFFF' : '#909C8F'} weight={"regular"} />
              </AnimatedTabItem>
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: t('tabs.profile', 'Tôi'),
            tabBarIcon: ({ focused }) => (
              <AnimatedTabItem focused={focused} label={t('tabs.profile', 'Tôi')}>
                <IdentificationBadgeIcon size={26} color={focused ? '#FFFFFF' : '#909C8F'} weight={"regular"} />
              </AnimatedTabItem>
            ),
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});