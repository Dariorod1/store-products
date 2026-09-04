import { useEffect, useRef } from 'react';

/**
 * Custom hook to intercept the mobile hardware/browser Back button (`popstate`)
 * so pressing Back closes the modal/drawer instead of leaving the website.
 */
export const useBackHandler = (isOpen, onClose) => {
  const isPushedRef = useRef(false);

  useEffect(() => {
    if (!isOpen) return;

    // Push dummy history entry when modal opens
    window.history.pushState({ modalOpen: true }, '');
    isPushedRef.current = true;

    const handlePopState = () => {
      isPushedRef.current = false;
      if (onClose) {
        onClose();
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      // Clean up history entry if modal was closed via UI button (X / Cancel / Backdrop)
      if (isPushedRef.current) {
        isPushedRef.current = false;
        try {
          window.history.back();
        } catch (e) {
          console.log('History back cleanup error:', e);
        }
      }
    };
  }, [isOpen, onClose]);
};
