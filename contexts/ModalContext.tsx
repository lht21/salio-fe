import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ConfirmModal } from '../components/ModalResult/ConfirmModal';

interface ModalConfig {
  title: string;
  subtitle?: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  hideCancelButton?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface ModalContextType {
  showModal: (config: ModalConfig) => void;
  hideModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [config, setConfig] = useState<ModalConfig>({ title: '' });

  const showModal = (newConfig: ModalConfig) => {
    setConfig(newConfig);
    setIsVisible(true);
  };

  const hideModal = () => {
    setIsVisible(false);
  };

  const handleConfirm = () => {
    if (config.onConfirm) config.onConfirm();
    hideModal(); // Tự động đóng modal sau khi thực hiện action
  };

  const handleCancel = () => {
    if (config.onCancel) config.onCancel();
    hideModal(); // Tự động đóng modal sau khi thực hiện action
  };

  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {children}
      <ConfirmModal
        isVisible={isVisible}
        title={config.title}
        subtitle={config.subtitle}
        confirmText={config.confirmText}
        cancelText={config.cancelText}
        isDestructive={config.isDestructive}
        hideCancelButton={config.hideCancelButton}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal phải được sử dụng bên trong ModalProvider');
  }
  return context;
};