import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { LockKeyIcon } from 'phosphor-react-native';
import { Color, FontFamily, FontSize } from '../constants/GlobalStyles';
import { useTheme } from "@/contexts/ThemeContext";

export default function NextStageCard() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: Color.brown50, borderColor: Color.brown200 }]}>
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: '#334155' }]}>Chặng tiếp theo</Text>
        <Text style={[styles.subtitle, { color: Color.neutral400 }]}>
          Hoàn thành các bài trên để mở khóa
        </Text>
      </View>
      <Image 
        source={require('../assets/images/horani/next.png')} 
        style={{ width: '100%', height: 170, resizeMode: 'contain', marginTop: 16, borderRadius: 20 }} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 20,

    borderWidth: 2,
    borderRadius: 20,

    marginVertical: 10,
    zIndex: 2,
    width: '80%',
    alignSelf: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: FontSize.fs_16,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_12,
    opacity: 0.9,
  },
});
