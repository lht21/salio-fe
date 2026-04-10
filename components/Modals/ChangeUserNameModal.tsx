import React from 'react';
import { Keyboard, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Color, FontFamily, FontSize } from '../../constants/GlobalStyles';
import SettingsSheetModal from './SettingsSheetModal';

export type ChangeUserNameModalProps = {
  visible: boolean;
  currentUserName: string;
  onChangeUserName: (newUserName: string) => void;
  onClose: () => void;
};

const ChangeUserNameModal = ({
  visible,
  currentUserName,
  onChangeUserName,
  onClose,
}: ChangeUserNameModalProps) => {
  const [newUserName, setNewUserName] = React.useState(currentUserName);

  React.useEffect(() => {
    if (visible) {
      setNewUserName(currentUserName);
    }
  }, [currentUserName, visible]);

  const handleConfirm = () => {
    const trimmedUserName = newUserName.trim();

    if (!trimmedUserName) {
      return;
    }

    Keyboard.dismiss();
    onChangeUserName(trimmedUserName);
  };

  return (
    <SettingsSheetModal
      visible={visible}
      title="Thay đổi Tên người dùng"
      onClose={onClose}
      showCloseButton
      maxHeight="100%"
      edgeToBottom
      keyboardAware
      expandOnKeyboard
      contentScrollable
    >
      <View style={styles.body}>
        <TextInput
          style={styles.input}
          placeholder="Tên mới"
          placeholderTextColor="#9CA3AF"
          value={newUserName}
          onChangeText={setNewUserName}
          maxLength={50}
          returnKeyType="done"
          onSubmitEditing={Keyboard.dismiss}
          accessibilityLabel="Tên người dùng mới"
        />

        <Pressable
          style={[
            styles.confirmButton,
            !newUserName.trim() && styles.confirmButtonDisabled,
          ]}
          onPress={handleConfirm}
          disabled={!newUserName.trim()}
          accessibilityRole="button"
          accessibilityLabel="Thay đổi"
        >
          <Text style={styles.confirmButtonText}>Thay đổi</Text>
        </Pressable>
      </View>
    </SettingsSheetModal>
  );
};

const styles = StyleSheet.create({
  body: {
    gap: 16,
    paddingBottom: 16,
  },
  input: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#E5EBF5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_14,
    color: Color.text,
  },
  confirmButton: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#4ADE80',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: '#D1D5DB',
    opacity: 0.6,
  },
  confirmButtonText: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_16,
    color: '#FFFFFF',
  },
});

export default ChangeUserNameModal;
