import { ReactNode } from 'react';
import { Box, BoxProps } from '@mui/material';

interface BetaFunctionalityProps extends BoxProps {
  children: ReactNode;
}

export const BetaFunctionality = ({ children, ...props }: BetaFunctionalityProps) => {
  const betaEnabled = localStorage.getItem('beta') === 'true';
  return betaEnabled ? (
    <Box sx={{ border: '3px dashed', padding: '0.5rem' }} {...props}>
      {children}
    </Box>
  ) : null;
};
