import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon, ReceiptIcon } from 'phosphor-react-native';

// Constants
import { Color, FontFamily, FontSize, Padding, Gap, Border } from '../../constants/GlobalStyles';
import ScreenHeader from '@/components/ScreenHeader';
import SubscriptionService from '../../api/services/subscription.service';
import { PaymentHistoryItem } from '../../api/types/subscription.types';

export default function PaymentHistoryScreen() {
  const router = useRouter();

  const [historyData, setHistoryData] = useState<PaymentHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchHistory = async (isRefresh = false) => {
    try {
      if (!isRefresh) setIsLoading(true);
      const response = await SubscriptionService.getPaymentHistory();
      if (response.success) {
        setHistoryData(response.data);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải lịch sử thanh toán. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchHistory(true);
  };

  // Thành phần render từng dòng lịch sử
  const renderItem = ({ item }: { item: PaymentHistoryItem }) => {
    const isSuccess = item.status === 'completed';
    const isPending = item.status === 'pending';
    const isRefunded = item.status === 'refunded';

    let statusText = 'Thất bại';
    let statusStyle = styles.textFailed;

    if (isSuccess) {
      statusText = 'Thành công';
      statusStyle = styles.textSuccess;
    } else if (isPending) {
      statusText = 'Đang xử lý';
      statusStyle = styles.textPending;
    } else if (isRefunded) {
      statusText = 'Đã hoàn tiền';
      statusStyle = styles.textRefunded;
    }

    const dateObj = new Date(item.paidAt || item.createdAt);
    const dateStr = dateObj.toLocaleDateString('vi-VN');
    const timeStr = dateObj.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

    return (
      <View style={styles.transactionItem}>
        {/* Cột trái: Tên gói và Thời gian */}
        <View style={styles.itemLeft}>
          <Text style={styles.planName}>{item.purchasedPlanName}</Text>
          <Text style={styles.dateTimeText}>
            {timeStr} • {dateStr}
          </Text>
        </View>

        {/* Cột phải: Số tiền và Trạng thái */}
        <View style={styles.itemRight}>
          <Text style={styles.amountText}>{item.amountPaid.toLocaleString('vi-VN')} đ</Text>
          <Text style={[styles.statusText, statusStyle]}>
            {statusText}
          </Text>
        </View>
      </View>
    );
  };

  // Thành phần hiển thị khi không có dữ liệu (Empty State)
  const renderEmptyComponent = () => {
    if (isLoading) {
      return <ActivityIndicator size="large" color={Color.main} style={{ marginTop: 100 }} />;
    }
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconWrapper}>
          <ReceiptIcon size={48} color={Color.stroke} weight="duotone" />
        </View>
        <Text style={styles.emptyTitle}>Chưa có giao dịch nào</Text>
        <Text style={styles.emptySubText}>
          Lịch sử thanh toán các gói học tập của bạn sẽ xuất hiện tại đây.
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      
      {/* --- HEADER --- */}
      <ScreenHeader
        title="Lịch sử thanh toán" />
       
      {/* --- LIST CONTENT --- */}
      <FlatList
        data={historyData}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        ListEmptyComponent={renderEmptyComponent}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        // Thêm đường gạch mờ phân cách giữa các item
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Color.main} />}
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Color.bg,
  },
  
  // --- HEADER ---
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Padding.padding_15,
    paddingTop: Padding.padding_10,
    paddingBottom: Padding.padding_15,
    backgroundColor: Color.bg,
    borderBottomWidth: 1,
    borderBottomColor: Color.stroke, // Line mờ dưới header để tách biệt danh sách
  },
  backButton: {
    marginRight: Gap.gap_15,
  },
  headerTitle: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_20,
    color: Color.text,
  },

  // --- LIST CONTENT ---
  listContent: {
    paddingHorizontal: Padding.padding_15,
    paddingTop: Padding.padding_10,
    paddingBottom: 40,
    flexGrow: 1, // Để Empty State có thể căn giữa màn hình nếu list trống
  },
  separator: {
    height: 1,
    backgroundColor: Color.stroke,
    opacity: 0.3,
    marginVertical: Padding.padding_15,
  },

  // --- TRANSACTION ITEM ---
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Color.bg,
    borderRadius: Border.br_10,
    paddingVertical: Padding.padding_15,
  },
  itemLeft: {
    flex: 1,
    paddingRight: Padding.padding_10,
  },
  planName: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_16,
    color: Color.text,
    marginBottom: 4,
  },
  dateTimeText: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_12,
    color: Color.gray,
  },
  itemRight: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_16,
    color: Color.text,
    marginBottom: 4,
  },
  statusText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_12,
  },
  textSuccess: {
    color: Color.green, // Xanh lá đậm cho thành công
  },
  textFailed: {
    color: Color.red, // Đỏ cho thất bại
  },
  textPending: {
    color: Color.cam, // Màu cam cho trạng thái chờ
  },
  textRefunded: {
    color: Color.gray, // Xám cho trạng thái đã hoàn tiền
  },

  // --- EMPTY STATE ---
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100, // Đẩy xuống giữa màn hình
  },
  emptyIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Color.greenLight, // Hoặc Color.bgTest
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Gap.gap_20,
  },
  emptyTitle: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_16,
    color: Color.text,
    marginBottom: Gap.gap_10,
  },
  emptySubText: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_14,
    color: Color.gray,
    textAlign: 'center',
    paddingHorizontal: Padding.padding_30,
  },
});