import React from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { XIcon } from 'phosphor-react-native';

import Button from '../../../../components/Button';
import { Border, Color, FontFamily, FontSize } from '../../../../constants/GlobalStyles';

const speakingMetrics = [
  { id: 'pronunciation', label: 'Phát âm', value: 90, color: '#4ACB40' },
  { id: 'intonation', label: 'Ngữ điệu', value: 70, color: '#FFB200' },
  { id: 'accuracy', label: 'Độ chính xác', value: 30, color: '#A10202' },
  { id: 'fluency', label: 'Độ lưu loát', value: 90, color: '#FF9898' },
];

export default function SpeakingResultScreen() {
  const router = useRouter();
  const { lessonId } = useLocalSearchParams<{ lessonId?: string }>();
  const resolvedLessonId = lessonId ?? '1';
  const screenOpacity = React.useRef(new Animated.Value(0)).current;
  const screenTranslateY = React.useRef(new Animated.Value(26)).current;
  const metricAnimations = React.useRef(speakingMetrics.map(() => new Animated.Value(0))).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(screenOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(screenTranslateY, {
        toValue: 0,
        duration: 420,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    Animated.stagger(
      180,
      metricAnimations.map((value) =>
        Animated.timing(value, {
          toValue: 1,
          duration: 820,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        })
      )
    ).start();
  }, [metricAnimations, screenOpacity, screenTranslateY]);

  return (
    <LinearGradient colors={['#DFF8C6',  '#FFFFFF','#FFFFFF','#FFFFFF','#FFFFFF',  ]} style={styles.gradientScreen}>
      <SafeAreaView style={styles.safeArea}>
        <Animated.View
          style={[
            styles.content,
            {
              opacity: screenOpacity,
              transform: [{ translateY: screenTranslateY }],
            },
          ]}
        >
          <Pressable style={styles.closeButton} onPress={() => router.replace('/(tabs)' as any)}>
            <XIcon size={22} color="#A3A3A3" weight="bold" />
          </Pressable>

          <Image
            source={require('../../../../assets/images/tubo/result.png')}
            style={styles.heroImage}
            contentFit="contain"
          />

          <Text style={styles.title}>Hoàn thành xuất sắc!</Text>

          <View style={styles.scoreRow}>
            <Text style={styles.scoreLabel}>Đúng 3/4</Text>
            <Text style={styles.scoreValue}>75 điểm</Text>
          </View>

          <View style={styles.metricsWrap}>
            <Text style={styles.metricsHeading}>Phân tích kỹ năng</Text>

            {speakingMetrics.map((metric, index) => (
              <View key={metric.id} style={styles.metricBlock}>
                <Text style={styles.metricLabel}>{metric.label}</Text>
                <View style={styles.track}>
                  <Animated.View
                    style={[
                      styles.fill,
                      {
                        width: metricAnimations[index].interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0%', `${metric.value}%`],
                        }),
                        backgroundColor: metric.color,
                      },
                    ]}
                  >
                    <Animated.Text style={[styles.trackValue, { opacity: metricAnimations[index] }]}>
                      {metric.value}%
                    </Animated.Text>
                  </Animated.View>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.footer}>
            <Button
              title="Xem giải thích chi tiết"
              onPress={() => router.push(`/lessons/${resolvedLessonId}/speaking/explanation` as any)}
              style={styles.primaryButton}
            />
          </View>
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientScreen: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 18,
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroImage: {
    width: 148,
    height: 148,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 10,
  },
  title: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: 28,
    color: Color.cam,
    textAlign: 'center',
    marginBottom: 22,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
    paddingHorizontal: 6,
  },
  scoreLabel: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_16,
    color: Color.text,
  },
  scoreValue: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: FontSize.fs_20,
    color: '#C62B1F',
  },
  metricsWrap: {
    marginTop: 8,
    gap: 14,
  },
  metricsHeading: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_16,
    color: Color.text,
  },
  metricBlock: {
    gap: 8,
  },
  metricLabel: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_14,
    color: Color.text,
  },
  track: {
    height: 24,
    borderRadius: 999,
    backgroundColor: 'rgba(0, 0, 0, 0.14)',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  trackValue: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_12,
    color: '#FFFFFF',
    paddingRight: 10,
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 16,
  },
  primaryButton: {
    marginVertical: 0,
    borderRadius: Border.br_30,
  },
});
