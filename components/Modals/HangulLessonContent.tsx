import React from 'react';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { CardsIcon, CaretLeftIcon, PenNibStraightIcon } from 'phosphor-react-native';

import CategoryChip from '../CategoryChip';
import HangulCharacterAccordion from './HangulCharacterAccordion';
import { closeLessonBottomSheet } from './lessonBottomSheetBus';
import { getHangulWritingIndex } from './hangulWritingSequence';
import { Color, FontFamily, FontSize, Gap, Padding } from '../../constants/GlobalStyles';

type HangulTabKey = 'basic_consonants' | 'basic_vowels' | 'double_consonants' | 'compound_vowels';

type HangulItem = {
  id: string;
  label: string;
  glyph: string;
  example: string;
  initiallyExpanded?: boolean;
};

const HANGUL_TABS: { key: HangulTabKey; label: string }[] = [
  { key: 'basic_consonants', label: 'Phụ âm cơ bản' },
  { key: 'basic_vowels', label: 'Nguyên âm cơ bản' },
  { key: 'double_consonants', label: 'Phụ âm kép' },
  { key: 'compound_vowels', label: 'Nguyên âm ghép' },
];

const HANGUL_CONTENT: Record<HangulTabKey, HangulItem[]> = {
  basic_consonants: [
    { id: 'ㄱ', label: 'ㄱ (k/g)', glyph: '\u3131', example: 'Ví dụ: 가구 - đồ nội thất', initiallyExpanded: true },
    { id: 'ㄴ', label: 'ㄴ (n)', glyph: '\u3134', example: 'Ví dụ: 나무- cây' },
    { id: 'ㄷ', label: 'ㄷ (d/t)', glyph: '\u3137', example: 'Ví dụ: 닫다 - nhận' },
    { id: 'ㄹ', label: 'ㄹ (r/l)', glyph: '\u3139', example: 'Ví dụ: 라디오 - Radio' },
    { id: 'ㅁ', label: 'ㅁ (m)', glyph: '\u3141', example: 'Ví dụ: 머리 - tóc' },
    { id: 'ㅂ', label: 'ㅂ (b)', glyph: '\u3142', example: 'Ví dụ: 벽 - tường' },
    { id: 'ㅅ', label: 'ㅅ (s)', glyph: '\u3145', example: 'Ví dụ: 사람 - người' },
    { id: 'ㅇ', label: 'ㅇ (ng)', glyph: '\u3147', example: 'Ví dụ: 아이 - trẻ con' },
    { id: 'ㅈ', label: 'ㅈ (j)', glyph: '\u3148', example: 'Ví dụ: 자리 - chỗ ngồi' },
    { id: 'ㅊ', label: 'ㅊ (ch)', glyph: '\u314A', example: 'Ví dụ: 차 - xe' },
    { id: 'ㅋ', label: 'ㅋ (k)', glyph: '\u3132', example: 'Ví dụ: 코 - mũi' },
    { id: 'ㅌ', label: 'ㅌ (t)', glyph: '\u314B', example: 'Ví dụ: 토끼 - thỏ' },
    { id: 'ㅍ', label: 'ㅍ (p)', glyph: '\u314C', example: 'Ví dụ: 피자 - pizza' },
    { id: 'ㅎ', label: 'ㅎ (h)', glyph: '\u314D', example: 'Ví dụ: 하늘 - bầu trời' },
  ],
  basic_vowels: [
    { id: 'ㅏ', label: 'ㅏ (a)', glyph: '\u314F', example: 'Ví dụ: 아이 - em bé', initiallyExpanded: true },
    { id: 'ㅑ', label: 'ㅑ (ya)', glyph: '\u3151', example: 'Ví dụ: 야구 - bóng chày' },
    { id: 'ㅓ', label: 'ㅓ (eo)', glyph: '\u3153', example: 'Ví dụ: 엄마 - mẹ' },
    { id: 'ㅕ', label: 'ㅕ (yeo)', glyph: '\u3155', example: 'Ví dụ: 여자 - cô gái' },
    { id: 'ㅗ', label: 'ㅗ (o)', glyph: '\u3157', example: 'Ví dụ: 오이 - dưa leo' },
    { id: 'ㅛ', label: 'ㅛ (yo)', glyph: '\u315B', example: 'Ví dụ: 요리 - nấu ăn' },
    { id: 'ㅜ', label: 'ㅜ (u)', glyph: '\u315C', example: 'Ví dụ: 우유 - sữa' },
    { id: 'ㅠ', label: 'ㅠ (yu)', glyph: '\u3160', example: 'Ví dụ: 유치원 - mầm non' },
    { id: 'ㅡ', label: 'ㅡ (eu)', glyph: '\u3161', example: 'Ví dụ: 음식 - đồ ăn' },
    { id: 'ㅣ', label: 'ㅣ (i)', glyph: '\u3163', example: 'Ví dụ: 인간 - con người' },
  ],
  double_consonants: [
    { id: 'ㄸ', label: 'ㄸ (tt)', glyph: '\u3138', example: 'Ví dụ: 딸기- dâu tây' },
    { id: 'ㅃ', label: 'ㅃ (pp)', glyph: '\u3143', example: 'Ví dụ: 아빠 - bố' },
    { id: 'ㅆ', label: 'ㅆ (ss)', glyph: '\u3146', example: 'Ví dụ: 싸다 - rẻ' },
    { id: 'ㅉ', label: 'ㅉ (jj)', glyph: '\u3149', example: 'Ví dụ: 짜장면 - mì tương đen' },
    { id: 'ㄲ', label: 'ㄲ (kk)', glyph: '\u3132', example: 'Ví dụ: 느낌 - cảm giác' },
  ],
  compound_vowels: [
    { id: 'ㅐ', label: 'ㅐ (ae)', glyph: '\u3150', example: 'Ví dụ: 개 - con chó', initiallyExpanded: true },
    { id: 'ㅒ', label: 'ㅒ (yae)', glyph: '\u3152', example: 'Ví dụ: 냠 - tiếng ồn' },
    { id: 'ㅔ', label: 'ㅔ (e)', glyph: '\u3154', example: 'Ví dụ: 빌 - người đàn ông' },
    { id: 'ㅖ', label: 'ㅖ (ye)', glyph: '\u3156', example: 'Ví dụ: 예 - ví dụ' },
    { id: 'ㅘ', label: 'ㅘ (wa)', glyph: '\u3158', example: 'Ví dụ: 화장실 - nhà vệ sinh' },
    { id: 'ㅙ', label: 'ㅙ (wae)', glyph: '\u3159', example: 'Ví dụ: 왜 - tại sao' },
    { id: 'ㅚ', label: 'ㅚ (oe)', glyph: '\u315A', example: 'Ví dụ: 쇠 - sắt' },
    { id: 'ㅝ', label: 'ㅝ (wo)', glyph: '\u315D', example: 'Ví dụ: 원숭이 - con khỉ' },
    { id: 'ㅞ', label: 'ㅞ (we)', glyph: '\u315E', example: 'Ví dụ: 웨이터 - người phục vụ' },
    { id: 'ㅟ', label: 'ㅟ (wi)', glyph: '\u315F', example: 'Ví dụ: 위치 - vị trí' },
    { id: 'ㅢ', label: 'ㅢ (ui)', glyph: '\u3162', example: 'Ví dụ: 의자 - cái ghế' },
  ],
};

