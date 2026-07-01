import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { CloudIcon } from 'phosphor-react-native';
import { FontFamily, FontSize, Padding, Gap, Border } from '../../constants/GlobalStyles';
import { StoreItem } from '../../api/types/gamification.types';
import Button from '../../components/Button';
import { useTheme } from "@/contexts/ThemeContext";

interface StoreItemCardProps {
  item: StoreItem;
  onExchange: (item: StoreItem) => void;
}

// Map ID của vật phẩm với đường dẫn file ảnh nội bộ
const localImages: Record<string, any> = {
  'R1': require('../../assets/images/storeItem/item1.png'),
  'R2': require('../../assets/images/storeItem/item2.png'),
  'R3': require('../../assets/images/storeItem/item3.png'),
  'R4': require('../../assets/images/storeItem/item4.png'),
  'R5': require('../../assets/images/storeItem/item5.png'),
  'R6': require('../../assets/images/storeItem/item6.png'),
  'R7': require('../../assets/images/storeItem/item7.png'),
};

export default function StoreItemCard({ item, onExchange }: StoreItemCardProps) {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  // Kiểm tra xem icon trả về là URL thật hay là Emoji (ví dụ: '❄️')
  const isUrlIcon = item.icon?.startsWith('http');

  // Tìm xem item này có ảnh nội bộ tương ứng hay không
  const localImage = localImages[item.id];

  return (
    <View style={styles.cardContainer}>
      {/* Hàng trên: Icon và Nội dung */}
      <View style={styles.topRow}>
        {/* Ảnh / Icon vật phẩm */}
        <View style={styles.iconBox}>
          {localImage ? (
            <Image source={localImage} style={styles.itemImage} contentFit="contain" />
          ) : isUrlIcon ? (
            <Image source={{ uri: item.icon }} style={styles.itemImage} contentFit="contain" />
          ) : (
            <Text style={styles.emojiIcon}>{item.icon}</Text>
          )}
        </View>

        {/* Nội dung */}
        <View style={styles.contentBox}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <Text style={styles.itemDesc} numberOfLines={2}>{item.desc}</Text>
        </View>
      </View>

      {/* Hàng dưới: Giá tiền và Nút đổi */}
      <View style={styles.bottomRow}>
        <View style={styles.priceBadge}>
          <CloudIcon size={18} color={colors.primary} weight="fill" />
          <Text style={styles.priceText}>{item.price}</Text>
        </View>

        <Button
          title="Đổi ngay"
          variant="Green"
          onPress={() => onExchange(item)}
          style={styles.exchangeButton}
        />
      </View>
    </View>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  cardContainer: {
    backgroundColor: colors.background,
    borderRadius: Border.br_20,
    padding: Padding.padding_15,
    marginBottom: Gap.gap_15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
  },
  iconBox: {
    width: 80,
    height: 80,
    borderRadius: Border.br_15,
    backgroundColor: colors.backgroundSubtle, // Nền xám nhạt cho khung ảnh
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Gap.gap_15,
  },
  itemImage: {
    width: 60,
    height: 60,
  },
  emojiIcon: {
    fontSize: 40,
  },
  contentBox: {
    flex: 1,
    justifyContent: 'center',
  },
  itemTitle: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_16,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  itemDesc: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Gap.gap_15,
  },
  priceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  priceText: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: FontSize.fs_16,
    color: colors.primary,
  },
  exchangeButton: {
    marginVertical: 0, // Ghi đè margin mặc định của Button
    height: 40, // Chỉnh lại chiều cao nhỏ hơn một chút cho hợp với nội dung thẻ
    paddingHorizontal: 20,
  },
});