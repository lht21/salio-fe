import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Color, Padding } from '../../constants/GlobalStyles';
import GamificationService from '../../api/services/gamification.service';
import { useUser } from '../../contexts/UserContext';
import { StoreItem } from '../../api/types/gamification.types';
import { useModal } from '../../contexts/ModalContext';

import StoreHeader from '../cloud/StoreHeader';
import StoreItemCard from '../cloud/StoreItemCard';
import DailyMissionsModal from '../../components/Modals/DailyMissionsModal';

export default function StoreScreen() {
  const router = useRouter();
  const { stats, refreshUser } = useUser();
  const { showModal } = useModal();
  const [clouds, setClouds] = useState<number>(0);
  const [storeItems, setStoreItems] = useState<StoreItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPurchasing, setIsPurchasing] = useState<boolean>(false);
  const [isMissionsModalVisible, setIsMissionsModalVisible] = useState<boolean>(false);

  // Tính số lượng nhiệm vụ đã hoàn thành dựa trên tiến độ và mốc target
  const MISSION_TARGETS: Record<string, number> = { 'D1': 1, 'D2': 10, 'D3': 1, 'D4': 1, 'D5': 1 };
  const completedMissionsCount = stats?.gamification?.dailyQuest?.missions?.filter(
    (m: any) => m.progress >= (MISSION_TARGETS[m.id] || 1)
  ).length || 0;

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        setIsLoading(true);
        const response = await GamificationService.getStoreItems();
        if (response.success && response.data) {
          setClouds(response.data.clouds);
          setStoreItems(response.data.store);
        }
      } catch (error: any) {
        showModal({
          title: 'Lỗi',
          subtitle: 'Không thể tải dữ liệu cửa hàng. Vui lòng thử lại.',
          hideCancelButton: true,
          isDestructive: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStoreData();
  }, []);

  const handleExchange = (item: StoreItem) => {
    showModal({
      title: "Đổi vật phẩm",
      subtitle: `Bạn có chắc muốn dùng ${item.price} mây để đổi ${item.title} không?`,
      confirmText: "Đồng ý",
      cancelText: "Hủy",
      onConfirm: async () => {
        try {
          setIsPurchasing(true);
          // Gọi API mua vật phẩm. (Với R4 và R7 có thể cần popup chọn missionId/examId, ở đây xử lý cơ bản)
          const response = await GamificationService.purchaseItem({ itemId: item.id });
          if (response.success && response.data) {
            setClouds(response.data.clouds);
            showModal({
              title: 'Thành công 🎉',
              subtitle: `Bạn đã đổi thành công ${item.title}!`,
              hideCancelButton: true,
            });
          }
        } catch (error: any) {
          showModal({
            title: 'Không thành công',
            subtitle: error.response?.data?.message || 'Bạn không đủ mây hoặc xảy ra lỗi.',
            hideCancelButton: true,
            isDestructive: true,
          });
        } finally {
          setIsPurchasing(false);
        }
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StoreHeader 
        clouds={clouds} 
        missionsCount={completedMissionsCount} // Sử dụng dữ liệu động từ UserContext
        onBack={() => router.back()} 
        onHistory={() => showModal({
          title: 'Lịch sử',
          subtitle: 'Tính năng đang phát triển',
          hideCancelButton: true
        })}
        onMissionsPress={() => setIsMissionsModalVisible(true)}
      />

      {isLoading || isPurchasing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Color.main} />
        </View>
      ) : (
        <FlatList
          data={storeItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <StoreItemCard item={item} onExchange={handleExchange} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      <DailyMissionsModal 
        isVisible={isMissionsModalVisible} 
        onClose={() => setIsMissionsModalVisible(false)}
        onClaimSuccess={(reward) => {
          setClouds(prev => prev + reward); // Trực tiếp cộng điểm mây vào ví ngay khi nhận
          refreshUser(); // Làm mới Context để cập nhật lại số lượng nhiệm vụ sau khi nhận
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.bg2, // Nền màu xám nhạt để các thẻ màu trắng nổi bật bóng đổ
  },
  listContent: {
    paddingHorizontal: Padding.padding_20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
