import React, { createContext, useContext, useState } from 'react';
import ConfirmModal, {
  type ConfirmDialogType,
} from '../components/ConfirmModal';
import type { IconName } from '../components/AppIcon';

export type ConfirmOptions = {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: ConfirmDialogType;
  icon?: IconName;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
};

type ConfirmContextType = {
  confirm: (options: ConfirmOptions) => void;
};

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export const ConfirmProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);

  const confirm = (opts: ConfirmOptions) => {
    setOptions(opts);
    setVisible(true);
  };

  const handleCancel = () => {
    if (loading) return;
    setVisible(false);
    options?.onCancel?.();
  };

  const handleConfirm = async () => {
    if (!options?.onConfirm) return;
    try {
      setLoading(true);
      await options.onConfirm();
      setVisible(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {options && (
        <ConfirmModal
          visible={visible}
          title={options.title}
          message={options.message}
          confirmText={options.confirmText}
          cancelText={options.cancelText}
          type={options.type}
          icon={options.icon}
          loading={loading}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </ConfirmContext.Provider>
  );
};

export const useConfirm = (): ConfirmContextType => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }
  return context;
};

export default ConfirmContext;

