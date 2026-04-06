import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { MagnifyingGlassIcon } from 'phosphor-react-native';
import { Color, FontFamily, FontSize, Border } from '../constants/GlobalStyles';

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
}

const SearchBar = ({ placeholder = "Tìm kiếm", value, onChangeText }: SearchBarProps) => {
  return (
    <View style={styles.searchContainer}>
      <MagnifyingGlassIcon size={20} color={Color.gray || '#64748B'} />
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
    backgroundColor: '#F4F4F4',
    borderRadius: Border.br_30 || 30,
    paddingHorizontal: 15,
    height: 48,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Color.stroke || '#E2E8F0',
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