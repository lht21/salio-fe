import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { CaretDownIcon, HeadphonesIcon, BookOpenTextIcon } from 'phosphor-react-native';
import { Color, FontFamily, FontSize, Border, Padding, Gap } from '../../constants/GlobalStyles';

// Import Components
import WritingFeaturedCard from '../../components/WritingFeaturedCard';
import SkillCard from '../../components/SkillCard';
import MocktestCard from '../../components/MocktestCard';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PracticeScreen() {
  return (
    <View style={styles.safeArea}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Luyện thi</Text>
          
          <View style={styles.filterContainer}>
            <Text style={styles.filterLabel}>Cấp độ đề</Text>
            <TouchableOpacity style={styles.filterDropdown}>
              <Text style={styles.filterText}>ESP</Text>
              <CaretDownIcon size={14} color={Color.text} weight="bold" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Featured Card (Luyện viết) */}
        <WritingFeaturedCard />

        {/* Secondary Cards (Luyện nghe & Luyện đọc) */}
        <View style={styles.skillsRow}>
          <SkillCard 
            title="Luyện nghe" 
            icon={<HeadphonesIcon size={24} color="#4A9F00" weight="fill" />} 
          />
          <SkillCard 
            title="Luyện đọc" 
            icon={<BookOpenTextIcon size={24} color="#1877F2" weight="fill" />} 
          />
        </View>

        {/* Mocktest Card (Thi thử) */}
        <View style={styles.mocktestContainer}>
          <MocktestCard />
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Color.bg || '#FFFFFF',
    paddingTop: 50,
  },
  scrollContent: {
    paddingHorizontal: Padding.padding_15 || 15,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontFamily: FontFamily.lexendDecaSemiBold, 
    fontSize: FontSize.fs_20 || 20, 
    color: Color.text || '#1E1E1E' 
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterLabel: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_12 || 12,
    color: '#64748B', // Xám đậm
  },
  filterDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Color.main || '#98F291',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Border.br_10 || 10,
    gap: 4,
  },
  filterText: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_12 || 12,
    color: Color.text,
  },
  skillsRow: {
    flexDirection: 'row',
    gap: Gap.gap_15 || 15,
    marginBottom: Gap.gap_20 || 20,
  },
  mocktestContainer: {
    width: '100%',
  },
});