import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { SpeakerHigh, Warning } from "phosphor-react-native";
import { useEffect, useRef, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { Audio } from "expo-av";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import Button from "@/components/Button";
import CloseButton from "@/components/CloseButton";
import { Color, FontFamily, FontSize } from "../../constants/GlobalStyles";

const { width } = Dimensions.get("window");

export default function AudioCheckScreen() {
  const router = useRouter();
  const soundRef = useRef<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const shakeAnim = useSharedValue(0);

  // Hàm phát âm thanh test
  const playTestSound = async () => {
    if (isPlaying) return;
    try {
      setIsPlaying(true);
      // Dọn dẹp âm thanh cũ nếu có
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }

      // Phát âm thanh mẫu (URL giả lập, bạn có thể thay bằng link thực tế hoặc file local require('...'))
      const { sound } = await Audio.Sound.createAsync(
        { uri: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
        { shouldPlay: true }
      );
      soundRef.current = sound;

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setIsPlaying(false);
        }
      });
    } catch (error) {
      console.log("Lỗi phát âm thanh test:", error);
      setIsPlaying(false);
    }
  };

  // Hàm xử lý khi nhấn nút bắt đầu kiểm tra
  const handleStartExam = async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync(); // Dừng âm thanh ngay lập tức
      setIsPlaying(false); // Dừng animation
    }
    router.push("/placement-test/exam"); // Chuyển trang
  };

  useEffect(() => {
    playTestSound(); // Tự động phát khi người dùng vừa vào màn hình
    return () => {
      if (soundRef.current) soundRef.current.unloadAsync(); // Dọn dẹp bộ nhớ khi thoát
    };
  }, []);

  // Xử lý logic Animation rung lắc
  useEffect(() => {
    if (isPlaying) {
      shakeAnim.value = withRepeat(
        withSequence(
          withTiming(-4, { duration: 60, easing: Easing.linear }),
          withTiming(4, { duration: 60, easing: Easing.linear })
        ),
        -1, // Lặp vô hạn
        true // Tự đảo chiều
      );
    } else {
      shakeAnim.value = withTiming(0, { duration: 100 });
    }
  }, [isPlaying]);

  const animatedLeftStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${-10 + shakeAnim.value}deg` }],
  }));

  const animatedRightStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${10 + shakeAnim.value}deg` }],
  }));

  return (
    <LinearGradient
      colors={["#CEF9B4", Color.main || "#98F291"]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header với nút Back */}
        <View style={styles.header}>
          <CloseButton onPress={() => router.back()} style={styles.backButton} />
        </View>

        {/* Bọc toàn bộ nội dung trong ScrollView */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* Top Cards Section */}
            <View style={styles.cardsRow}>
              <Animated.View style={[styles.sideCard, animatedLeftStyle]}>
                <SpeakerHigh
                  size={40}
                  color={isPlaying ? (Color.cam || "#FF6B00") : (Color.text || "#1E1E1E")}
                  weight="fill"
                />
              </Animated.View>

              <View style={styles.middleCard}>
                <Image
                  source={require("../../assets/images/horani/sc1_b2.png")}
                  style={styles.mascotImage}
                  contentFit="contain"
                />
              </View>

              <Animated.View style={[styles.sideCard, animatedRightStyle]}>
                <SpeakerHigh
                  size={40}
                  color={isPlaying ? (Color.cam || "#FF6B00") : (Color.text || "#1E1E1E")}
                  weight="fill"
                />
              </Animated.View>
            </View>

            {/* Alert Banner */}
            <View style={styles.alertBanner}>
              <Warning size={40} color={Color.cam || "#FF6B00"} weight="fill" />
              <View style={styles.alertTextWrapper}>
                <Text style={styles.alertTitle}>Cảnh báo</Text>
                <Text style={styles.alertSubtitle}>Kẻ địch đang đến gần!</Text>
              </View>
            </View>

            {/* Spacer để đẩy các nút xuống dưới trên màn hình lớn */}
            <View style={{ height: 40 }} />

            {/* Question Text */}
            <Text style={styles.questionText}>
              Bạn có nghe rõ tiếng gầm của quái vật không?
            </Text>

            {/* Buttons Group */}
            <View style={styles.buttonGroup}>
              <Button
                title="Tôi nghe rõ, Chiến thôi!"
                variant="Green"
                onPress={handleStartExam}
                style={styles.primaryButton}
                textStyle={styles.primaryButtonText}
              />

              <Button
                title={isPlaying ? "Đang phát âm thanh..." : "Nghe lại"}
                variant="Outline"
                onPress={playTestSound}
                disabled={isPlaying}
                style={styles.secondaryButton}
                textStyle={styles.secondaryButtonText}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  safeArea: {
    flex: 1
  },
  scrollContent: {
    flexGrow: 1, // Đảm bảo nội dung có thể giãn ra để căn giữa
    justifyContent: "center" // Căn giữa nội dung theo chiều dọc nếu màn hình dài
  },
  content: {
    paddingHorizontal: 25,
    paddingTop: 10, // Giảm paddingTop xuống vì đã có header chiếm chỗ
    paddingBottom: 40,
    alignItems: "center"
  },
  header: {
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 10,
    zIndex: 10
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.6)", // Nền trong suốt mờ ảo
  },
  cardsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    gap: -20,
    marginBottom: 40
  },
  sideCard: {
    width: 90,
    height: 120,
    backgroundColor: "rgba(255, 255, 255, 0.9)", // Nền trong trẻo hòa vào background
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.5)", // Viền mờ đồng bộ
    zIndex: 1
  },
  middleCard: {
    width: 150, // Nới rộng thành hình vuông để bo tròn
    height: 150,
    backgroundColor: "#FFFFFF",
    borderRadius: 75, // Bo góc thành hình tròn hoàn hảo (một nửa 150)
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 5,
    borderColor: "rgba(255, 255, 255, 0.5)", // Viền hào quang
    zIndex: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 5
  },
  mascotImage: {
    width: 120, // Tăng size mascot tương ứng
    height: 120
  },
  alertBanner: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 25, // Bo góc mềm mại hơn
    width: "100%",
    gap: 15,
    // Đổi viền đen cứng thành shadow glow màu cam
    shadowColor: Color.cam || "#FF6B00",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6
  },
  alertTextWrapper: {
    flex: 1
  },
  alertTitle: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: 18,
    color: Color.cam || "#FF6B00"
  },
  alertSubtitle: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: 14,
    color: Color.text || "#1E1E1E"
  },
  questionText: {
    fontFamily: FontFamily.lexendDecaSemiBold, // In đậm câu hỏi
    fontSize: FontSize.fs_18 || 18, // Tăng size để thu hút sự chú ý
    color: Color.text || "#1E1E1E",
    textAlign: "center",
    marginBottom: 35,
    lineHeight: 28
  },
  buttonGroup: {
    width: "100%",
    gap: 12
  },
  primaryButton: {
    backgroundColor: Color.cam || "#FF6B00",
    width: "100%",
    height: 56,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center"
  },
  primaryButtonText: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: 14,
    color: "#FFFFFF"
  },
  secondaryButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: Color.cam || "#FF6B00",
    width: "100%",
    height: 56,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center"
  },
  secondaryButtonText: {
    color: Color.cam || "#FF6B00"
  }
});
