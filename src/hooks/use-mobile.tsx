import { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const updateState = () => {
      const windowWidth = Dimensions.get('window').width;
      setIsMobile(windowWidth < MOBILE_BREAKPOINT);
    };

    const subscription = Dimensions.addEventListener('change', updateState);
    updateState(); // Initial check

    return () => subscription?.remove();
  }, []);

  return isMobile;
}
