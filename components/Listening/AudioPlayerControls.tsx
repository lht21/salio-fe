import React, { useRef, useState } from 'react';
import { PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';
import { FastForwardIcon, PauseIcon, PlayIcon, RewindIcon } from 'phosphor-react-native';
import { Border, FontFamily, FontSize, Padding } from '../../constants/GlobalStyles';
import { useTheme } from "@/contexts/ThemeContext";

type SpeedOption = { label: string; value: number; };

type AudioPlayerControlsProps = {
  currentTimeLabel: string;
  durationLabel: string;
  progress: number;
  isPlaying?: boolean;
  speedOptions: SpeedOption[];
  selectedSpeed: number;
  onPlayPress: () => void;
  onSpeedSelect: (value: number) => void;
  onRewind?: () => void;
  onForward?: () => void;
  onSeek?: (progress: number) => void;
};

export default function AudioPlayerControls({
  currentTimeLabel,
  durationLabel,
  progress,
  isPlaying = false,
  speedOptions,
  selectedSpeed,
  onPlayPress,
  onSpeedSelect,
  onRewind,
  onForward,
  onSeek,
}: AudioPlayerControlsProps) {
    const { colors } = useTheme();
    const styles = getStyles(colors);

  const trackRef = useRef<View>(null);
  const [trackWidth, setTrackWidth] = useState(0);
  const [trackPageX, setTrackPageX] = useState(0);

  const handleSeek = (xPosition: number) => {
    if (onSeek && trackWidth > 0) {
      const newProgress = xPosition / trackWidth;
      onSeek(Math.max(0, Math.min(newProgress, 1)));
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !!onSeek,
      onPanResponderGrant: (evt) => {
        handleSeek(evt.nativeEvent.locationX);
      },
      onPanResponderMove: (evt, gestureState) => {
        const newX = gestureState.moveX - trackPageX;
        handleSeek(newX);
      },
    })
  ).current;

  const onTrackLayout = () => {
    trackRef.current?.measure((x, y, width, height, pageX, pageY) => {
      setTrackWidth(width);
      setTrackPageX(pageX);
    });
  };

  return (
    <View style={styles.playerCard}>
      <View style={styles.controlsRow}>
        {onRewind ? (
          <Pressable onPress={onRewind} style={styles.controlButton}>
            <RewindIcon size={28} color="#275C34" weight="fill" />
          </Pressable>
        ) : null}
        <Pressable style={styles.playButton} onPress={onPlayPress}>
          {isPlaying ? (
            <PauseIcon size={20} color="#275C34" weight="fill" />
          ) : (
            <PlayIcon size={20} color="#275C34" weight="fill" />
          )}
        </Pressable>
        {onForward ? (
          <Pressable onPress={onForward} style={styles.controlButton}>
            <FastForwardIcon size={28} color="#275C34" weight="fill" />
          </Pressable>
        ) : null}
      </View>
      <View style={styles.timeRow}>
        <Text style={styles.timeText}>{currentTimeLabel}</Text>
        <Text style={styles.timeText}>{durationLabel}</Text>
      </View>

      <View
        ref={trackRef}
        style={styles.progressTrack}
        onLayout={onTrackLayout}
        {...panResponder.panHandlers}
      >
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
  );
}

const getStyles = (colors: any) => StyleSheet.create({
      playerCard: {
        borderRadius: Border.br_30,
        padding: Padding.padding_30,
        backgroundColor: '#FFFFFF',
        shadowColor: '#B9E77F',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.35,
        shadowRadius: 20,
        elevation: 5,
      },
      controlsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
        marginBottom: 14,
      },
      controlButton: {
        padding: 8,
      },
      playButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.main,
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
    });
