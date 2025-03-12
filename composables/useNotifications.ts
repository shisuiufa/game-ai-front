import type { Notification } from '#ui/types';

export enum NotificationIcon {
  Success = 'i-heroicons-check-badge',
  Error = 'i-heroicons-exclamation-circle',
}

export const useNotifications = () => {
  const toast = useToast();

  const notifySuccess = (params?: Partial<Notification>) => {
    toast.add({
      title: params?.title ?? 'Success!',
      icon: NotificationIcon.Success,
      color: 'primary',
      description: params?.description,
    });
  };

  const notifyError = (params?: Partial<Notification>) => {
    toast.add({
      title: params?.title ?? 'Error!',
      icon: NotificationIcon.Error,
      color: 'red',
      description: params?.description,
    });
  };

  return {
    toast,
    notifySuccess,
    notifyError,
  };
};
