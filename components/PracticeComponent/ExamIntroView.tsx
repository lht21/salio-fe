import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { ClockIcon, CrownIcon, TrophyIcon, XIcon } from 'phosphor-react-native';

// Import Design System & Components
import { Color, FontFamily, FontSize, Padding, Gap, Border } from '../../constants/GlobalStyles';
import IconButton from '../IconButton';
import Button from '../Button';
import ZenmodeBanner from '../ExamComponent/ZenmodeBanner';

const ExamIntroView = ({ data, onStart, onExit, isStarting, isZenmodeEnabled, onToggleZenmode }: any) => {
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
        <Image
          source={require('../../assets/images/horani/horani_ei.png')}
          style={styles.mascotImage}
          resizeMode="contain"
        />

        <View style={styles.titleContainer}>
          {data?.isPremium && (
            <View style={styles.premiumBadge}>
              <CrownIcon size={14} color={Color.bg} weight="fill" />
              <Text style={styles.premiumText}>Premium</Text>
            </View>
          )}
          <Text style={styles.examTitle}>{examTitle}</Text>
        </View>
        
        <ZenmodeBanner isEnabled={isZenmodeEnabled} onToggle={onToggleZenmode} />

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

        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <ClockIcon size={20} color={Color.cam} weight="fill" />
            <Text style={styles.statsText}>Thời gian: {durationDisplay}</Text>
          </View>
          <View style={styles.statsRow}>
            <TrophyIcon size={20} color={Color.vang} weight="fill" />
            <Text style={styles.statsText}>Tổng điểm: {data?.totalScore || 0}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.readyText}>Bạn đã sẵn sàng chưa?</Text>
        <Button
          title={isStarting ? "Đang xử lý..." : "Sẵn sàng"}
          variant="Green"
          onPress={onStart}
          style={{ width: '100%', opacity: isStarting ? 0.7 : 1 }}
          disabled={isStarting}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  viewContainer: { flex: 1 },
  header: {
    alignItems: 'flex-end',
    paddingHorizontal: Padding.padding_15,
    paddingTop: Padding.padding_10,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Padding.padding_20,
    alignItems: 'center',
    paddingBottom: 20,
  },
  mascotImage: { width: 200, height: 200, marginBottom: Gap.gap_20 },
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
    color: Color.bg,
  },
  examTitle: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_24,
    color: Color.text,
    textAlign: 'center',
  },
  infoCard: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: Border.br_15,
    padding: Padding.padding_20,
    marginBottom: Gap.gap_20,
    borderWidth: 1,
    borderColor: Color.stroke,
  },
  infoCardTitle: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_16, color: Color.text, marginBottom: Gap.gap_15 },
  skillsList: { gap: Gap.gap_10 },
  skillItem: { flexDirection: 'row', alignItems: 'center' },
  bulletPoint: { width: 6, height: 6, borderRadius: 3, backgroundColor: Color.gray, marginRight: Gap.gap_10 },
  skillText: { fontFamily: FontFamily.lexendDecaRegular, fontSize: FontSize.fs_14, color: Color.gray },
  statsContainer: { alignSelf: 'flex-start', gap: Gap.gap_10, paddingLeft: Padding.padding_5 },
  statsRow: { flexDirection: 'row', alignItems: 'center', gap: Gap.gap_8 },
  statsText: { fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_14, color: Color.text },
  footer: { paddingHorizontal: Padding.padding_15, paddingTop: Padding.padding_10, paddingBottom: Padding.padding_30, alignItems: 'center', gap: Gap.gap_10 },
  readyText: { fontFamily: FontFamily.lexendDecaRegular, fontSize: FontSize.fs_14, color: Color.gray },
});

export default ExamIntroView;