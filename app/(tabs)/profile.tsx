import React from 'react';
import { StyleSheet, ScrollView, View} from 'react-native';
import { CertificateIcon, CloudIcon } from 'phosphor-react-native';
import { Color } from '../../constants/GlobalStyles';

// Import sub-components
import ProfileHeader from '../../components/ProfileHeader';
import StatsRow from '../../components/StatsRow';
import AlertBanner from '../../components/AlertBanner';
import StreakCalendar from '../../components/StreakCalendar';
import {MenuItem} from '../../components/MenuItem'; 
import { UpgradeBanner } from '../../components/UpgradeBanner';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  return (
    <View style={styles.safeArea}>
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        bounces={false} // Để tắt hiệu ứng nảy làm lộ background trắng trên iOS
      >
        
        {/* Header (Background xanh + Avatar + Info) */}
        <ProfileHeader />

        {/* Khối 3 thông số */}
        <StatsRow />

        {/* Banner Vàng Thông báo */}
        <AlertBanner />

        {/* Lịch chuỗi hoạt động */}
        <StreakCalendar />

        {/* Menu Items */}
        <MenuItem 
          icon={<CertificateIcon size={24} color={Color.main2} weight="fill" />}
          title="Chứng chỉ"
          subtitle="2 chứng chỉ đã ghi nhận"
        />
        
        <MenuItem 
          icon={<CloudIcon size={24} color={Color.main2} weight="fill" />}
          title="103 đám mây"
          subtitle="Quy đổi phần thưởng"
        />

        {/* Banner Xanh nâng cấp */}
        <UpgradeBanner />

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Color.main || '#FFFFFF',
    paddingTop: 50,
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: Color.bg,
    paddingBottom: 20,
  }
});