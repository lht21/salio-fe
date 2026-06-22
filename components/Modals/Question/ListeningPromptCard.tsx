import React from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { XIcon } from 'phosphor-react-native';
import { Color, FontFamily, FontSize } from '../../../constants/GlobalStyles';
import AudioPlayerControls from '../../Listening/AudioPlayerControls';

type ListeningPromptCardProps = {
  lessonLabel?: string;
  instruction: string;
  currentTimeLabel: string;
  durationLabel: string;
  progress: number;
  isPlaying: boolean;
  speedOptions: { label: string; value: number }[];
  selectedSpeed: number;
  onPlayPress: () => void;
  onSpeedSelect: (speed: number) => void;
  showTranscript: boolean;
  onToggleTranscript: () => void;
  onClose?: () => void;
  footer?: React.ReactNode;
};

export default function ListeningPromptCard({
  lessonLabel,
  instruction,
  currentTimeLabel,
  durationLabel,
  progress,
  isPlaying,
  speedOptions,
  selectedSpeed,
  onPlayPress,
  onSpeedSelect,
  onClose,
  footer,
}: ListeningPromptCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          {lessonLabel ? <Text style={styles.lessonLabel}>{lessonLabel}</Text> : null}
          <Text style={styles.instruction}>{instruction}</Text>
        </View>
        {onClose ? (
          <Pressable style={styles.closeButton} onPress={onClose}>
            <XIcon size={22} color="#B9A9C8" weight="regular" />
          </Pressable>
        ) : null}
      </View>

      <View style={styles.audioControlsWrapper}>
        <AudioPlayerControls
          currentTimeLabel={currentTimeLabel}
          durationLabel={durationLabel}
          progress={progress}
          isPlaying={isPlaying}
          speedOptions={speedOptions}
          selectedSpeed={selectedSpeed}
          onPlayPress={onPlayPress}
          onSpeedSelect={onSpeedSelect}
          onRewind={() => {}}
          onForward={() => {}}
          onSeek={() => {}}
        />
      </View>

      <View style={{ flex: 1 }}>
         {/* Giữ khoảng trống đẩy footer xuống cuối */}
      </View>

      {footer}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  headerText: {
    flex: 1,
  },
  lessonLabel: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_12,
    color: '#4E9E38',
    marginBottom: 2,
  },
  instruction: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_16,
    lineHeight: 22,
    color: '#5A6891',
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  audioControlsWrapper: {
    marginTop: 20,
    marginBottom: 20,
  }
});
