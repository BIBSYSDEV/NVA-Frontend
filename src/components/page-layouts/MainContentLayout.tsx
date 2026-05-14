import { Typography } from '@mui/material';
import { ReactNode } from 'react';
import { HeadTitle } from '../HeadTitle';
import { VerticalBox } from '../styled/Wrappers';

interface MainContentLayoutProps {
  headtitle?: string;
  headline?: string;
  children?: ReactNode;
}

export const MainContentLayout = ({ headtitle, headline, children }: MainContentLayoutProps) => {
  return (
    <VerticalBox component="section" sx={{ gap: '1rem' }}>
      <HeadTitle>{headtitle}</HeadTitle>
      {headline && (
        <Typography variant="h1" sx={{ mb: '0.5rem' }}>
          {headline}
        </Typography>
      )}
      {children}
    </VerticalBox>
  );
};
