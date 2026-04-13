import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import {
  Color,
  FontFamily,
  FontSize,
  Border,
  Padding,
  Gap,
} from "../constants/GlobalStyles";
import { ExamIcon } from "phosphor-react-native";

type MocktestCardProps = {
  onPress?: () => void;
};

const MocktestCard = ({ onPress }: MocktestCardProps) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.iconContainer}>
        <ExamIcon size={24} color="#8A38F5" weight="fill" />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Thi thử toàn diện (Mocktest)</Text>

        <View style={styles.badgesRow}>
          <View style={styles.badgePurple}>
            <Text style={styles.badgePurpleText}>Zenmode</Text>
          </View>

          <View style={styles.badgeGray}>
            <Text style={styles.badgeGrayText}>Chế độ tập trung</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Color.bg,
    borderWidth: 1.5,
    borderColor: Color.stroke || "#E2E8F0",
    borderRadius: Border.br_15 || 15,
    padding: Padding.padding_15 || 15,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: Border.br_10 || 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Gap.gap_15 || 15,
  },

  content: {
    flex: 1,
  },
  title: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: 15,
    color: Color.text,
    marginBottom: 6,
  },
  badgesRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F1F5F9", // Xám nhạt
  },
  badgePurple: {
    backgroundColor: "#E9D5FF", // Tím nhạt
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgePurpleText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: 10,
    color: "#7E22CE", // Tím đậm
  },
  badgeGray: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeGrayText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: 10,
    color: "#64748B", // Xám
  },
});

export default MocktestCard;
