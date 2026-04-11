import { StyleSheet, Text, View } from 'react-native';

import { Color, FontFamily, FontSize, Gap } from '../../constants/GlobalStyles';
import Button from '../Button';
import CenteredModalCard from './CenteredModalCard';

export type CancelAutoRenewModalProps = {
  visible: boolean;
  onConfirmCancel: () => void;
  onClose: () => void;
};

const CancelAutoRenewModal = ({
  visible,
  onConfirmCancel,
  onClose,
}: CancelAutoRenewModalProps) => {
  return (
    <CenteredModalCard visible={visible} onRequestClose={onClose}>
      <Text style={styles.title}>Sắp chia tay rồi sao?</Text>
      <Text style={styles.description}>
        Nếu hủy gia hạn, hành trình học tiếng Hàn của bạn có thể bị gián đoạn đó 😢
      </Text>

      <View style={styles.actionRow}>
        <Button
          title="Tiếp tục học"
          variant="Outline"
          onPress={onClose}
          style={styles.keepButton}
          textStyle={styles.keepText}
        />

        <Button
          title="Vẫn hủy"
          variant="Orange"
          onPress={onConfirmCancel}
          style={styles.cancelButton}
          textStyle={styles.cancelText}
        />
      </View>
    </CenteredModalCard>
  );
};

const styles = StyleSheet.create({
  title: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_24,
    lineHeight: 34,
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
  keepButton: {
    flex: 1,
    height: 44,
    marginVertical: 0,
    borderRadius: 37,
    borderColor: Color.green,
    paddingHorizontal: 10,
  },
  cancelButton: {
    flex: 1,
    height: 44,
    marginVertical: 0,
    borderRadius: 37,
    backgroundColor: '#B40000',
    paddingHorizontal: 10,
  },
  keepText: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: 15,
    color: Color.green,
  },
  cancelText: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: 15,
    color: '#FFFFFF',
  },
});

export default CancelAutoRenewModal;
