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
    backgroundColor: "#FFFFFF", // Sửa thành nền trắng để hợp với gradient xanh
    borderRadius: 90, // Tăng thành 90 (một nửa 180) để ra hình tròn hoàn hảo
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 5, // Dày thêm chút cho phần hào quang
    borderColor: "rgba(255, 255, 255, 0.5)", // Viền nửa trong suốt mượt mà hơn
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 5
  },
  mascotImage: {
    width: 150,
    height: 150
  },
  greetingWrapper: {
    width: "100%",
    paddingHorizontal: 10,
    marginBottom: 25
  },
  greetingText: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_20 || 20, // Tăng size cho câu chào mừng nổi bật
    color: Color.text || "#1E1E1E",
    textAlign: "center",
    lineHeight: 30
  },
  highlightText: {
    color: Color.cam || "#FF6B00", // Đổi đỏ đậm thành cam cho cùng tone
    fontFamily: FontFamily.lexendDecaBold
  },
  instructionRow: {
    flexDirection: "row",
    alignItems: "flex-start", // Đẩy icon lên ngang hàng với chữ dòng đầu
    gap: 12,
    marginBottom: 25,
    width: "100%",
    paddingHorizontal: 10
  },
  instructionText: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: 14,
    color: Color.text || "#1E1E1E",
    flex: 1,
    lineHeight: 22,
    paddingTop: 4 // Căn nhẹ cho chữ ngang tầm với icon
  },
  infoContainer: {
    width: "100%",
    gap: 12,
    marginBottom: 35
  },
  infoCapsule: {
    backgroundColor: "rgba(255, 255, 255, 0.8)", // Nền trắng hơi mờ hòa vào nền gradient
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start", // Căn trái cho text 2 nang thẳng hàng
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 20, // Bo góc cong mềm mại hơn thay vì hình thoi
    gap: 12,
    width: "100%"
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
