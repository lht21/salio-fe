import { ConfirmModal } from '../ModalResult/ConfirmModal';

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
    <ConfirmModal
      isVisible={visible}
      title="Sắp chia tay rồi sao?"
      subtitle="Nếu hủy gia hạn, hành trình học tiếng Hàn của bạn có thể bị gián đoạn đó 😢"
      confirmText="Vẫn hủy"
      cancelText="Tiếp tục học"
      isDestructive={true}
      onConfirm={onConfirmCancel}
      onCancel={onClose}
    />
  );
};

export default CancelAutoRenewModal;
