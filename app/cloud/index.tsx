import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../../components/ScreenHeader';
import { Color, FontFamily, FontSize } from '../../constants/GlobalStyles';

export default function StoreScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title="Cửa hàng" />
      <View style={styles.container}>
        {/* Nội dung cửa hàng sẽ được thêm vào đây sau */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Color.bg,
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
});
