import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Color, FontFamily, FontSize } from '../../constants/GlobalStyles';
import SettingsSheetModal from './SettingsSheetModal';

export type LanguageMode = 'vi' | 'en' | 'ko';

export type ChangeLanguageModalProps = {
  visible: boolean;
  language: LanguageMode;
  onSelectLanguage: (language: LanguageMode) => void;
  onClose: () => void;
};

const LANGUAGE_OPTIONS: Array<{
  value: LanguageMode;
  label: string;
  flag: string;
}> = [
    { value: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
    { value: 'en', label: 'Tiếng Anh', flag: '🇬🇧' },
    { value: 'ko', label: 'Tiếng Hàn', flag: '🇰🇷' },
  ];

const ChangeLanguageModal = ({
  visible,
  language,
  onSelectLanguage,
  onClose,
}: ChangeLanguageModalProps) => {
  return (
    <SettingsSheetModal
      visible={visible}
      title="Ngôn ngữ"
      onClose={onClose}
      edgeToBottom
      maxHeight="100%"
    >
      <View style={styles.body}>
        {LANGUAGE_OPTIONS.map((option, index) => {
          const isActive = option.value === language;

          return (
            <Pressable
              key={option.value}
              style={[
                styles.optionCard,
                isActive && styles.optionCardActive,
                index === LANGUAGE_OPTIONS.length - 1 && styles.optionCardLast,
              ]}
              onPress={() => onSelectLanguage(option.value)}
              accessibilityRole="button"
              accessibilityLabel={option.label}
            >
              <View style={styles.optionContent}>
                <View style={styles.flagBadge}>
                  <Text style={styles.flagText}>{option.flag}</Text>
                </View>

                <Text style={styles.optionLabel}>{option.label}</Text>
              </View>

              {isActive ? <View style={styles.activeAccent} /> : null}
            </Pressable>
          );
        })}
      </View>
    </SettingsSheetModal>
  );
};

const styles = StyleSheet.create({
  body: {
    minHeight: 288,
    paddingBottom: 4,
  },
  optionCard: {
    position: 'relative',
    minHeight: 74,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#C9D7E8',
    backgroundColor: Color.bg,
    marginBottom: 18,
    overflow: 'hidden',
  },
  optionCardActive: {
    borderColor: '#D8E3F2',
  },
  optionCardLast: {
    marginBottom: 0,
  },
  optionContent: {
    minHeight: 74,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 18,
  },
  flagBadge: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.bg,
  },
  flagText: {
    fontSize: 28,
    lineHeight: 30,
  },
  optionLabel: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_14,
    color: Color.text,
  },
  activeAccent: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 5,
    backgroundColor: '#0B663B',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
});

export default ChangeLanguageModal;
