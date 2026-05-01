import React from 'react';
import { View, TextInput, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { MagnifyingGlassIcon } from 'phosphor-react-native';
import { Color, FontFamily, FontSize, Border } from '../constants/GlobalStyles';

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  containerStyle?: StyleProp<ViewStyle>;
}

const SearchBar = ({ placeholder = "Tìm trong Từ vựng yêu thích", value, onChangeText, containerStyle }: SearchBarProps) => {
  return (
    <View style={[styles.searchContainer, containerStyle]}>
      <MagnifyingGlassIcon size={20} color={Color.color || '#64748B'} weight='regular' />
      <TextInput
        style={styles.searchInput}
        placeholder={placeholder}
        placeholderTextColor={Color.gray || '#64748B'}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Border.br_20,
    paddingHorizontal: 15,
    height: 48,
    marginBottom: 20,
    backgroundColor: Color.bg || '#FFFFFF',
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
    color: Color.text || '#1E1E1E',
  },
});

export default SearchBar;