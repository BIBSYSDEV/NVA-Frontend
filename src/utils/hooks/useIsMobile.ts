import { useEffect, useState } from 'react';
import { mainTheme } from '../../themes/mainTheme';

export const useIsMobile = () => {
  const [width, setWidth] = useState(window.innerWidth);
  const isMobile = width < mainTheme.breakpoints.values.md;

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
};
