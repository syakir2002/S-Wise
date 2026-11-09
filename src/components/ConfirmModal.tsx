import React from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AppIcon, { type IconName } from './AppIcon';

export type ConfirmDialogType = 'danger' | 'info' | 'success';

export type ConfirmModalProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: ConfirmDialogType;
  icon?: IconName;
  loading?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
};

export default function ConfirmModal({
  visible,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger',
  icon,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const isDanger = type === 'danger';

  const defaultIcon: IconName = isDanger
    ? {
        ios: 'rectangle.portrait.and.arrow.right',
        android: 'logout',
        web: 'logout',
      }
    : { ios: 'info.circle.fill', android: 'info', web: 'info' };

  const activeIcon = icon || defaultIcon;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}
      statusBarTranslucent
    >
      <View style={styles.backdrop}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={loading ? undefined : onCancel}
          accessibilityLabel="Dismiss dialog"
        />

        <View style={styles.card}>
          <View
            style={[
              styles.iconWrapper,
              isDanger ? styles.dangerIconWrapper : styles.infoIconWrapper,
            ]}
          >
            <AppIcon
              name={activeIcon}
              size={24}
              tintColor={isDanger ? '#B8473F' : '#1E2B24'}
            />
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.actionsRow}>
            <Pressable
              accessibilityRole="button"
              disabled={loading}
              onPress={onCancel}
              style={({ pressed }) => [
                styles.cancelButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.cancelButtonText}>{cancelText}</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              disabled={loading}
              onPress={onConfirm}
              style={({ pressed }) => [
                styles.confirmButton,
                isDanger
                  ? styles.dangerConfirmButton
                  : styles.primaryConfirmButton,
                pressed && styles.buttonPressed,
              ]}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.confirmButtonText}>{confirmText}</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(20, 28, 24, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingTop: 28,
    paddingBottom: 22,
    paddingHorizontal: 22,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 12,
  },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  dangerIconWrapper: {
    backgroundColor: '#FDECEB',
  },
  infoIconWrapper: {
    backgroundColor: '#E9F0E3',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E2B24',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: '#7D857E',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  actionsRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#F3F4F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E2B24',
  },
  confirmButton: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dangerConfirmButton: {
    backgroundColor: '#B8473F',
  },
  primaryConfirmButton: {
    backgroundColor: '#1E2B24',
  },
  confirmButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});

