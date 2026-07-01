import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { AnimatePresence, MotiView } from 'moti';
import { FontFamily, FontSize, Padding, Border, Gap } from '../../constants/GlobalStyles';
import { useTheme } from "@/contexts/ThemeContext";

interface ZenmodeBannerProps {
  isEnabled: boolean;
  onToggle: (value: boolean) => void;
}

export default function ZenmodeBanner({ isEnabled, onToggle }: ZenmodeBannerProps) {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  return (
    <View style={styles.zenContainer}>
      <View style={styles.zenBanner}>
        <View>
          <Text style={styles.zenTitle}>Zenmode</Text>
          <Text style={styles.zenSubtitle}>Chế độ tập trung</Text>
        </View>
        <Switch
          trackColor={{ false: '#E2E8F0', true: colors.purple }}
          thumbColor={isEnabled ? colors.background : '#f4f3f4'}
          ios_backgroundColor="#E2E8F0"
          onValueChange={onToggle}
          value={isEnabled}
        />
      </View>
      <AnimatePresence>
        {!isEnabled && (
          <MotiView
            from={{ opacity: 0, translateY: -10 }}
            animate={{ opacity: 1, translateY: 0 }}
            exit={{ opacity: 0, translateY: -10 }}
            transition={{ type: 'timing', duration: 300 }}
          >
            <View style={styles.zenExplainer}>
              <Text style={styles.zenExplainerText}>
                Bật chế độ tập trung ứng dụng sẽ yêu cầu bạn kiểm tra môi trường và tiếng ồn xung quanh... Đồng chặn thông báo xuất hiện làm bạn khó chịu.
              </Text>
            </View>
          </MotiView>
        )}
      </AnimatePresence>
    </View>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  zenContainer: {
    width: '100%',
    marginBottom: Gap.gap_20,
    borderRadius: Border.br_15,
    overflow: 'hidden',
    backgroundColor: colors.vang
  },
  zenBanner: {
    backgroundColor: colors.purplePastel,
    padding: Padding.padding_15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: Border.br_15,
  },
  zenExplainer: { backgroundColor: colors.vang, padding: Padding.padding_15 },
  zenExplainerText: { fontFamily: FontFamily.lexendDecaRegular, fontSize: FontSize.fs_12, color: colors.textPrimary, lineHeight: 18 },
  zenTitle: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_16, color: colors.purple },
  zenSubtitle: { fontFamily: FontFamily.lexendDecaRegular, fontSize: FontSize.fs_12, color: '#334155' },
});