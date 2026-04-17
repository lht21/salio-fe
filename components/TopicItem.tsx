import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { CheckCircleIcon, ClockIcon } from 'phosphor-react-native';
import { Color, FontFamily, FontSize, Border, Padding, Gap } from '../constants/GlobalStyles';

export interface TopicItemData {
  title: string;
  description: string;
  image: any;
  score?: string;    // Bổ sung cho danh sách lịch sử
  timeAgo?: string;  // Bổ sung cho danh sách lịch sử
}

interface TopicItemProps {
  topic: TopicItemData;
  onPress: () => void;
  onLongPress?: () => void;
}

const TopicItem = ({ topic, onPress, onLongPress }: TopicItemProps) => (
  <Pressable 
    style={styles.topicItemCard} 
    onPress={onPress} 
    onLongPress={onLongPress}
  >
    <Image source={topic.image} style={styles.topicItemImage} resizeMode="cover" />
    <View style={styles.topicItemTextContent}>
      <Text style={styles.topicItemTitle} numberOfLines={1}>{topic.title}</Text>
      
      {topic.score && topic.timeAgo ? (
        <View style={styles.infoRow}>
          <View style={styles.badge}>
            <CheckCircleIcon size={14} color={Color.green || '#4A9F00'} weight="fill" />
            <Text style={styles.scoreText}>{topic.score}</Text>
          </View>
          <View style={styles.timeWrap}>
            <ClockIcon size={14} color={Color.gray || '#64748B'} weight="regular" />
            <Text style={styles.timeText}>{topic.timeAgo}</Text>
          </View>
        </View>
      ) : (
        <Text style={styles.topicItemDesc} numberOfLines={2}>{topic.description}</Text>
      )}
    </View>
  </Pressable>
);

const styles = StyleSheet.create({
  topicItemCard: {
    flexDirection: 'row',
    backgroundColor: Color.bg,
    borderRadius: Border.br_20,
    padding: Padding.padding_15,
    borderWidth: 2,
    borderColor: Color.stroke,
    alignItems: 'center',
  },
  topicItemImage: {
    width: 70,
    height: 70,
    borderRadius: Border.br_15,
  },
  topicItemTextContent: {
    flex: 1,
    marginLeft: Gap.gap_15,
    justifyContent: 'center',
  },
  topicItemTitle: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_14,
    color: Color.text,
    marginBottom: Gap.gap_5,
  },
  topicItemDesc: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_12,
    color: Color.gray,
  },
  
  // --- STYLES CHO LỊCH SỬ ---
  infoRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: Gap.gap_10 || 10 
  },
  badge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 4, 
    backgroundColor: '#F0FDF4', 
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    borderRadius: 8 
  },
  scoreText: { fontFamily: FontFamily.lexendDecaBold, fontSize: FontSize.fs_12 || 12, color: Color.green || '#4A9F00' },
  timeWrap: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  timeText: { fontFamily: FontFamily.lexendDecaRegular, fontSize: FontSize.fs_12 || 12, color: Color.gray || '#64748B' },
});

export default TopicItem;