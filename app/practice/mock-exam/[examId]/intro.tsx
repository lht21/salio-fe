import { useLocalSearchParams, useRouter } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";
import Button from "../../../../components/Button";
import {
  Border,
  Color,
  FontFamily,
  FontSize,
  Padding,
} from "../../../../constants/GlobalStyles";

// Mock data cho các đề (có thể lấy từ API hoặc truyền qua props)
const examInfoMap: Record<string, any> = {
  ai: {
    title: "Đề tổng hợp dành riêng cho bạn",
    sections: [
      { label: "듣기 (Nghe)", count: 50 },
      { label: "쓰기 (Viết)", count: 4 },
      { label: "읽기 (Đọc)", count: 50 },
    ],
    duration: 180,
    mascot: "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
  },
  "96": {
    title: "제96회 한국어능력시험",
    sections: [
      { label: "듣기 (Nghe)", count: 50 },
      { label: "쓰기 (Viết)", count: 4 },
      { label: "읽기 (Đọc)", count: 50 },
    ],
    duration: 180,
    mascot: "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
  },
  "21": {
    title: "제21회 한국어능력시험",
    sections: [
      { label: "듣기 (Nghe)", count: 50 },
      { label: "쓰기 (Viết)", count: 4 },
      { label: "읽기 (Đọc)", count: 50 },
    ],
    duration: 180,
    mascot: "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
  },
};

export default function MockExamIntro() {
  const { examId } = useLocalSearchParams();
  const router = useRouter();
  const info = examInfoMap[String(examId)] || examInfoMap["ai"];

  return (
    <View style={styles.container}>
      {/* Mascot/Avatar */}
      <View style={styles.avatarWrapper}>
        <Image
          source={require("../../../../assets/images/horani/ho.jpg")}
          style={styles.avatar}
        />
      </View>
      {/* Tên đề */}
      <Text style={styles.examTitle}>{info.title}</Text>
      {/* Thông tin phần thi */}
      <View style={styles.sectionBox}>
        {info.sections.map((s: any, idx: number) => (
          <Text key={idx} style={styles.sectionText}>
            • {s.label} - {s.count} câu
          </Text>
        ))}
      </View>
      {/* Thời gian */}
      <Text style={styles.timeText}>
        ⏰ Thời gian:{" "}
        <Text style={{ color: Color.text }}>{info.duration} phút.</Text>
      </Text>
      {/* Sẵn sàng */}
      <Text style={styles.readyText}>Bạn đã sẵn sàng chưa?</Text>
      <Button
        title="Sẵn sàng"
        variant="Green"
        style={styles.readyBtn}
        onPress={() => {
          router.push(`/practice/mock-exam/${String(examId)}/exam`);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.bg,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Padding.padding_15 || 15,
  },
  avatarWrapper: {
    marginBottom: 18,
    alignItems: "center",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#F1F5F9",
    marginBottom: 8,
  },
  examTitle: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: FontSize.fs_16,
    color: Color.text,
    marginBottom: 12,
    textAlign: "center",
  },
  sectionBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: Border.br_10 || 10,
    padding: 14,
    marginBottom: 10,
    width: "100%",
  },
  sectionText: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_14,
    color: Color.text,
    marginBottom: 2,
  },
  timeText: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_14,
    color: Color.gray,
    marginBottom: 18,
    textAlign: "center",
  },
  readyText: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_14,
    color: Color.text,
    marginBottom: 12,
    textAlign: "center",
  },
  readyBtn: {
    minWidth: 160,
    alignSelf: "center",
  },
});
