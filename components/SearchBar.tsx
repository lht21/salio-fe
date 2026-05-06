import React, { useMemo } from 'react';
import { View, TextInput, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { MagnifyingGlassIcon } from 'phosphor-react-native';
import { FontFamily, FontSize, Border } from '../constants/GlobalStyles';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  containerStyle?: StyleProp<ViewStyle>;
}

const SearchBar = ({ placeholder, value, onChangeText, containerStyle }: SearchBarProps) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={[styles.searchContainer, containerStyle]}>
      <MagnifyingGlassIcon size={20} color={colors.color} weight='regular' />
      <TextInput
        style={styles.searchInput}
        placeholder={placeholder || t('vocabulary.search_fav_placeholder', "Tìm trong Từ vựng yêu thích")}
        placeholderTextColor={colors.gray}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Border.br_20,
    paddingHorizontal: 15,
    height: 48,
    marginBottom: 20,
    backgroundColor: colors.bg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 15,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_12 || 12,
    color: colors.text,
  },
});

export default SearchBar;