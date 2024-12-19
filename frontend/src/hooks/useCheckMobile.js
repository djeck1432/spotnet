import { useState, useEffect } from 'react';

export const useCheckMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;

      const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;

      const isMobileDevice = mobileRegex.test(userAgent);
      const isMobileWidth = window.innerWidth <= 768;

      setIsMobile(isMobileDevice || isMobileWidth);
    };

    checkMobile();

    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
};
