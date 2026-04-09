import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AnimatePresence, MotiView } from 'moti';
import { useRouter } from 'expo-router';
import { CaretDownIcon, CaretUpIcon, SpeakerHighIcon } from 'phosphor-react-native';

import { Border, Color, FontFamily, FontSize, Gap, Padding } from '../../constants/GlobalStyles';
import { closeLessonBottomSheet } from './lessonBottomSheetBus';
import HangulTracingGlyph from './HangulTracingGlyph';
import { getHangulWritingIndex } from './hangulWritingSequence';

type HangulCharacterAccordionProps = {
  label: string;
  glyph: string;
  example: string;
  initiallyExpanded?: boolean;
};

const HangulCharacterAccordion = ({
  label,
  glyph,
  example,
  initiallyExpanded = false,
}: HangulCharacterAccordionProps) => {
  const [expanded, setExpanded] = React.useState(initiallyExpanded);
  const router = useRouter();

  const handleOpenWritingScreen = React.useCallback(() => {
    closeLessonBottomSheet();
    router.push({
      pathname: '/lessons/[lessonId]/writing/practiceHangul',
      params: {
        lessonId: '0',
        glyph,
        label,
        sequenceIndex: String(getHangulWritingIndex(glyph, label)),
      },
    });
  }, [glyph, label, router]);

  return (
    <MotiView
      from={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 260 }}
      style={[styles.card, expanded && styles.cardExpanded]}
    >
      <View style={styles.cardContent}>
        <View style={styles.headerRow}>
          <Pressable onPress={handleOpenWritingScreen} style={styles.headerMain}>
            <Text style={styles.label}>{label}</Text>
          </Pressable>

          <View style={styles.headerActions}>
            <Pressable style={styles.iconButton} hitSlop={8} onPress={handleOpenWritingScreen}>
              <SpeakerHighIcon size={20} color={Color.text} weight="regular" />
            </Pressable>

            <Pressable style={styles.iconButton} onPress={() => setExpanded((value) => !value)} hitSlop={8}>
              {expanded ? (
                <CaretUpIcon size={18} color={Color.gray} weight="bold" />
              ) : (
                <CaretDownIcon size={18} color={Color.gray} weight="bold" />
              )}
            </Pressable>
          </View>
        </View>
      </View>

      <AnimatePresence>
        {expanded ? (
          <MotiView
            key="hangul-body"
            from={{ opacity: 0, height: 0, translateY: -8 }}
            animate={{ opacity: 1, height: 'auto', translateY: 0 }}
            exit={{ opacity: 0, height: 0, translateY: -8 }}
            transition={{ type: 'timing', duration: 260 }}
            style={styles.bodyWrap}
          >
            <Pressable onPress={handleOpenWritingScreen} style={styles.body}>
              <HangulTracingGlyph glyph={glyph} />
              <Text style={styles.example}>{example}</Text>
            </Pressable>
          </MotiView>
        ) : null}
      </AnimatePresence>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: Border.br_15,
    borderWidth: 1,
    borderColor: '#D6DFEA',
    backgroundColor: Color.bg,
    paddingHorizontal: Padding.padding_15,
    paddingVertical: 14,
    gap: Gap.gap_10,
  },
  cardExpanded: {
    paddingBottom: 18,
  },
  cardContent: {
    gap: Gap.gap_10,
  },
  headerMain: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Gap.gap_10,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  iconButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    flex: 1,
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_20,
    color: '#63B900',
  },
  bodyWrap: {
    overflow: 'hidden',
  },
  body: {
    alignItems: 'center',
    gap: Gap.gap_15,
    paddingTop: 4,
  },
  example: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_14,
    color: Color.text,
    textAlign: 'center',
  },
});

export default HangulCharacterAccordion;