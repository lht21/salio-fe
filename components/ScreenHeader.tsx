import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { ArrowLeftIcon } from 'phosphor-react-native';
import { useRouter } from 'expo-router';
import { FontFamily, FontSize, Padding, Gap } from '../constants/GlobalStyles';
import { useTheme } from '../contexts/ThemeContext';
import IconButton from './IconButton';

interface ScreenHeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightContent?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export default function ScreenHeader({ 
  title, 
  showBackButton = true, 
  onBackPress, 
  rightContent,
  style 
}: ScreenHeaderProps) {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View style={[styles.header, style]}>
      <View style={styles.leftContent}>
        {showBackButton && (
          <IconButton
            Icon={ArrowLeftIcon}
            iconSize={18}
            variant="Main"
            onPress={handleBack}
            style={styles.backButton}
          />
        )}
        <Text style={styles.headerTitle}>{title}</Text>
      </View>
      {rightContent && <View style={styles.rightContent}>{rightContent}</View>}
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Padding.padding_15, paddingTop: Padding.padding_10, paddingBottom: Padding.padding_15, backgroundColor: colors.bg },
  leftContent: { flexDirection: 'row', alignItems: 'center' },
  backButton: { 
    marginRight: Gap.gap_15,
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  headerTitle: { fontFamily: FontFamily.lexendDecaRegular, fontSize: FontSize.fs_20, color: colors.text },
  rightContent: { flexDirection: 'row', alignItems: 'center' },
});