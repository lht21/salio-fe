import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SealQuestionIcon, XIcon } from 'phosphor-react-native';
import { FontFamily, FontSize } from '../../constants/GlobalStyles';
import IconButton from '../IconButton';
import { useTheme } from "@/contexts/ThemeContext";

type PracticeHeaderProps = {
  lessonLabel?: string;
  instruction: string;
  onClose?: () => void;
};

export default function PracticeHeader({ lessonLabel, instruction, onClose }: PracticeHeaderProps) {
    const { colors } = useTheme();
    const styles = getStyles(colors);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.headerActions}>
          <IconButton Icon={SealQuestionIcon} onPress={() => {}} variant='Main' />
          {onClose ? (
            <IconButton Icon={XIcon} onPress={onClose} />
          ) : null}
        </View>
      </View>
      <View style={styles.headerTextWrap}>
        {lessonLabel ? <Text style={styles.lessonLabel}>{lessonLabel}</Text> : null}
        <Text style={styles.instruction}>{instruction}</Text>
      </View>
    </View>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
      container: {
        marginBottom: 12,
      },
      headerRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        gap: 12,
        marginBottom: 12,
      },
      headerTextWrap: {
        flex: 1,
      },
      lessonLabel: {
        fontFamily: FontFamily.lexendDecaSemiBold,
        fontSize: FontSize.fs_20,
        color: '#4B8E37',
        marginBottom: 2,
      },
      instruction: {
        fontFamily: FontFamily.lexendDecaSemiBold,
        fontSize: FontSize.fs_20,
        color: colors.text,
        marginBottom: 12,
      },
      headerActions: {
        flexDirection: 'row',
        gap: 8,
      },
    });
