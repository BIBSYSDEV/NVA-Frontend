import { Typography } from '@mui/material';
import { ReactNode } from 'react';
import { VerticalBox } from '../../../styled/Wrappers';

interface ContactInformationLayoutProps {
  roleName: string;
  children: ReactNode;
}

export const ContactInformationLayout = ({ roleName, children }: ContactInformationLayoutProps) => {
  return (
    <VerticalBox sx={{ gap: '0.5rem' }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
        {roleName}
      </Typography>
      {children}
    </VerticalBox>
  );
};
