import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Modal } from 'react-native';
import { ClockIcon, CrownIcon, TrophyIcon, XIcon, ArrowBendRightUpIcon } from 'phosphor-react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';

// Import Design System & Components
import { FontFamily, FontSize, Padding, Gap, Border } from '../../constants/GlobalStyles';
import IconButton from '../IconButton';
import Button from '../Button';
import ZenmodeBanner from '../ExamComponent/ZenmodeBanner';
import { useTheme } from "@/contexts/ThemeContext";

const ExamIntroView = ({ data, onStart, onExit, isStarting, isZenmodeEnabled, onToggleZenmode, onPreparationPress }: any) => {
    const { colors } = useTheme();
    const styles = getStyles(colors);
    const [showZenmodeSheet, setShowZenmodeSheet] = useState(false);

  const examTitle = data?.title || 'Bài thi trắc nghiệm';

  // Tính toán tổng thời gian (Phòng trường hợp duration trả về dạng Object { listening: 50, reading: 70 })
  let totalDuration = data?.duration;
  if (typeof totalDuration === 'object' && totalDuration !== null) {
    totalDuration = Object.values(totalDuration).reduce((sum: any, val: any) => sum + (typeof val === 'number' ? val : 0), 0);
  }
  const durationDisplay = totalDuration ? `${totalDuration} phút` : '180 phút';

  // Tính toán số lượng câu hỏi thực tế dựa vào data từ backend
  let listeningCount = 0;
  let readingCount = 0;

  if (data?.type === 'full') {
    listeningCount = data?.items?.listening?.reduce((sum: number, item: any) => sum + (item.questions?.length || 0), 0) || 0;
    readingCount = data?.items?.reading?.reduce((sum: number, item: any) => sum + (item.questions?.length || 0), 0) || 0;
  } else if (data?.type === 'listening') {
    listeningCount = data?.items?.reduce((sum: number, item: any) => sum + (item.questions?.length || 0), 0) || 0;
  } else if (data?.type === 'reading') {
    readingCount = data?.items?.reduce((sum: number, item: any) => sum + (item.questions?.length || 0), 0) || 0;
  }

  const dynamicSkills = [];
  if (listeningCount > 0) dynamicSkills.push({ name: 'Nghe', count: listeningCount });
  if (readingCount > 0) dynamicSkills.push({ name: 'Đọc', count: readingCount });

  return (
    <View style={styles.viewContainer}>
      <View style={styles.header}>
        <IconButton Icon={XIcon} onPress={onExit} />
        
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInUp.duration(600)} style={styles.mainWrapper}>
          <Image
            source={require('../../assets/images/horani/horani_ei.png')}
            style={styles.mascotImage}
            resizeMode="contain"
          />

          <View style={styles.titleContainer}>
            {data?.isPremium && (
              <View style={styles.premiumBadge}>
                <CrownIcon size={14} color={colors.bg} weight="fill" />
                <Text style={styles.premiumText}>Premium</Text>
              </View>
            )}
            <Text style={styles.examTitle}>{examTitle}</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoCardTitle}>Phần thi:</Text>
            <View style={styles.skillsList}>
              {dynamicSkills.length > 0 ? (
                dynamicSkills.map((skill, index) => (
                  <View key={index} style={styles.skillItem}>
                    <View style={styles.bulletPoint} />
                    <Text style={styles.skillText}>
                      {skill.name} ({skill.count} câu)
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={styles.skillText}>Chưa có câu hỏi nào</Text>
              )}
            </View>
          </View>

          <View style={styles.timeContainer}>
            <ClockIcon size={20} color={colors.main50 || '#F8FAFC'} weight="regular" />
            <Text style={styles.timeText}>Thời gian: {durationDisplay}</Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(600).delay(600)} style={styles.actionCardsContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPreparationPress || (() => {})}
            style={[
              styles.actionCard,
              {
                backgroundColor: colors.blue200 || '#BFDBFE',
                borderColor: colors.blue400 || '#60A5FA',
              }
            ]}
          >
            <Text style={styles.actionCardText}>Ôn từ vựng và ngữ pháp trước khi thi</Text>
            <View style={styles.actionCardIcon}>
              <ArrowBendRightUpIcon size={50} color={colors.blue400 || '#60A5FA'} weight="bold" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setShowZenmodeSheet(true)}
            style={[
              styles.actionCard,
              {
                backgroundColor: colors.orange50 || '#FFF7ED',
                borderColor: colors.orange300 || '#FDBA74',
              }
            ]}
          >
            <Text style={styles.actionCardText}>Luyện thi luôn!</Text>
            <View style={styles.actionCardIcon}>
              <ArrowBendRightUpIcon size={50} color={colors.orange300 || '#FDBA74'} weight="bold" />
            </View>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>

      <Modal visible={showZenmodeSheet} transparent animationType="slide" onRequestClose={() => setShowZenmodeSheet(false)}>
        <View style={styles.bottomSheetOverlay}>
          <TouchableOpacity style={styles.bottomSheetBackdrop} activeOpacity={1} onPress={() => setShowZenmodeSheet(false)} />
          <View style={styles.bottomSheetContainer}>
            <View style={styles.bottomSheetHeader}>
              <Text style={styles.bottomSheetTitle}>Chuẩn bị thi</Text>
              <IconButton Icon={XIcon} onPress={() => setShowZenmodeSheet(false)} />
            </View>
            
            <ZenmodeBanner isEnabled={isZenmodeEnabled} onToggle={onToggleZenmode} />
            
            <Button
              title={isStarting ? "Đang xử lý..." : "Bắt đầu thi"}
              variant="Green"
              onPress={() => {
                setShowZenmodeSheet(false);
                onStart();
              }}
              style={{ width: '100%', opacity: isStarting ? 0.7 : 1 }}
              disabled={isStarting}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const getStyles = (colors: any) => StyleSheet.create({
      viewContainer: { flex: 1 },
      header: {
        alignItems: 'flex-end',
        paddingHorizontal: Padding.padding_15,
        paddingTop: Padding.padding_10,
        marginBottom: Gap.gap_20,
      },
      scrollContent: {
        flexGrow: 1,
        paddingHorizontal: Padding.padding_20,
        alignItems: 'center',
        paddingBottom: 20,
      },
      mainWrapper: {
        width: '100%',
        backgroundColor: colors.main900 || '#2D5A27',
        borderRadius: 30,
        padding: Padding.padding_20,
        alignItems: 'center',
        marginBottom: Gap.gap_20,
      },
      mascotImage: { width: 180, height: 180, marginBottom: Gap.gap_15 },
      titleContainer: {
        alignItems: 'center',
        marginBottom: Gap.gap_20,
        gap: Gap.gap_8,
      },
      premiumBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F59E0B',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: Border.br_10,
        gap: 4,
      },
      premiumText: {
        fontFamily: FontFamily.lexendDecaBold,
        fontSize: FontSize.fs_12,
        color: colors.bg,
      },
      examTitle: {
        fontFamily: FontFamily.lexendDecaSemiBold,
        fontSize: FontSize.fs_24,
        color: colors.main50 || '#F8FAFC',
        textAlign: 'center',
      },
      infoCard: {
        width: '100%',
        backgroundColor: colors.main50 || '#F8FAFC',
        borderRadius: 20,
        padding: Padding.padding_20,
        marginBottom: Gap.gap_20,
      },
      infoCardTitle: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_16, color: colors.text, marginBottom: Gap.gap_15 },
      skillsList: { gap: Gap.gap_10 },
      skillItem: { flexDirection: 'row', alignItems: 'center' },
      bulletPoint: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.text, marginRight: Gap.gap_10 },
      skillText: { fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_14, color: colors.text },
      timeContainer: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center',
        gap: Gap.gap_8,
        paddingBottom: Padding.padding_10,
      },
      timeText: { fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_14, color: colors.main50 || '#F8FAFC' },
      actionCardsContainer: {
        width: '100%',
        paddingTop: Gap.gap_10,
        paddingBottom: Gap.gap_20,
      },
      actionCard: {
        width: '100%',
        padding: 24,
        borderRadius: 25,
        borderWidth: 1,
        borderLeftWidth: 4,
        borderBottomWidth: 7,
        marginBottom: 15,
        overflow: 'hidden',
        justifyContent: 'center',
        minHeight: 90,
      },
      actionCardText: {
        fontFamily: FontFamily.lexendDecaMedium,
        fontSize: FontSize.fs_16,
        color: colors.text,
        zIndex: 1,
      },
      actionCardIcon: {
        position: 'absolute',
        right: 15,
        bottom: -5,
        opacity: 0.3,
      },
      bottomSheetOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.4)',
      },
      bottomSheetBackdrop: {
        ...StyleSheet.absoluteFillObject,
      },
      bottomSheetContainer: {
        backgroundColor: colors.bg || '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: Padding.padding_20,
        paddingBottom: Padding.padding_30,
      },
      bottomSheetHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Gap.gap_20,
      },
      bottomSheetTitle: {
        fontFamily: FontFamily.lexendDecaSemiBold,
        fontSize: FontSize.fs_16,
        color: colors.text,
      },
    });

export default ExamIntroView;