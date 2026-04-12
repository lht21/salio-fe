import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Clock, Headphones, ShootingStar } from "phosphor-react-native";
import { ScrollView, StyleSheet, Text, View } from "react-native"; // Thêm ScrollView
import { SafeAreaView } from "react-native-safe-area-context";

import Button from "../../components/Button";
import { Color, FontFamily, FontSize } from "../../constants/GlobalStyles";

export default function PlacementTestIntro() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={["#CEF9B4", Color.main || "#98F291"]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Bọc toàn bộ nội dung trong ScrollView để không bị tràn trên máy nhỏ */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* Mascot Container */}
            <View style={styles.mascotContainer}>
              <View style={styles.mascotHalo}>
                <Image
                  source={require("../../assets/images/horani/sc1_b2.png")}
                  style={styles.mascotImage}
                  contentFit="contain"
                />
              </View>
            </View>

            {/* Greeting Text */}
            <View style={styles.greetingWrapper}>
              <Text style={styles.greetingText}>
                Xin chào Sứ giả <Text style={styles.highlightText}>Huy</Text>!
                {"\n"}Chào mừng đến vương quốc Salio.
              </Text>
            </View>

            {/* Instruction Section */}
            <View style={styles.instructionRow}>
              <ShootingStar
                size={32}
                color={Color.cam || "#FF6B00"}
                weight="fill"
              />
              <Text style={styles.instructionText}>
                Để nhận vũ khí phù hợp, hãy vượt qua thử thách đầu tiên để kiểm
                tra năng lực nhé!
              </Text>
            </View>

            {/* Info Capsules */}
            <View style={styles.infoContainer}>
              <View style={styles.infoCapsule}>
                <Clock size={20} color={Color.cam || "#FF6B00"} weight="bold" />
                <Text style={styles.infoText}>
                  Thời gian:{" "}
                  <Text style={styles.boldInfoText}>Chỉ 3 phút.</Text>
                </Text>
              </View>

              <View style={styles.infoCapsule}>
                <Headphones
                  size={20}
                  color={Color.cam || "#FF6B00"}
                  weight="bold"
                />
                <Text style={styles.infoText}>
                  Hình thức: <Text style={styles.boldInfoText}>Nghe & Đọc</Text>
                </Text>
              </View>
            </View>

            {/* Buttons Group */}
            <View style={styles.buttonGroup}>
              <Button
                variant="Orange"
                title="Nhận Thử Thách Ngay"
                onPress={() => router.push("/placement-test/audio-check")}
                style={styles.primaryButton}
              />
              <Button
                variant="Outline"
                title="Bỏ qua, tôi mới học từ con số 0"
                onPress={() => router.push("/(tabs)")}
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
    flexGrow: 1, // Giúp nội dung giãn đều và hỗ trợ justifyContent
    justifyContent: "center" // Căn giữa nội dung nếu màn hình còn dư chỗ
  },
  content: {
    paddingHorizontal: 25,
    paddingTop: 20,
    paddingBottom: 30,
    alignItems: "center"
  },
  mascotContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30
  },
  mascotHalo: {
    width: 180,
    height: 180,
    backgroundColor: "#E6F4FF",
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "#FFFFFF",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5
  },
  mascotImage: {
    width: 140,
    height: 140
  },
  greetingWrapper: {
    width: "100%",
    paddingHorizontal: 10,
    marginBottom: 25
  },
  greetingText: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_16 || 16,
    color: Color.text || "#1E1E1E",
    textAlign: "center",
    lineHeight: 28
  },
  highlightText: {
    color: Color.red || "#A10202",
    fontFamily: FontFamily.lexendDecaRegular
  },
  instructionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 25,
    width: "100%",
    paddingHorizontal: 5
  },
  instructionText: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: 14,
    color: Color.text || "#1E1E1E",
    flex: 1,
    lineHeight: 22
  },
  infoContainer: {
    width: "100%",
    gap: 12,
    marginBottom: 30
  },
  infoCapsule: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 30,
    gap: 12,
    width: "100%", 
    alignSelf: "center"
  },
  infoText: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: 12,
    color: Color.text || "#1E1E1E"
  },
  boldInfoText: {
    fontFamily: FontFamily.lexendDecaSemiBold
  },
  buttonGroup: {
    width: "100%",
    gap: 12
  },
  primaryButton: {
    width: "100%",
    height: 56,
    borderRadius: 30
  },
  secondaryButton: {
    width: "100%",
    height: 56,
    borderRadius: 30,
    backgroundColor: "#FFFFFF",
    borderColor: Color.cam || "#FF6B00",
    borderWidth: 2
  },
  secondaryButtonText: {
    color: Color.cam || "#FF6B00"
  }
});
