import { StyleSheet, Text, View } from 'react-native';

import { Color, FontFamily, FontSize } from '../../constants/GlobalStyles';
import Button from '../Button';
import CenteredModalCard from './CenteredModalCard';

export type LogoutConfirmModalProps = {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

const LogoutConfirmModal = ({
  visible,
  onConfirm,
  onCancel,
}: LogoutConfirmModalProps) => {
  return (
    <CenteredModalCard visible={visible} onRequestClose={onCancel}>
      <Text style={styles.title}>Rời đi rồi à?</Text>
      <Text style={styles.description}>
        Bạn sẽ cần đăng nhập lại để tiếp tục học nhé.
      </Text>

      <View style={styles.actionRow}>
        <Button
          title="Tiếp tục học"
          variant="Outline"
          onPress={onCancel}
          style={styles.cancelButton}
          textStyle={styles.cancelText}
        />

        <Button
          title="Đăng xuất"
          variant="Orange"
          onPress={onConfirm}
          style={styles.confirmButton}
          textStyle={styles.confirmText}
        />
      </View>
    </CenteredModalCard>
  );
};

const styles = StyleSheet.create({
  title: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_20,
    lineHeight: 30,
    color: Color.text,
  },
  description: {
    marginTop: 10,
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_16,
    lineHeight: 24,
    color: Color.text,
  },
  actionRow: {
    marginTop: 16,
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    height: 42,
    marginVertical: 0,
    borderRadius: 37,
    borderColor: Color.green,
    paddingHorizontal: 10,
  },
  confirmButton: {
    flex: 1,
    height: 42,
    marginVertical: 0,
    borderRadius: 37,
    backgroundColor: '#B40000',
    paddingHorizontal: 10,
  },
  cancelText: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_16,
    color: Color.green,
  },
  confirmText: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_16,
    color: '#FFFFFF',
  },
});

export default LogoutConfirmModal;
