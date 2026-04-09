import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon, ReceiptIcon } from 'phosphor-react-native';

// Constants
import { Color, FontFamily, FontSize, Padding, Gap, Border } from '../../constants/GlobalStyles';

// Định nghĩa kiểu dữ liệu cho giao dịch
type Transaction = {
  id: string;
  date: string;
  time: string;
  planName: string;
  amount: string;
  status: 'success' | 'failed';
};

// Mock Data: Dữ liệu lịch sử giả lập
const HISTORY_DATA: Transaction[] = [
  {
    id: 'TXN-1003',
    date: '20/12/2025',
    time: '14:30',
    planName: 'Gói 1 năm (Salio Master)',
    amount: '699.000 đ',
    status: 'success',
  },
  {
    id: 'TXN-1002',
    date: '20/11/2025',
    time: '09:15',
    planName: 'Gói 1 tháng (Salio Master)',
    amount: '99.000 đ',
    status: 'success',
  },
  {
    id: 'TXN-1001',
    date: '20/11/2025',
    time: '09:10',
    planName: 'Gói 1 tháng (Salio Master)',
    amount: '99.000 đ',
    status: 'failed',
  },
];

export default function PaymentHistoryScreen() {
  const router = useRouter();

  // Thành phần render từng dòng lịch sử
  const renderItem = ({ item }: { item: Transaction }) => {
    const isSuccess = item.status === 'success';

    return (
      <View style={styles.transactionItem}>
        {/* Cột trái: Tên gói và Thời gian */}
        <View style={styles.itemLeft}>
          <Text style={styles.planName}>{item.planName}</Text>
          <Text style={styles.dateTimeText}>
            {item.time} • {item.date}
          </Text>
        </View>

        {/* Cột phải: Số tiền và Trạng thái */}
        <View style={styles.itemRight}>
          <Text style={styles.amountText}>{item.amount}</Text>
          <Text style={[styles.statusText, isSuccess ? styles.textSuccess : styles.textFailed]}>
            {isSuccess ? 'Thành công' : 'Thất bại'}
          </Text>
        </View>
      </View>
    );
  };

  // Thành phần hiển thị khi không có dữ liệu (Empty State)
  const renderEmptyComponent = () => (
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

  return (
    <SafeAreaView style={styles.safeArea}>
      
      {/* --- HEADER --- */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeftIcon size={24} color={Color.text} weight="bold" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lịch sử thanh toán</Text>
      </View>

      {/* --- LIST CONTENT --- */}
      <FlatList
        data={HISTORY_DATA}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={renderEmptyComponent}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        // Thêm đường gạch mờ phân cách giữa các item
        ItemSeparatorComponent={() => <View style={styles.separator} />}
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