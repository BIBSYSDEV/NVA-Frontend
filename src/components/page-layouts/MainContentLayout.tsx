import { Typography } from '@mui/material';
import { ReactNode } from 'react';
import { HeadTitle } from '../HeadTitle';
import { VerticalBox } from '../styled/Wrappers';

interface MainContentLayoutProps {
  headTitle?: string;
  heading?: string;
  children?: ReactNode;
}

export const MainContentLayout = ({ headTitle, heading, children }: MainContentLayoutProps) => {
  return (
    <VerticalBox component="section" sx={{ gap: '1rem' }}>
      <HeadTitle>{headTitle}</HeadTitle>
      {heading && (
        <Typography variant="h1" gutterBottom>
          {heading}
        </Typography>
      )}
      {children}
    </VerticalBox>
  );
};
