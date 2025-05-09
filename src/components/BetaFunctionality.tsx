import { Box, BoxProps } from '@mui/material';
import { ReactNode } from 'react';
import { useBetaFlag } from '../utils/hooks/useBetaFlag';

interface BetaFunctionalityProps extends BoxProps {
  children: ReactNode;
}

export const BetaFunctionality = ({ children, ...props }: BetaFunctionalityProps) => {
  const betaEnabled = useBetaFlag();
  return betaEnabled ? (
    <Box sx={{ border: '3px dashed', padding: '0.5rem' }} {...props}>
      {children}
    </Box>
  ) : null;
};
