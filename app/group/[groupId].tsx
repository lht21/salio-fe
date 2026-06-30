import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CaretLeftIcon } from 'phosphor-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontFamily, FontSize, Padding } from '../../constants/GlobalStyles';
import { useTheme } from "@/contexts/ThemeContext";

export default function GroupDetailScreen() {
    const { colors } = useTheme();
    const styles = getStyles(colors);

  const { groupId } = useLocalSearchParams();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={10}>
          <CaretLeftIcon size={24} color={colors.text} weight="bold" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết Gia tộc</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.text}>Đang hiển thị thông tin của Group ID: {groupId}</Text>
      </View>
    </SafeAreaView>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
      container: { flex: 1, backgroundColor: colors.bg },
      header: { 
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
        paddingHorizontal: Padding.padding_20, paddingVertical: 15,
        borderBottomWidth: 1, borderBottomColor: colors.stroke
      },
      headerTitle: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_16, color: colors.text },
      content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
      text: { fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_16, color: colors.gray },
    });