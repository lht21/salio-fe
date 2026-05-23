import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, FlatList, ActivityIndicator, Alert, Pressable, Animated, PanResponder } from 'react-native';
import { SealCheckIcon } from 'phosphor-react-native';
import { Color, FontFamily, FontSize, Gap, Border, Padding } from '../../constants/GlobalStyles';
import GamificationService from '../../api/services/gamification.service';
import Button from '../Button';
import CloseButton from '../CloseButton';
import ConfettiCannon from 'react-native-confetti-cannon';

interface DailyMissionsModalProps {
  isVisible: boolean;
  onClose: () => void;
  onClaimSuccess?: (reward: number) => void;
  autoTriggerConfetti?: boolean;
}

export default function DailyMissionsModal({ isVisible, onClose, onClaimSuccess, autoTriggerConfetti }: DailyMissionsModalProps) {
  const [missions, setMissions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>('');

  // Khởi tạo giá trị dịch chuyển dọc cho hiệu ứng vuốt
  const panY = useRef(new Animated.Value(0)).current;

  // Bắt sự kiện vuốt (PanResponder)
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Chỉ kích hoạt khi vuốt xuống (dy > 10)
        return gestureState.dy > 10 && Math.abs(gestureState.dx) < Math.abs(gestureState.dy);
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          panY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100 || gestureState.vy > 0.5) {
          onClose(); // Đóng Modal nếu vuốt đủ sâu hoặc nhanh
        } else {
          Animated.spring(panY, {
            toValue: 0,
            useNativeDriver: true,
          }).start(); // Nảy lại vị trí cũ nếu vuốt chưa tới
        }
      },
    })
  ).current;

  // Tự động gọi lại API lấy danh sách nhiệm vụ mỗi khi Modal được bật lên
  useEffect(() => {
    if (isVisible) {
      panY.setValue(0); // Reset vị trí khi mở lại Modal
      fetchMissions();
    }
  }, [isVisible]);

  useEffect(() => {
    if (isVisible && autoTriggerConfetti) {
      setShowConfetti(true);
      // Tự tắt pháo giấy sau 3 giây để giải phóng bộ nhớ
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    } else {
      setShowConfetti(false); // Reset khi đóng modal
    }
  }, [isVisible, autoTriggerConfetti]);

  // Hiệu ứng đếm ngược thời gian
  useEffect(() => {
    if (!isVisible) return;

    const calculateTimeLeft = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setHours(24, 0, 0, 0); // Đặt mốc thời gian là 00:00 ngày mai

      const diff = tomorrow.getTime() - now.getTime();
      
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    };

    calculateTimeLeft(); // Gọi ngay lần đầu để tránh bị trễ 1 giây
    const timerId = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timerId); // Dọn dẹp interval khi đóng Modal
  }, [isVisible]);

  const fetchMissions = async () => {
    try {
      setIsLoading(true);
      const res = await GamificationService.getDailyMissions();
      if (res.success && res.data) {
        setMissions(res.data);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách nhiệm vụ:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm xử lý khi nhấn "Nhận"
  const handleClaim = async (missionId: string, reward: number) => {
    try {
      const res = await GamificationService.claimMissionReward({ missionId });
      if (res.success) {
        fetchMissions(); // Cập nhật lại UI sau khi nhận
        if (onClaimSuccess) onClaimSuccess(reward); // Cập nhật mây trên Header
      }
    } catch (error: any) {
      Alert.alert('Không thành công', error.response?.data?.message || 'Không thể nhận thưởng.');
    }
  };

  const renderMission = ({ item }: { item: any }) => {
    const progressPercent = Math.min((item.progress / item.target) * 100, 100);

    return (
      <View style={styles.missionItem}>
        <View style={styles.missionInfo}>
          <Text style={styles.missionTitle}>{item.title}</Text>
          <Text style={styles.missionDesc}>{item.condition}</Text>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
            </View>
            <Text style={styles.progressText}>{item.progress}/{item.target}</Text>
          </View>
        </View>

        <View style={styles.missionAction}>
          {item.isClaimed ? (
            <SealCheckIcon size={32} color={Color.main} weight="fill" />
          ) : item.isCompleted ? (
            <Button 
              title="Nhận" 
              variant="Green" 
              onPress={() => handleClaim(item.id, item.reward)} 
              style={styles.claimBtn}
            />
          ) : (
            <View style={styles.rewardBadge}>
              <Text style={styles.rewardText}>+{item.reward} ☁️</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <>
      <Modal
        transparent={true}
        visible={isVisible}
        animationType="slide"
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.backgroundTouchable} onPress={onClose} />
          <Animated.View style={[styles.sheetContent, { transform: [{ translateY: panY }] }]}>
            {/* Vùng có thể vuốt: Thanh kéo và Tiêu đề */}
            <View {...panResponder.panHandlers} style={styles.swipeArea}>
              <View style={styles.dragHandle} />
              {/* Tiêu đề và Nút Đóng */}
              <View style={styles.header}>
                <View>
                  <Text style={styles.modalTitle}>Nhiệm vụ hằng ngày</Text>
                  <Text style={styles.timerText}>Làm mới sau: {timeLeft}</Text>
                </View>
                <CloseButton variant="Stroke" onPress={onClose} />
              </View>
            </View>
            
            {/* Danh sách nhiệm vụ */}
            {isLoading ? (
              <ActivityIndicator size="large" color={Color.main} style={{ marginVertical: 30 }} />
            ) : (
              <FlatList
                data={missions}
                keyExtractor={(item) => item.id}
                renderItem={renderMission}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
              />
            )}
          </Animated.View>
        </View>
      </Modal>
      {showConfetti && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, elevation: 9999 }} pointerEvents="none">
          <ConfettiCannon count={100} origin={{ x: -10, y: 0 }} />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)', // Nền đen mờ 40% giống index.tsx
    justifyContent: 'flex-end',
  },
  backgroundTouchable: { 
    position: 'absolute', 
    top: 0, 
    bottom: 0, 
    left: 0, 
    right: 0 
  },
  sheetContent: {
    backgroundColor: Color.bg,
    borderTopLeftRadius: Border.br_30,
    borderTopRightRadius: Border.br_30,
    paddingHorizontal: Padding.padding_20,
    paddingTop: Padding.padding_15,
    paddingBottom: 40,
    maxHeight: '80%', // Tránh làm modal quá dài vượt màn hình
  },
  swipeArea: {
    backgroundColor: 'transparent',
  },
  dragHandle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: Gap.gap_15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Gap.gap_15,
    backgroundColor: Color.main,
    padding: Padding.padding_15,
    borderRadius: Border.br_20,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: FontFamily.lexendDecaSemiBold,
    color: Color.text,
  },
  timerText: {
    fontSize: FontSize.fs_12,
    fontFamily: FontFamily.lexendDecaMedium,
    color: Color.bg || '#F59E0B',
    marginTop: 2,
  },
  listContent: {
    gap: Gap.gap_15,
  },
  missionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Color.bg2 || '#F1F5F9', // Xám siêu nhạt tạo cảm giác khối
    padding: Padding.padding_15,
    borderRadius: Border.br_20,
    gap: Gap.gap_10,
    borderBottomWidth: 5,
    borderBottomColor: Color.color,
    borderLeftWidth: 2,
    borderLeftColor: Color.color, // Tạo hiệu ứng phân tách giữa các nhiệm vụ
  },
  missionInfo: { flex: 1 },
  missionTitle: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_14, color: Color.text, marginBottom: 4 },
  missionDesc: { fontFamily: FontFamily.lexendDecaRegular, fontSize: FontSize.fs_12, color: Color.gray, marginBottom: 8 },
  progressContainer: { flexDirection: 'row', alignItems: 'center', gap: Gap.gap_10 },
  progressBarBg: { flex: 1, height: 6, backgroundColor: Color.stroke, borderRadius: 3, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: Color.orange || '#F59E0B' }, // Dùng màu cam hoặc fallback vàng cam
  progressText: { fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_12, color: Color.gray },
  missionAction: { alignItems: 'center', justifyContent: 'center' },
  claimBtn: {
    height: 36,
    paddingHorizontal: 16,
    marginVertical: 0,
  },
  rewardBadge: { backgroundColor: '#E0F2FE', paddingHorizontal: 12, paddingVertical: 6, borderRadius: Border.br_30 },
  rewardText: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_12, color: '#0284C7' }
});
