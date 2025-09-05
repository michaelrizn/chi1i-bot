import { useEffect, useState } from 'react';

interface ServiceWorkerState {
  isSupported: boolean;
  isRegistered: boolean;
  isUpdateAvailable: boolean;
  registration: ServiceWorkerRegistration | null;
}

interface UseServiceWorkerReturn extends ServiceWorkerState {
  register: () => Promise<void>;
  update: () => Promise<void>;
  unregister: () => Promise<void>;
}

export const useServiceWorker = (): UseServiceWorkerReturn => {
  const [state, setState] = useState<ServiceWorkerState>({
    isSupported: 'serviceWorker' in navigator,
    isRegistered: false,
    isUpdateAvailable: false,
    registration: null
  });

  const register = async (): Promise<void> => {
    if (!state.isSupported) {
      console.warn('[SW] Service Worker is not supported');
      return;
    }

    try {
      const registration = await navigator.serviceWorker.register('/chi1i-bot/sw.js', {
        scope: '/chi1i-bot/'
      });

      console.log('[SW] Service Worker registered successfully:', registration);

      setState(prev => ({
        ...prev,
        isRegistered: true,
        registration
      }));

      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          console.log('[SW] New Service Worker found');
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('[SW] New Service Worker installed, update available');
              setState(prev => ({
                ...prev,
                isUpdateAvailable: true
              }));
            }
          });
        }
      });

    } catch (error) {
      console.error('[SW] Service Worker registration failed:', error);
    }
  };

  const update = async (): Promise<void> => {
    if (!state.registration) {
      console.warn('[SW] No Service Worker registration found');
      return;
    }

    try {
      await state.registration.update();
      console.log('[SW] Service Worker update triggered');
      
      if (state.registration.waiting) {
        state.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      }
      
      setState(prev => ({
        ...prev,
        isUpdateAvailable: false
      }));
      
      window.location.reload();
    } catch (error) {
      console.error('[SW] Service Worker update failed:', error);
    }
  };

  const unregister = async (): Promise<void> => {
    if (!state.registration) {
      console.warn('[SW] No Service Worker registration found');
      return;
    }

    try {
      const result = await state.registration.unregister();
      console.log('[SW] Service Worker unregistered:', result);
      
      setState(prev => ({
        ...prev,
        isRegistered: false,
        isUpdateAvailable: false,
        registration: null
      }));
    } catch (error) {
      console.error('[SW] Service Worker unregistration failed:', error);
    }
  };

  useEffect(() => {
    if (state.isSupported) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('[SW] Service Worker controller changed');
        window.location.reload();
      });

      navigator.serviceWorker.getRegistration('/chi1i-bot/')
        .then((registration) => {
          if (registration) {
            console.log('[SW] Existing Service Worker found');
            setState(prev => ({
              ...prev,
              isRegistered: true,
              registration
            }));
          }
        })
        .catch((error) => {
          console.error('[SW] Failed to get Service Worker registration:', error);
        });
    }
  }, [state.isSupported]);

  return {
    ...state,
    register,
    update,
    unregister
  };
};