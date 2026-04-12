import { Audio, AVPlaybackStatus } from "expo-av";
import { Pause, Play } from "phosphor-react-native";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Color, FontFamily } from "../constants/GlobalStyles";

// Giữ nguyên các Interface cũ của bạn
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
  audioUrl?: string;
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
  showResultSheet
}: ListeningQuestionFormProps) {
  // --- Giữ nguyên State cũ ---
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  // --- Logic chống lag và dọn dẹp bộ nhớ ---
  const soundRef = useRef<Audio.Sound | null>(null);
  const isMounted = useRef(true);

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded && isMounted.current) {
      setPosition(status.positionMillis);
      setDuration(status.durationMillis || 0);
      setIsPlaying(status.isPlaying);

      if (status.didJustFinish) {
        setIsPlaying(false);
        soundRef.current?.setPositionAsync(0).catch(() => {});
      }
    }
  };

  async function loadSound() {
    try {
      // Dọn dẹp triệt để trước khi load mới
      if (soundRef.current) {
        await soundRef.current.unloadAsync().catch(() => {});
        soundRef.current = null;
      }

      if (!question.audioUrl) return;

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: question.audioUrl },
        {
          shouldPlay: false,
          rate: playbackSpeed,
          shouldCorrectPitch: true,
          progressUpdateIntervalMillis: 100 // Giới hạn tần suất để UI mượt hơn
        },
        onPlaybackStatusUpdate
      );

      if (isMounted.current) {
        setSound(newSound);
        soundRef.current = newSound;
      } else {
        await newSound.unloadAsync().catch(() => {});
      }
    } catch (error) {
      console.log("Error loading sound", error);
    }
  }

  useEffect(() => {
    isMounted.current = true;
    loadSound();

    return () => {
      isMounted.current = false;
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => {});
      }
    };
  }, [question.id]); // Chỉ load lại khi ID câu hỏi thay đổi thực sự

  useEffect(() => {
    if (showResultSheet && soundRef.current) {
      soundRef.current.pauseAsync().catch(() => {});
    }
  }, [showResultSheet]);

  const handlePlayPause = async () => {
    if (!soundRef.current) return;
    if (isPlaying) {
      await soundRef.current.pauseAsync();
    } else {
      await soundRef.current.playAsync();
    }
  };

  const handleChangeSpeed = async (speed: number) => {
    setPlaybackSpeed(speed);
    if (soundRef.current) {
      await soundRef.current.setRateAsync(speed, true).catch(() => {});
    }
  };

  const formatTime = (millis: number) => {
    const totalSeconds = millis / 1000;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const progress = duration > 0 ? position / duration : 0;

  return (
    <View style={styles.container}>
      <View style={styles.audioCard}>
        <TouchableOpacity style={styles.playButton} onPress={handlePlayPause}>
          {isPlaying ? (
            <Pause size={32} color="#FFFFFF" weight="fill" />
          ) : (
            <Play size={32} color="#FFFFFF" weight="fill" />
          )}
        </TouchableOpacity>

        <View style={styles.timerRow}>
          <Text style={styles.timeText}>{formatTime(position)}</Text>
          <Text style={styles.timeText}>
            {duration > 0 ? formatTime(duration) : question.audioDuration}
          </Text>
        </View>

        <View style={styles.audioProgressBg}>
          <View
            style={[styles.audioProgressFill, { width: `${progress * 100}%` }]}
          >
            <View style={styles.progressDot} />
          </View>
        </View>

        <View style={styles.speedRow}>
          {[0.75, 1.0, 1.25].map((speed) => (
            <TouchableOpacity
              key={speed}
              style={[
                styles.speedBtn,
                playbackSpeed === speed && styles.speedBtnActive
              ]}
              onPress={() => handleChangeSpeed(speed)}
            >
              <Text
                style={[
                  styles.speedText,
                  playbackSpeed === speed && styles.speedTextActive
                ]}
              >
                x{speed.toFixed(2).replace(/\.00$/, ".0").replace(/0$/, "")}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Text style={styles.questionText}>{question.question}</Text>

      <View style={styles.optionsContainer}>
        {question.options.map((option) => {
          const isSelected = selectedOptionId === option.id;
          return (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionButton,
                isSelected && styles.optionButtonSelected
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

// --- Giữ nguyên toàn bộ Style cũ của bạn ---
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  audioCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    padding: 25,
    alignItems: "center",
    marginBottom: 40,
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
    color: Color.text || "#1E1E1E"
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
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: 9,
    color: Color.gray || "#64748B"
  },
  speedTextActive: {
    color: "#98F291"
  },
  questionText: {
    fontFamily: FontFamily.lexendDecaRegular,
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
    backgroundColor: Color.bg || "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#E6E9F0",
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 20,
    gap: 11
  },
  optionButtonSelected: {
    borderColor: Color.main2 || "#98F291",
    backgroundColor: Color.mainLighter || "#F0FFF0"
  },
  optionLabel: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: 16,
    color: Color.text || "#1E1E1E"
  },
  optionText: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: 16,
    color: Color.text || "#1E1E1E"
  }
});
