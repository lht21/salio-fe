import { Pressable, StyleSheet, Text, View, Modal } from 'react-native';

import { Color, FontFamily, FontSize, Border, Padding, Gap } from '../../constants/GlobalStyles';
import CloseButton from '../CloseButton';

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
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backgroundTouchable} onPress={onClose} />
        <View style={styles.sheetContent}>
          <View style={styles.dragHandle} />

          <View style={styles.header}>
            <Text style={styles.headerTitle}>Ngôn ngữ</Text>
            <CloseButton variant="Stroke" onPress={onClose} />
          </View>

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
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.4)', justifyContent: 'flex-end' },
  backgroundTouchable: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 },
  sheetContent: { backgroundColor: Color.bg, borderTopLeftRadius: Border.br_30, borderTopRightRadius: Border.br_30, paddingHorizontal: Padding.padding_20, paddingTop: Padding.padding_15, paddingBottom: 40 },
  dragHandle: { width: 40, height: 5, borderRadius: 3, backgroundColor: '#CBD5E1', alignSelf: 'center', marginBottom: Gap.gap_15 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Gap.gap_20 },
  headerTitle: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_16, color: Color.text },
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
