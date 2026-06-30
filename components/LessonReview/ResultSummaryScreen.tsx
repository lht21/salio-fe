import React from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { XIcon } from 'phosphor-react-native';

import Button from '@/components/Button';
import IconButton from '@/components/IconButton';
import { Border, FontFamily, FontSize, Gap } from '@/constants/GlobalStyles';
import { useTheme } from "@/contexts/ThemeContext";

type ResultMetric = {
  id: string;
  label: string;
  value: number;
  color: string;
};

type ResultSummaryScreenProps = {
  title: string;
  pointLabel: string;
  subLabels?: string[];
  metrics: ResultMetric[];
  primaryLabel: string;
  onClose: () => void;
  onPrimaryPress: () => void;
  secondaryLabel?: string;
  onSecondaryPress?: () => void;
};

export default function ResultSummaryScreen({
  title,
  pointLabel,
  subLabels,
  metrics,
  primaryLabel,
  onClose,
  onPrimaryPress,
  secondaryLabel,
  onSecondaryPress
}: ResultSummaryScreenProps) {
    const { colors } = useTheme();
    const styles = getStyles(colors);

  const insets = useSafeAreaInsets();
  
  // Header animation: slide down
  const headerTranslateY = React.useRef(new Animated.Value(-600)).current;
  
  // Content animation: fade in after header
  const contentOpacity = React.useRef(new Animated.Value(0)).current;
  const contentTranslateY = React.useRef(new Animated.Value(30)).current;
  
  const metricAnimations = React.useRef(metrics.map(() => new Animated.Value(0))).current;

  React.useEffect(() => {
    // 1. Header slides down
    Animated.timing(headerTranslateY, {
      toValue: 0,
      duration: 600,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      // 2. Content fades in and slides up slightly
      Animated.parallel([
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(contentTranslateY, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();

      // 3. Metrics fill up
      Animated.stagger(
        150,
        metricAnimations.map((value) =>
          Animated.timing(value, {
            toValue: 1,
            duration: 700,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: false,
          })
        )
      ).start();
    });
  }, [headerTranslateY, contentOpacity, contentTranslateY, metricAnimations]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* HEADER SECTION */}
        <Animated.View style={[styles.headerCurved, { paddingTop: insets.top + 16, transform: [{ translateY: headerTranslateY }] }]}>
          <View style={styles.closeBtnContainer}>
             <IconButton Icon={XIcon} variant="Stroke" onPress={onClose} />
          </View>
          
          <Image
            source={require('../../assets/images/horani/result.png')}
            style={styles.heroImage}
            contentFit="contain"
          />

          <View style={styles.titleWrapper}>
            <Text style={styles.title}>{title}</Text>
          </View>

          <View style={styles.pointPill}>
            <Text style={styles.pointLabel}>{pointLabel}</Text>
          </View>

          {subLabels && subLabels.length > 0 && (
            <View style={styles.subLabelsRow}>
              {subLabels.map((lbl, idx) => (
                <View key={idx} style={styles.subPill}>
                  <Text style={styles.subPillText}>{lbl}</Text>
                </View>
              ))}
            </View>
          )}
        </Animated.View>

        {/* CONTENT SECTION */}
        <Animated.View style={[styles.mainContent, { opacity: contentOpacity, transform: [{ translateY: contentTranslateY }] }]}>
          <Text style={styles.metricsHeading}>Phân tích kỹ năng</Text>

          <View style={styles.metricsWrap}>
            {metrics.map((metric, index) => (
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
            <Button title={primaryLabel} onPress={onPrimaryPress} variant="Green" />
            
            {secondaryLabel && onSecondaryPress && (
              <Button title={secondaryLabel} onPress={onSecondaryPress} variant="TextOnly" />
            )}
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
      },
      scrollContent: {
        flexGrow: 1,
        paddingBottom: 40,
      },
      headerCurved: {
        backgroundColor: colors.main200,
        borderBottomLeftRadius: 60,
        borderBottomRightRadius: 60,
        paddingBottom: 32,
        alignItems: 'center',
        position: 'relative',
        zIndex: 10,
        // Add shadow to curved header to match design
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 8,
      },
      closeBtnContainer: {
        width: '100%',
        alignItems: 'flex-end',
        paddingHorizontal: 20,
        marginBottom: 10,
      },
      closeBtn: {
        backgroundColor: 'rgba(255,255,255,0.4)', // Slightly transparent grey/white
        borderWidth: 0,
      },
      heroImage: {
        width: 148,
        height: 148,
        marginBottom: 16,
      },
      titleWrapper: {
        position: 'relative',
        marginBottom: 16,
      },
      title: {
        fontFamily: FontFamily.lexendDecaBold,
        fontSize: 28,
        color: '#3F5C1B', // Dark green text inside
        textAlign: 'center',
        textTransform: 'uppercase',
      },
      titleStroke: {
        position: 'absolute',
        color: '#FFFFFF', // White stroke
      },
      pointPill: {
        backgroundColor: colors.bg, // Light yellow/green background
        paddingVertical: 10,
        paddingHorizontal: 36,
        borderRadius: 20,
        marginBottom: 12,
        borderLeftWidth: 5,
        borderRightWidth: 5,
        borderColor: colors.main700
      },
      pointLabel: {
        fontFamily: FontFamily.lexendDecaSemiBold,
        fontSize: 24,
        color: colors.orange500,
      },
      subLabelsRow: {
        flexDirection: 'row',
        gap: 12,
      },
      subPill: {
        backgroundColor: colors.main50,
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 20,
      },
      subPillText: {
        fontFamily: FontFamily.lexendDecaMedium,
        fontSize: 14,
        color: colors.main700,
      },
      mainContent: {
        paddingHorizontal: 24,
        paddingTop: 32,
        flex: 1,
      },
      metricsHeading: {
        fontFamily: FontFamily.lexendDecaBold,
        fontSize: 18,
        color: colors.main500,
        marginBottom: 16,
        textAlign: 'center'
      },
      metricsWrap: {
        gap: 20,
      },
      metricBlock: {
        gap: 8,
      },
      metricLabel: {
        fontFamily: FontFamily.lexendDecaSemiBold,
        fontSize: 14,
        color: '#000000',
      },
      track: {
        height: 26,
        borderRadius: 999,
        backgroundColor: '#D9D9D9',
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
        fontFamily: FontFamily.lexendDecaBold,
        fontSize: 13,
        color: '#FFFFFF',
        paddingRight: 12,
      },
      footer: {
        marginTop: 40,
        gap: 16,
      },
    });
