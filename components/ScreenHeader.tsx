import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ArrowLeftIcon } from 'phosphor-react-native';
import { useRouter } from 'expo-router';
import { Color, FontFamily, FontSize, Padding, Gap } from '../constants/GlobalStyles';

interface ScreenHeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightContent?: React.ReactNode;
}

export default function ScreenHeader({ 
  title, 
  showBackButton = true, 
  onBackPress, 
  rightContent 
}: ScreenHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.header}>
      <View style={styles.leftContent}>
        {showBackButton && (
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ArrowLeftIcon size={24} color={Color.main2} weight="bold" />
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>{title}</Text>
      </View>
      {rightContent && <View style={styles.rightContent}>{rightContent}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Padding.padding_15, paddingTop: Padding.padding_10, paddingBottom: Padding.padding_15, backgroundColor: Color.bg },
  leftContent: { flexDirection: 'row', alignItems: 'center' },
  backButton: { marginRight: Gap.gap_15 },
  headerTitle: { fontFamily: FontFamily.lexendDecaRegular, fontSize: FontSize.fs_20, color: Color.text },
  rightContent: { flexDirection: 'row', alignItems: 'center' },
});