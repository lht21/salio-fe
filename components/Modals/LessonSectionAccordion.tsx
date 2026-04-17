import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AnimatePresence, MotiView } from 'moti';
import { BookmarkSimpleIcon, CaretDownIcon, CaretUpIcon, CheckCircleIcon } from 'phosphor-react-native';

import { Border, Color, FontFamily, FontSize, Gap, Stroke } from '../../constants/GlobalStyles';

export type LessonSectionDetailItem = {
  id: string;
  left: string;
  right: string;
  status: 'learning' | 'done' | 'todo';
};

export type LessonSectionAccordionProps = {
  delay?: number;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  progressText: string;
  progressValue: number;
  progressColor: string;
  progressTrackColor?: string;
  backgroundColor?: string;
  expandable?: boolean;
  initiallyExpanded?: boolean;
  details?: LessonSectionDetailItem[];
  footerBadges?: string[];
  onPress?: () => void;
};

const STATUS_STYLES = {
  learning: {
    textColor: Color.xanh,
    iconColor: Color.xanh,
    label: 'Đang học',
  },
  done: {
    textColor: Color.green,
    iconColor: Color.green,
    label: 'Thành thạo',
  },
  todo: {
    textColor: Color.cam,
    iconColor: Color.gray,
    label: 'Chưa học',
  },
};

const BADGE_COLORS = ['#FFA45A', '#3B82F6', '#65A30D'];

const LessonSectionAccordion = ({
  delay = 0,
  icon,
  title,
  subtitle,
  progressText,
  progressValue,
  progressColor,
  progressTrackColor = '#E5E7EB',
  backgroundColor = Color.bg,
  expandable = false,
  initiallyExpanded = false,
  details = [],
  footerBadges = [],
  onPress,
}: LessonSectionAccordionProps) => {
  const [expanded, setExpanded] = React.useState(initiallyExpanded);
  const canExpand = expandable && details.length > 0;

  return (
    <MotiView
      from={{ opacity: 0, translateY: 12 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 350, delay }}
      style={[styles.card, { backgroundColor }]}
    >
      <View style={styles.header}>
        <Pressable style={styles.contentPressable} onPress={onPress} disabled={!onPress}>
          <View style={styles.headerInfo}>
            <View style={styles.iconWrap}>{icon}</View>

            <View style={styles.textWrap}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.subtitle}>{subtitle}</Text>
            </View>
          </View>
        </Pressable>
        <Pressable
          style={styles.expandButton}
          onPress={canExpand ? () => setExpanded((value) => !value) : undefined}
          disabled={!canExpand}
          hitSlop={10}
        >
          {canExpand ? (
            expanded ? (
              <CaretUpIcon size={18} color={Color.gray} weight="bold" />
            ) : (
              <CaretDownIcon size={18} color={Color.gray} weight="bold" />
            )
          ) : (
            <CaretDownIcon size={18} color={Color.stroke} weight="bold" />
          )}
        </Pressable>
      </View>

      <AnimatePresence>
        {expanded && canExpand ? (
          <MotiView
            key="accordion-body"
            from={{ opacity: 0, height: 0, translateY: -8 }}
            animate={{ opacity: 1, height: 'auto', translateY: 0 }}
            exit={{ opacity: 0, height: 0, translateY: -8 }}
            transition={{ type: 'timing', duration: 280 }}
            style={styles.bodyWrap}
          >
            <Pressable style={styles.body} onPress={onPress} disabled={!onPress}>
              {details.map((item, index) => {
                const statusTone = STATUS_STYLES[item.status];

                return (
                  <MotiView
                    key={item.id}
                    from={{ opacity: 0, translateY: 6 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'timing', duration: 220, delay: index * 45 }}
                    style={styles.detailRow}
                  >
                    <Text style={styles.detailLeft}>{item.left}</Text>
                    <Text style={styles.detailRight}>{item.right}</Text>

                    <View style={styles.statusWrap}>
                      <Text style={[styles.statusText, { color: statusTone.textColor }]}>
                        {statusTone.label}
                      </Text>
                      <BookmarkSimpleIcon size={15} color={statusTone.iconColor} weight="regular" />
                    </View>
                  </MotiView>
                );
              })}

              {footerBadges.length > 0 ? (
                <MotiView
                  from={{ opacity: 0, translateY: 8 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{ type: 'timing', duration: 220, delay: details.length * 45 }}
                  style={styles.badgeRow}
                >
                  {footerBadges.map((badge, index) => (
                    <View
                      key={`${badge}-${index}`}
                      style={[styles.badge, { backgroundColor: BADGE_COLORS[index % BADGE_COLORS.length] }]}
                    >
                      <Text style={styles.badgeText}>{badge}</Text>
                    </View>
                  ))}
                </MotiView>
              ) : null}
            </Pressable>
          </MotiView>
        ) : null}
      </AnimatePresence>

      <Pressable style={styles.footer} onPress={onPress} disabled={!onPress}>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${progressValue}%`,
                backgroundColor: progressColor,
              },
            ]}
          />
          <View style={[styles.progressRemaining, { backgroundColor: progressTrackColor }]} />
        </View>

        <View style={styles.progressLabel}>
          <CheckCircleIcon size={15} color={progressColor} weight="fill" />
          <Text style={[styles.progressText, { color: progressColor }]}>{progressText}</Text>
        </View>
      </Pressable>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    borderWidth: Stroke.stroke,
    borderColor: Color.stroke,
    padding: 16,
    gap: Gap.gap_10,
  },
  contentPressable: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Gap.gap_10,
  },
  headerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.gap_10,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: {
    flex: 1,
    gap: 3,
  },
  expandButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_16,
    color: Color.text,
  },
  subtitle: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_12,
    color: Color.gray,
  },
  body: {
    gap: Gap.gap_10,
    paddingTop: 2,
  },
  bodyWrap: {
    overflow: 'hidden',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailLeft: {
    width: 56,
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_12,
    color: Color.text,
  },
  detailRight: {
    flex: 1,
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_12,
    color: Color.gray,
  },
  statusWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_12,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Gap.gap_8,
    paddingTop: 2,
  },
  badge: {
    borderRadius: Border.br_5,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  badgeText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_12,
    color: Color.bg,
  },
  footer: {
    gap: Gap.gap_8,
  },
  progressTrack: {
    height: 6,
    borderRadius: Border.br_10,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  progressFill: {
    height: '100%',
    borderRadius: Border.br_10,
  },
  progressRemaining: {
    flex: 1,
    height: '100%',
  },
  progressLabel: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 4,
  },
  progressText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_12,
  },
});

export default LessonSectionAccordion;