const HangulLessonContent = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState<HangulTabKey>('basic_consonants');
  const items = HANGUL_CONTENT[activeTab];

  return (
    <View style={styles.wrapper}>
      <View style={styles.headerRow}>
        <Pressable style={styles.backButton} hitSlop={10}>
          <CaretLeftIcon size={20} color={Color.gray} weight="bold" />
        </Pressable>
        <Text style={styles.title}>Bảng chữ cái</Text>
      </View>

      <ScrollView
        horizontal
        nestedScrollEnabled
        directionalLockEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.chipsScroll}
        contentContainerStyle={styles.chipsRow}
      >
        {HANGUL_TABS.map((tab) => (
          <CategoryChip
            key={tab.key}
            label={tab.label}
            isActive={tab.key === activeTab}
            onPress={() => setActiveTab(tab.key)}
          />
        ))}
      </ScrollView>

      <View style={styles.list}>
        {items.map((item) => (
          <HangulCharacterAccordion
            key={item.id}
            label={item.label}
            glyph={item.glyph}
            example={item.example}
            initiallyExpanded={item.initiallyExpanded}
          />
        ))}
      </View>

      <View style={styles.actionBar}>
        <Pressable
          style={styles.actionItem}
          onPress={() => {
            const firstItem = items[0];
            if (!firstItem) {
              return;
            }

            closeLessonBottomSheet();
            router.push({
              pathname: '/lessons/[lessonId]/writing/practiceHangul',
              params: {
                lessonId: '0',
                glyph: firstItem.glyph,
                label: firstItem.label,
                mode: 'sequence',
                sequenceIndex: String(getHangulWritingIndex(firstItem.glyph, firstItem.label)),
              },
            });
          }}
        >
          <View style={styles.actionIconWrap}>
            <PenNibStraightIcon size={18} color={Color.bg} weight="fill" />
          </View>
          <Text style={styles.actionText}>Luyện viết tay</Text>
        </Pressable>

        <Pressable style={styles.actionItem}>
          <View style={styles.actionIconWrap}>
            <CardsIcon size={18} color={Color.bg} weight="fill" />
          </View>
          <Text style={styles.actionText}>Bài tập ghi nhớ</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    gap: Gap.gap_15,
    paddingBottom: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.gap_10,
  },
  backButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_24,
    color: Color.text,
  },
  chipsScroll: {
    flexGrow: 0,
  },
  chipsRow: {
    gap: Gap.gap_10,
    paddingRight: Padding.padding_15,
  },
  list: {
    gap: Gap.gap_14,
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#9BF08A',
    borderRadius: 24,
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginTop: 4,
  },
  actionItem: {
    flex: 1,
    alignItems: 'center',
    gap: Gap.gap_8,
  },
  actionIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Color.text,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    textAlign: 'center',
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_12,
    color: Color.text,
  },
});

export default HangulLessonContent;