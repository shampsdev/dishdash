import { useSignal, viewport } from '@telegram-apps/sdk-react';

export const useSafeArea = () => {
  const safeAreaInsets = useSignal(viewport.safeAreaInsets);

  return { safeAreaInsets };
};
