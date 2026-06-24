import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AnimatePresence, MotiView } from 'moti';
import { CaretDownIcon, CaretUpIcon, CheckCircleIcon } from 'phosphor-react-native';

import { Border, Color, FontFamily, FontSize, Gap, Padding, Stroke } from '../../constants/GlobalStyles';
import Button from '../Button';

export type LessonSectionDetailItem = {
  id: string;
  left: string;
  right: string;
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
  onPress?: () => void;
  onActionPress?: () => void;
  actionText?: string;
};

const LessonSectionAccordion = ({
  delay = 0,
  icon,
  title,
  subtitle,
  progressText,
  progressValue,
  progressColor,
  progressTrackColor = Color.brown50,
  backgroundColor = Color.bg,
  expandable = false,
  initiallyExpanded = false,
  details = [],
  onPress,
  onActionPress,
  actionText,
}: LessonSectionAccordionProps) => {
  const [expanded, setExpanded] = React.useState(initiallyExpanded);
  const canExpand = expandable && details.length > 0;

  return (
    <MotiView
      from={{ opacity: 0, translateY: 12 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 350, delay } as any}
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
            transition={{ type: 'timing', duration: 280 } as any}
            style={styles.bodyWrap}
          >
            <Pressable style={styles.body} onPress={onPress} disabled={!onPress}>
              {details.map((item, index) => {
                return (
                  <MotiView
                    key={item.id}
                    from={{ opacity: 0, translateY: 6 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'timing', duration: 220, delay: index * 45 } as any}
                    style={styles.detailRow}
                  >
                    <Text style={styles.detailLeft}>{item.left}</Text>
                    <Text style={styles.detailRight}>{item.right}</Text>
                  </MotiView>
                );
              })}
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

        <View style={styles.progressFooterRow}>
          <View style={styles.progressLabel}>
            <CheckCircleIcon size={15} color={progressColor} weight="fill" />
            <Text style={[styles.progressText, { color: progressColor }]}>{progressText}</Text>
          </View>
          {onActionPress && (
            <Button
              title={actionText}
              onPress={onActionPress}
              variant='Outline'
            />
          )}
        </View>
      </Pressable>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: Border.br_30,
    borderWidth: Stroke.stroke,
    borderColor: Color.stroke,
    padding: 16,
    gap: Gap.gap_10,
    borderBottomWidth: 5
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
    backgroundColor: Color.main50,
    borderRadius: Border.br_20,
    padding: Padding.padding_20,
    gap: Gap.gap_10,
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
  progressFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  progressLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  progressText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_12,
  },
  actionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: Border.br_10,
    backgroundColor: '#F3F4F6',
  },
  actionBtnText: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_12,
  },
});

export default LessonSectionAccordion;
