import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FontFamily, FontSize } from '../../constants/GlobalStyles';
import Button from '../Button';
import { useTheme } from "@/contexts/ThemeContext";

type TranscriptBoxProps = {
  transcript?: string;
  showTranscript: boolean;
  transcriptButtonLabel?: string;
  shadowingButtonLabel?: string;
  showTranscriptButton?: boolean;
  showShadowingButton?: boolean;
  onToggleTranscript: () => void;
  onPressShadowing?: () => void;
};

export default function TranscriptBox({
  transcript,
  showTranscript,
  transcriptButtonLabel = 'Hiển thị transcript',
  shadowingButtonLabel = 'Luyện shadowing với bài này',
  showTranscriptButton = true,
  showShadowingButton = true,
  onToggleTranscript,
  onPressShadowing,
}: TranscriptBoxProps) {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  return (
    <View style={styles.container}>
      {showTranscriptButton ? (
        <Button
          variant="Outline"
          title={transcriptButtonLabel}
          onPress={onToggleTranscript}
        />
      ) : null}

      {showShadowingButton ? (
        <Button
          variant="Outline"
          title={shadowingButtonLabel}
          onPress={onPressShadowing}
        />
      ) : null}

      {showTranscript && transcript ? (
        <View style={styles.transcriptWrap}>
          <Text style={styles.transcriptText}>{transcript}</Text>
        </View>
      ) : null}
    </View>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  container: {
    gap: 12,
    marginTop: 12,
  },
  transcriptWrap: {
    borderRadius: 16,
    backgroundColor: '#F7FAFF',
    padding: 14,
  },
  transcriptText: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_14,
    lineHeight: 22,
    color: colors.textPrimary,
  },
});
