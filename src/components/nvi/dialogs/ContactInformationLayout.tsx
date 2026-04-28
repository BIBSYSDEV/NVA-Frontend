import { Typography } from '@mui/material';
import { ReactNode } from 'react';
import { VerticalBox } from '../../styled/Wrappers';

interface ContactInformationProps {
  roleName: string;
  children: ReactNode;
}

export const ContactInformationLayout = ({ roleName, children }: ContactInformationProps) => {
  return (
    <VerticalBox sx={{ gap: '0.5rem' }}>
      <Typography sx={{ fontWeight: 'bold', fontSize: '16px' }}>{roleName}</Typography>
      {children}
    </VerticalBox>
  );
};
