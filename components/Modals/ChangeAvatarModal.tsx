import { Image, Pressable, StyleSheet, Text, View, Modal } from 'react-native';

import { AvatarPreset } from '../../constants/avatarPresets';
import { Color, FontFamily, FontSize, Border, Padding, Gap } from '../../constants/GlobalStyles';
import Button from '../Button';
import CloseButton from '../CloseButton';

export type ChangeAvatarModalProps = {
  visible: boolean;
  selectedAvatarId: string;
  avatarOptions: AvatarPreset[];
  onSelectAvatar: (avatar: AvatarPreset) => void;
  onClose: () => void;
  onUploadPress?: () => void;
};

const ChangeAvatarModal = ({
  visible,
  selectedAvatarId,
  avatarOptions,
  onSelectAvatar,
  onClose,
  onUploadPress,
}: ChangeAvatarModalProps) => {
  const handleUploadPress = () => {
    if (onUploadPress) {
      onUploadPress();
      return;
    }

    console.log('Avatar upload from device is not implemented yet.');
  };

  const avatarRows: AvatarPreset[][] = [];
  for (let index = 0; index < avatarOptions.length; index += 4) {
    avatarRows.push(avatarOptions.slice(index, index + 4));
  }

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
            <Text style={styles.headerTitle}>Thay đổi ảnh đại diện</Text>
            <CloseButton variant="Stroke" onPress={onClose} />
          </View>

          <View style={styles.body}>
            <Button
              title="Tải lên từ thiết bị"
              variant="Green"
              onPress={handleUploadPress}
              style={styles.uploadButton}
            />

            <Text style={styles.sectionLabel}>Hình ảnh có sẵn</Text>

            <View style={styles.gridCard}>
              {avatarRows.map((row, rowIndex) => (
                <View
                  key={`avatar-row-${rowIndex}`}
                  style={[styles.gridRow, rowIndex === avatarRows.length - 1 && styles.gridRowLast]}
                >
                  {row.map((avatar) => {
                    const isSelected = avatar.id === selectedAvatarId;

                    return (
                      <Pressable
                        key={avatar.id}
                        style={styles.avatarButton}
                        onPress={() => onSelectAvatar(avatar)}
                        accessibilityRole="button"
                        accessibilityLabel={avatar.label}
                      >
                        <View style={[styles.avatarFrame, isSelected && styles.avatarFrameSelected]}>
                          <Image source={avatar.imageSource} style={styles.avatarImage} resizeMode="cover" />
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              ))}
            </View>
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
    gap: 0,
    paddingBottom: 10,
  },
  uploadButton: {
    marginTop: 0,
    marginBottom: 14,
    marginHorizontal: 0,
    height: 40,
    borderRadius: 22,
  },
  sectionLabel: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_12,
    color: Color.gray,
    marginBottom: 10,
    marginLeft: 2,
  },
  gridCard: {
    borderWidth: 1.2,
    borderColor: '#7F8B99',
    borderRadius: 28,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: Color.bg,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  gridRowLast: {
    marginBottom: 0,
  },
  avatarButton: {
    width: 62,
    height: 62,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.bg,
  },
  avatarFrame: {
    width: '100%',
    height: '100%',
    borderRadius: 999,
    borderWidth: 1.2,
    borderColor: '#658067',
    padding: 2,
    backgroundColor: Color.bg,
  },
  avatarFrameSelected: {
    borderWidth: 1.6,
    borderColor: '#2F7A4D',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 999,
  },
});

export default ChangeAvatarModal;
