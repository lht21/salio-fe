import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { ReceiptIcon, LockKeyIcon } from 'phosphor-react-native';
import { Border, Color, FontFamily, FontSize, Gap, Padding } from '../../constants/GlobalStyles';

interface MiniTestCardProps {
  isLocked: boolean;
  onPress: () => void;
}

export default function MiniTestCard({ isLocked, onPress }: MiniTestCardProps) {
  return (
    <TouchableOpacity 
      style={[styles.card, isLocked && styles.cardLocked]}
      activeOpacity={0.8}
      disabled={isLocked}
      onPress={onPress}
    >
      <View style={styles.topRow}>
        <View style={styles.textContainer}>
          <Text style={[styles.title, isLocked && styles.textLocked]}>
            Kiểm tra cuối bài học
          </Text>
          <Text style={styles.subtitle}>
            {isLocked ? "Hoàn thành bài học để mở khóa" : "Kiểm tra kiến thức đã học"}
          </Text>
        </View>
        <View style={[styles.iconCircle, isLocked && styles.iconCircleLocked]}>
          {isLocked ? (
             <LockKeyIcon size={24} color={Color.gray} weight="fill" />
          ) : (
             <ReceiptIcon size={24} color={Color.main500 || '#70B924'} weight="fill" />
          )}
        </View>
      </View>

      <View style={styles.bottomRow}>
        <View style={[styles.badge, styles.badgeOrange, isLocked && styles.badgeLocked]}>
          <Text style={[styles.badgeTextOrange, isLocked && styles.badgeTextLocked]}>+1 Huy hiệu bài học</Text>
          <Image 
            source={require('../../assets/images/horani/sc1_b0.png')} 
            style={styles.badgeImage} 
            resizeMode="contain" 
          />
        </View>

        <View style={[styles.badge, styles.badgeBlue, isLocked && styles.badgeLocked]}>
          <Text style={[styles.badgeTextBlue, isLocked && styles.badgeTextLocked]}>+150 đám mây</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Color.brown50 || '#FDF8F0',
    borderWidth: 2,
    borderColor: Color.brown500 || '#8A6A4B',
    borderBottomWidth: 7,
    borderRadius: 30,
    padding: Padding.padding_20,
    marginTop: Gap.gap_15 || 16,
  },
  cardLocked: {
    backgroundColor: '#F3F4F6',
    borderColor: '#D1D5DB',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    paddingRight: 16,
  },
  title: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: 18,
    color: Color.main500 || '#6BAF25',
    marginBottom: 4,
  },
  textLocked: {
    color: Color.gray,
  },
  subtitle: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: 14,
    color: Color.gray || '#6F7B91',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Color.main100 || '#DDF5A5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircleLocked: {
    backgroundColor: '#E5E7EB',
  },
  bottomRow: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    height: 32,
  },
  badgeOrange: {
    backgroundColor: Color.orange50 || '#FFF0E0',
  },
  badgeBlue: {
    backgroundColor: Color.blue50 || '#E0F4FF',
  },
  badgeLocked: {
    backgroundColor: '#E5E7EB',
  },
  badgeTextOrange: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: 13,
    color: Color.orange500 || '#E87A24',
  },
  badgeTextBlue: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: 13,
    color: Color.blue600 || '#1DA1F2',
  },
  badgeTextLocked: {
    color: Color.gray,
  },
  badgeImage: {
    width: 20,
    height: 20,
    marginLeft: 6,
  },
});
