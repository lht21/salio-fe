import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { UsersIcon } from 'phosphor-react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { FontFamily, FontSize, Padding, Gap, Border } from '../../constants/GlobalStyles';

interface FeaturedCardProps {
  topic: any;
  onPress: () => void;
}

const FeaturedCard: React.FC<FeaturedCardProps> = ({ topic, onPress }) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.featuredContainer}>
      <View style={styles.featuredCardOuter}>
        <Pressable style={styles.featuredCard} onPress={onPress}>
          <View style={styles.featuredMainContent}>
            <Image source={topic.image} style={styles.featuredImage} resizeMode="cover" />
            <View style={styles.featuredTextContent}>
              <Text style={styles.featuredTitle} numberOfLines={2}>{topic.title}</Text>
              <Text style={styles.featuredDesc} numberOfLines={3}>{topic.prompt || topic.instruction || t('practice.no_description', 'Không có mô tả')}</Text>
            </View>
          </View>
          <View style={styles.featuredFooter}>
            {(topic.level || (topic.tags && topic.tags.length > 0)) ? (
              <View style={styles.badgeContainer}>
                <Text style={styles.badgeText}>{topic.level || topic.tags[0]}</Text>
              </View>
            ) : <View />}
            <View style={styles.statsContainer}>
              <UsersIcon size={16} color={colors.gray} weight="fill" />
              <Text style={styles.statsText}>1.2k lượt viết</Text>
            </View>
          </View>
        </Pressable>
      </View>
    </View>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  featuredContainer: {
    gap: Gap.gap_10,
  },
  featuredCardOuter: {
    backgroundColor: colors.bg,
    borderRadius: Border.br_30,
    borderWidth: 1.5,
    borderColor: colors.main2,
    padding: 2,
  },
  featuredCard: {
    backgroundColor: colors.bg,
    borderWidth: 1.5,
    borderColor: colors.stroke,
    borderRadius: 25,
    padding: Padding.padding_15,
    gap: Gap.gap_15,
  },
  featuredMainContent: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: Gap.gap_15,
  },
  featuredTextContent: {
    flex: 1,
    justifyContent: 'center',
  },
  featuredTitle: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: FontSize.fs_16,
    color: colors.text,
    marginBottom: Gap.gap_5,
  },
  featuredDesc: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_14,
    color: colors.color, 
    lineHeight: 20,
  },
  featuredImage: {
    width: 90,
    height: '100%',
    minHeight: 90,
    borderRadius: Border.br_15,
  },
  featuredFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.stroke,
    paddingTop: Padding.padding_10,
  },
  badgeContainer: {
    backgroundColor: colors.vang,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: Border.br_10,
  },
  badgeText: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: 10,
    color: colors.text,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statsText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_12,
    color: colors.gray,
  },
});

export default FeaturedCard;