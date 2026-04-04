import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Color, FontFamily, Border, Padding, FontSize } from '../constants/GlobalStyles';
import Button from './Button'; // Component Button bạn đã có

const AlertBanner = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Bạn đã đạt 215 điểm Topik thi thử. Kiểm tra ngay để chuyển đổi Trình độ học tập hiện tại
      </Text>
      <View style={styles.btnWrapper}>
        <Button 
          variant="Orange" // Orange có chữ màu trắng (Color.bg)
          title="Kiểm tra"
          style={styles.customBtn}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.vang || '#F9F871',
    borderRadius: Border.br_15 || 15,
    padding: Padding.padding_15 || 15,
    marginHorizontal: Padding.padding_15 || 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  text: {
    flex: 1,
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_12 || 12,
    color: Color.text,
    lineHeight: 18,
    marginRight: 10,
  },
  btnWrapper: {
    width: 90,
  },
  customBtn: {
    backgroundColor: '#1E1E1E', // Ghi đè nền đen
    height: 36,
    paddingHorizontal: 10,
    marginVertical: 0,
  }
});

export default AlertBanner;