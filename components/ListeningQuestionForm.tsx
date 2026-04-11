import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Play, Pause } from 'phosphor-react-native';

import { Color, FontFamily } from '../constants/GlobalStyles';

export interface ListeningOption {
  id: string;
  label: string;
  text: string;
}

export interface ListeningQuestion {
  id: number;
  audioDuration: string;
  question: string;
  options: ListeningOption[];
}

interface ListeningQuestionFormProps {
  question: ListeningQuestion;
  selectedOptionId: string | null;
  onSelectOption: (id: string) => void;
  showResultSheet: boolean;
}

export default function ListeningQuestionForm({
  question,
  selectedOptionId,
  onSelectOption,
  showResultSheet,
}: ListeningQuestionFormProps) {
  // Audio Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState("x1.0");
  const [progress, setAudioProgress] = useState(0.2); // Simulated progress

  // Reset audio state when question changes
  useEffect(() => {
    setIsPlaying(false);
    setAudioProgress(0.1);
  }, [question.id]);

  // Stop playing when user answers
  useEffect(() => {
    if (showResultSheet) {
      setIsPlaying(false);
    }
  }, [showResultSheet]);

  return (
    <View style={styles.container}>
      {/* Audio Player Card */}
      <View style={styles.audioCard}>
        <TouchableOpacity
          style={styles.playButton}
          onPress={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? (
            <Pause size={32} color="#FFFFFF" weight="fill" />
          ) : (
            <Play size={32} color="#FFFFFF" weight="fill" />
          )}
        </TouchableOpacity>

        <View style={styles.timerRow}>
          <Text style={styles.timeText}>00:00</Text>
          <Text style={styles.timeText}>{question.audioDuration}</Text>
        </View>

        {/* Audio Progress Bar */}
        <View style={styles.audioProgressBg}>
          <View
            style={[
              styles.audioProgressFill,
              { width: `${progress * 100}%` }
            ]}
          >
            <View style={styles.progressDot} />
          </View>
        </View>

        {/* Speed Controls */}
        <View style={styles.speedRow}>
          {["x0.75", "x1.0", "x1.25"].map((speed) => (
            <TouchableOpacity
              key={speed}
              style={[
                styles.speedBtn,
                playbackSpeed === speed && styles.speedBtnActive
              ]}
              onPress={() => setPlaybackSpeed(speed)}
            >
              <Text
                style={[
                  styles.speedText,
                  playbackSpeed === speed && styles.speedTextActive
                ]}
              >
                {speed}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Question Text */}
      <Text style={styles.questionText}>{question.question}</Text>

      {/* Options List */}
      <View style={styles.optionsContainer}>
        {question.options.map((option) => {
          const isSelected = selectedOptionId === option.id;

          return (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionButton,
                isSelected && styles.optionButtonSelected,
              ]}
              onPress={() => onSelectOption(option.id)}
              disabled={showResultSheet}
            >
              <Text style={styles.optionLabel}>{option.label}</Text>
              <Text style={styles.optionText}>{option.text}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  audioCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    padding: 25,
    alignItems: "center",
    marginBottom: 40,
    // Shadow for elevation
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: "#F0F0F0"
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#98F291",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20
  },
  timerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 8
  },
  timeText: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: 12,
    color: "#1E1E1E"
  },
  audioProgressBg: {
    height: 4,
    backgroundColor: "#64748B40",
    width: "100%",
    borderRadius: 2,
    marginBottom: 20
  },
  audioProgressFill: {
    height: "100%",
    backgroundColor: "#64748B",
    borderRadius: 2,
    position: "relative"
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#98F291",
    position: "absolute",
    right: -5,
    top: -3
  },
  speedRow: {
    flexDirection: "row",
    gap: 15
  },
  speedBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: "#E6E9F0"
  },
  speedBtnActive: {
    backgroundColor: "#000000"
  },
  speedText: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: 12,
    color: "#64748B"
  },
  speedTextActive: {
    color: "#98F291"
  },
  questionText: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: 24,
    color: "#1E1E1E",
    marginBottom: 40
  },
  optionsContainer: {
    gap: 15
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#E6E9F0",
    borderRadius: 25,
    paddingVertical: 18,
    paddingHorizontal: 25,
    gap: 15
  },
  optionButtonSelected: {
    borderColor: "#98F291",
    backgroundColor: "#F0FFF0"
  },
  optionLabel: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: 16,
    color: "#1E1E1E"
  },
  optionText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: 16,
    color: "#1E1E1E"
  }
});
