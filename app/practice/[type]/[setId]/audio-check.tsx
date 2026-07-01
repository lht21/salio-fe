import { Image } from "expo-image";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import Button from "../../../../components/Button";
import IconButton from "../../../../components/IconButton";
import { XIcon } from "phosphor-react-native";
import { FontFamily, FontSize, Padding, Gap } from "../../../../constants/GlobalStyles";
import { useTheme } from "@/contexts/ThemeContext";

export default function AudioCheckScreen() {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const router = useRouter();
  const { type, setId, attemptId, zenmode } = useLocalSearchParams();

  const soundRef = useRef<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const ring1 = useSharedValue(0);
  const ring2 = useSharedValue(0);

  // Hàm phát lại âm thanh
  const playTestSound = async () => {
    if (!soundRef.current || isPlaying) return;
    try {
      setIsPlaying(true);
      // Đặt lại vị trí về đầu (0ms) để có thể nghe lại nhiều lần
      await soundRef.current.setPositionAsync(0);
      await soundRef.current.playAsync();
    } catch (error) {
      console.log("Lỗi phát âm thanh test:", error);
      setIsPlaying(false);
      setProgress(0);
    }
  };

  // Hàm xử lý khi xác nhận nghe rõ -> Đi vào phòng thi
  const handleStartExam = async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync().catch(() => { });
      await soundRef.current.unloadAsync().catch(() => { });
      soundRef.current = null;
      setIsPlaying(false);
      setProgress(0);
    }

    const queryParam = zenmode === 'true' ? '?zenmode=true' : '';
    router.replace(`/practice/${type}/${setId}/${attemptId}/exam${queryParam}` as any);
  };

  useEffect(() => {
    let isMounted = true;

    const initAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          interruptionModeIOS: InterruptionModeIOS.DoNotMix,
          interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false
        });

        // Sửa đường dẫn bị dư 1 cấp: từ 5 cấp (../../../../..) thành 4 cấp (../../../..)
        const { sound } = await Audio.Sound.createAsync(
          require("../../../../assets/audio/audio-check.mp3")
        );

        if (isMounted) {
          soundRef.current = sound;
          sound.setOnPlaybackStatusUpdate((status) => {
            if (!isMounted) return; // Đảm bảo không cập nhật state nếu component đã unmount

            if (status.isLoaded && status.didJustFinish) {
              setIsPlaying(false);
              setProgress(0);
            } else if (status.isLoaded && status.durationMillis) {
              // Tính toán tiến trình (0.0 -> 1.0)
              const newProgress = status.positionMillis / status.durationMillis;
              setProgress(newProgress);
            }
          });

          // Tự động phát khi màn hình vừa tải xong âm thanh
          playTestSound();
        }
      } catch (error) {
        console.log("Lỗi khởi tạo Audio:", error);
      }
    };

    initAudio();

    return () => {
      isMounted = false;
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => { });
        soundRef.current = null;
      }
    };
  }, []);

  // Xử lý logic Animation Ripple/Pulse (sóng âm)
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (isPlaying) {
      ring1.value = 0;
      ring2.value = 0;
      ring1.value = withRepeat(
        withTiming(1, { duration: 2000, easing: Easing.out(Easing.ease) }),
        -1,
        false
      );
      timeout = setTimeout(() => {
        ring2.value = withRepeat(
          withTiming(1, { duration: 2000, easing: Easing.out(Easing.ease) }),
          -1,
          false
        );
      }, 1000);
    } else {
      ring1.value = 0;
      ring2.value = 0;
    }
    return () => clearTimeout(timeout);
  }, [isPlaying]);

  const animatedRingStyle1 = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + ring1.value * 1.5 }],
    opacity: 1 - ring1.value,
  }));

  const animatedRingStyle2 = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + ring2.value * 1.5 }],
    opacity: 1 - ring2.value,
  }));

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header với nút Back */}
      <View style={styles.header}>
        <IconButton Icon={XIcon} onPress={() => router.back()} />

      </View>

      {/* Body: Hiệu ứng âm thanh ở giữa */}
      <View style={styles.body}>
        <View style={styles.mascotContainer}>
          {isPlaying && (
            <>
              <Animated.View style={[styles.ripple, animatedRingStyle1]} />
              <Animated.View style={[styles.ripple, animatedRingStyle2]} />
            </>
          )}
          <View style={styles.mascotCircle}>
            <Image
              source={require("../../../../assets/images/horani/horani_skill1.png")}
              style={styles.mascotImage}
              contentFit="contain"
            />
          </View>
        </View>

        {/* Thanh tiến trình phát âm thanh */}
        <View style={styles.progressContainer}>
          {isPlaying && (
            <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
          )}
        </View>
      </View>

      {/* Footer: Thông báo và Nút bấm */}
      <View style={styles.footer}>
        <View style={styles.textContainer}>
          <Text style={styles.titleText}>Kiểm tra âm thanh</Text>
          <Text style={styles.subtitleText}>Bạn có nghe rõ đoạn âm thanh mẫu đang phát không?</Text>
        </View>

        <Button
          title="Tôi nghe rõ, làm bài thôi!"
          variant="Green"
          onPress={handleStartExam}
        />

        <Button
          title={isPlaying ? "Đang phát âm thanh..." : "Nghe lại"}
          variant="Outline"
          onPress={playTestSound}
          disabled={isPlaying}
        />
      </View>
    </SafeAreaView>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  header: { alignItems: "flex-end", paddingHorizontal: Padding.padding_15, paddingTop: Padding.padding_10 },
  body: { flex: 1, justifyContent: "center", alignItems: "center" },
  mascotContainer: { alignItems: "center", justifyContent: "center", width: 250, height: 250 },
  mascotCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: colors.primary || "#98F291",
    zIndex: 2,
    shadowColor: colors.primary || "#98F291",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  mascotImage: { width: 110, height: 110 },
  ripple: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.primary || "#98F291",
    zIndex: 1,
  },
  footer: { paddingHorizontal: Padding.padding_15, paddingBottom: 40, gap: Gap.gap_15 },
  textContainer: { alignItems: "center", marginBottom: Gap.gap_15 },
  titleText: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_20,
    color: colors.textPrimary,
    marginBottom: Gap.gap_8,
  },
  subtitleText: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_14,
    color: colors.textSecondary,
    textAlign: "center",
    paddingHorizontal: Padding.padding_20,
    lineHeight: 22,
  },
  progressContainer: {
    width: '50%',
    height: 6,
    backgroundColor: colors.borderDefault,
    borderRadius: 3,
    marginTop: 40,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
  },
});