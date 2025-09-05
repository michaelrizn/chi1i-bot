import { useEffect, useState } from 'react';
import { TelegramWebApp } from '../types';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
}

interface UseTelegramReturn {
  webApp: TelegramWebApp | null;
  user: TelegramUser | null;
  isReady: boolean;
  showMainButton: (text: string, onClick: () => void) => void;
  hideMainButton: () => void;
  showBackButton: (onClick: () => void) => void;
  hideBackButton: () => void;
  hapticFeedback: {
    impact: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
    notification: (type: 'error' | 'success' | 'warning') => void;
    selection: () => void;
  };
  showPopup: (params: {
    title?: string;
    message: string;
    buttons?: Array<{ id?: string; type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive'; text: string }>;
  }) => Promise<string | null>;
  showAlert: (message: string) => Promise<void>;
  showConfirm: (message: string) => Promise<boolean>;
  close: () => void;
}

export const useTelegram = (): UseTelegramReturn => {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    
    if (tg) {
      setWebApp(tg);
      
      tg.ready();
      tg.expand();
      
      if (tg.initDataUnsafe?.user) {
        setUser(tg.initDataUnsafe.user as TelegramUser);
      }
      
      setIsReady(true);
      
      tg.setHeaderColor('#ffffff');
      tg.setBackgroundColor('#ffffff');
      
      tg.MainButton.hide();
      tg.BackButton.hide();
    } else {
      setIsReady(true);
    }
  }, []);

  const showMainButton = (text: string, onClick: () => void) => {
    if (webApp?.MainButton) {
      webApp.MainButton.setText(text);
      webApp.MainButton.onClick(onClick);
      webApp.MainButton.show();
    }
  };

  const hideMainButton = () => {
    if (webApp?.MainButton) {
      webApp.MainButton.hide();
    }
  };

  const showBackButton = (onClick: () => void) => {
    if (webApp?.BackButton) {
      webApp.BackButton.onClick(onClick);
      webApp.BackButton.show();
    }
  };

  const hideBackButton = () => {
    if (webApp?.BackButton) {
      webApp.BackButton.hide();
    }
  };

  const hapticFeedback = {
    impact: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => {
      if (webApp?.HapticFeedback) {
        webApp.HapticFeedback.impactOccurred(style);
      }
    },
    notification: (type: 'error' | 'success' | 'warning') => {
      if (webApp?.HapticFeedback) {
        webApp.HapticFeedback.notificationOccurred(type);
      }
    },
    selection: () => {
      if (webApp?.HapticFeedback) {
        webApp.HapticFeedback.selectionChanged();
      }
    }
  };

  const showPopup = (params: {
    title?: string;
    message: string;
    buttons?: Array<{ id?: string; type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive'; text: string }>;
  }): Promise<string | null> => {
    return new Promise((resolve) => {
      if (webApp?.showPopup) {
        webApp.showPopup(params, (buttonId) => {
          resolve(buttonId);
        });
      } else {
        resolve(null);
      }
    });
  };

  const showAlert = (message: string): Promise<void> => {
    return new Promise((resolve) => {
      if (webApp?.showAlert) {
        webApp.showAlert(message, () => {
          resolve();
        });
      } else {
        alert(message);
        resolve();
      }
    });
  };

  const showConfirm = (message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      if (webApp?.showConfirm) {
        webApp.showConfirm(message, (confirmed) => {
          resolve(confirmed);
        });
      } else {
        resolve(confirm(message));
      }
    });
  };

  const close = () => {
    if (webApp?.close) {
      webApp.close();
    }
  };

  return {
    webApp,
    user,
    isReady,
    showMainButton,
    hideMainButton,
    showBackButton,
    hideBackButton,
    hapticFeedback,
    showPopup,
    showAlert,
    showConfirm,
    close
  };
};