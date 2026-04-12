import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PauseIcon, PlayIcon, SpeakerHighIcon, XIcon } from 'phosphor-react-native';

import { Border, Color, FontFamily, FontSize, Gap } from '../../../constants/GlobalStyles';

type SpeedOption = {
  label: string;
  value: number;
};

type ListeningPromptCardProps = {
  lessonLabel?: string;
  instruction: string;
  currentTimeLabel: string;
  durationLabel: string;
  progress: number;
  isPlaying?: boolean;
  speedOptions: SpeedOption[];
  selectedSpeed: number;
  onPlayPress: () => void;
  onSpeedSelect: (value: number) => void;
  showTranscript?: boolean;
  transcript?: string;
  transcriptButtonLabel?: string;
  shadowingButtonLabel?: string;
  showTranscriptButton?: boolean;
  showShadowingButton?: boolean;
  onToggleTranscript: () => void;
  onPressShadowing?: () => void;
  onClose?: () => void;
  footer?: React.ReactNode;
};

export default function ListeningPromptCard({
  lessonLabel,
  instruction,
  currentTimeLabel,
  durationLabel,
  progress,
  speedOptions,
  selectedSpeed,
  onPlayPress,
  onSpeedSelect,
  showTranscript = false,
  transcript,
  transcriptButtonLabel = 'Hiển thị transcript',
  shadowingButtonLabel = 'Luyện shadowing với bài này',
  showTranscriptButton = true,
  showShadowingButton = true,
  onToggleTranscript,
  onPressShadowing,
  onClose,
  isPlaying = false,
  footer,
}: ListeningPromptCardProps) {
  return (
    <LinearGradient colors={['#C8FF84', '#E9FFD1', '#FFFFFF']} style={styles.container}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentInner}
        showsVerticalScrollIndicator={false}
      >
      <View style={styles.headerRow}>
        <View style={styles.headerTextWrap}>
          {lessonLabel ? <Text style={styles.lessonLabel}>{lessonLabel}</Text> : null}
          <Text style={styles.instruction}>{instruction}</Text>
        </View>

        <View style={styles.headerActions}>
          <Pressable style={styles.iconButton}>
            <SpeakerHighIcon size={16} color="#FFFFFF" weight="bold" />
          </Pressable>
          {onClose ? (
            <Pressable style={styles.iconButton} onPress={onClose}>
              <XIcon size={16} color="#FFFFFF" weight="bold" />
            </Pressable>
          ) : null}
        </View>
      </View>

      <View style={styles.playerCard}>
        <Pressable style={styles.playButton} onPress={onPlayPress}>
          {isPlaying ? (
            <PauseIcon size={20} color="#275C34" weight="fill" />
          ) : (
            <PlayIcon size={20} color="#275C34" weight="fill" />
          )}
        </Pressable>

        <View style={styles.timeRow}>
          <Text style={styles.timeText}>{currentTimeLabel}</Text>
          <Text style={styles.timeText}>{durationLabel}</Text>
        </View>

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${Math.max(0, Math.min(progress, 1)) * 100}%` }]} />
        </View>

        <View style={styles.speedRow}>
          {speedOptions.map((option) => {
            const active = option.value === selectedSpeed;
            return (
              <Pressable
                key={`${option.value}`}
                style={[styles.speedChip, active ? styles.speedChipActive : null]}
                onPress={() => onSpeedSelect(option.value)}
              >
                <Text style={[styles.speedChipText, active ? styles.speedChipTextActive : null]}>{option.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {showTranscriptButton ? (
        <Pressable style={styles.secondaryButton} onPress={onToggleTranscript}>
          <Text style={styles.secondaryButtonText}>{transcriptButtonLabel}</Text>
        </Pressable>
      ) : null}

      {showShadowingButton ? (
        <Pressable style={styles.secondaryButton} onPress={onPressShadowing}>
          <Text style={styles.secondaryButtonText}>{shadowingButtonLabel}</Text>
        </Pressable>
      ) : null}

      {showTranscript && transcript ? (
        <View style={styles.transcriptWrap}>
          <Text style={styles.transcriptText}>{transcript}</Text>
        </View>
      ) : null}
      </ScrollView>

      {footer ? <View style={styles.footerSlot}>{footer}</View> : null}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 14,
    overflow: 'hidden',
    gap: 12,
  },
  content: {
    flex: 1,
  },
  contentInner: {
    gap: 12,
    paddingBottom: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  headerTextWrap: {
    flex: 1,
  },
  lessonLabel: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_12,
    color: '#4B8E37',
    marginBottom: 2,
  },
  instruction: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_16,
    color: '#69789E',
    lineHeight: 22,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#185935',
  },
  playerCard: {
    borderRadius: Border.br_30,
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
    shadowColor: '#B9E77F',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 5,
  },
  playButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#9AF07A',
    marginBottom: 14,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  timeText: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_12,
    color: '#101010',
  },
  progressTrack: {
    height: 5,
    borderRadius: 999,
    backgroundColor: '#71809B',
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#8DEA80',
  },
  speedRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  speedChip: {
    minWidth: 42,
    borderRadius: 999,
    backgroundColor: '#DCE4F1',
    paddingHorizontal: 9,
    paddingVertical: 6,
    alignItems: 'center',
  },
  speedChipActive: {
    backgroundColor: '#101010',
  },
  speedChipText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: 10,
    color: '#72809B',
  },
  speedChipTextActive: {
    color: '#FFFFFF',
  },
  secondaryButton: {
    minHeight: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CCD5E4',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  secondaryButtonText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_12,
    color: '#71A84E',
  },
  transcriptWrap: {
    borderRadius: 16,
    backgroundColor: '#F7FAFF',
    padding: 14,
  },
  transcriptText: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_14,
    lineHeight: 22,
    color: Color.text,
  },
  footerSlot: {
    marginTop: 'auto',
  },
});
