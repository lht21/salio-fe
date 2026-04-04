import React from 'react';
import { Stack, useRouter } from 'expo-router';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { WarningCircleIcon } from 'phosphor-react-native';

import { Color, FontFamily, FontSize, Padding, Gap } from '../constants/GlobalStyles';
import Button from '../components/Button';

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Ẩn header mặc định để giao diện toàn màn hình đẹp hơn */}
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.container}>
        {/* Icon cảnh báo */}
        <WarningCircleIcon size={80} color={Color.cam || '#FFA054'} weight="fill" />
        
        {/* Nội dung thông báo */}
        <Text style={styles.title}>Ôi không!</Text>
        <Text style={styles.subtitle}>
          Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </Text>

        {/* Nút quay về trang chủ */}
        <Button 
          title="Về trang chủ" 
          variant="Green" 
          onPress={() => router.replace('/')} 
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Color.bg || '#FFFFFF',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Padding.padding_15 || 15,
  },
  title: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: 24,
    color: Color.text || '#1E1E1E',
    marginTop: Gap.gap_20 || 20,
    marginBottom: Gap.gap_10 || 10,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_14 || 14,
    color: Color.gray || '#64748B',
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  button: {
    width: '100%',
    maxWidth: 250, // Giới hạn chiều rộng nút để trông cân đối hơn trên màn hình to
  }
});