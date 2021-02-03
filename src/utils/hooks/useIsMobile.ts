import { useEffect, useState } from 'react';
import lightTheme from '../../themes/lightTheme';

const useIsMobile = () => {
  const [width, setWidth] = useState(window.innerWidth);
  const isMobile = width < lightTheme.breakpoints.values.md;

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
};

export default useIsMobile;
