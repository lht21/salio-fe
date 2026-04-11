import React from 'react';
import { Keyboard, StyleSheet, View } from 'react-native';

import Button from '../Button';
import { CustomInput } from '../CustomInput';
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
        {/* <TextInput
          style={styles.input}
          placeholder="Tên mới"
          placeholderTextColor="#9CA3AF"
          value={newUserName}
          onChangeText={setNewUserName}
          maxLength={50}
          returnKeyType="done"
          onSubmitEditing={Keyboard.dismiss}
          accessibilityLabel="Tên người dùng mới"
        /> */}
        <CustomInput
          placeholder="Tên mới"
          value={newUserName}
          onChangeText={setNewUserName}
          maxLength={50}
        />
        <Button
          title="Lưu"
          variant="Green"
          onPress={handleConfirm}
          style={styles.confirmButton}
          disabled={!newUserName.trim() || newUserName.trim() === currentUserName}
        />
      </View>
    </SettingsSheetModal>
  );
};

const styles = StyleSheet.create({
  body: {
    gap: 16,
    paddingBottom: 16,
  },
  confirmButton: {
    height: 48,
    borderRadius: 37,
    marginVertical: 0,
  },
});

export default ChangeUserNameModal;
