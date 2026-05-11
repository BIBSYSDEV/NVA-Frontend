import { Typography } from '@mui/material';
import { ReactNode } from 'react';
import { HeadTitle } from '../HeadTitle';
import { VerticalBox } from '../styled/Wrappers';

interface TasksPageLayoutProps {
  headline: string;
  headtitle?: string;
  children?: ReactNode;
}

export const TasksPageLayout = ({ headline, headtitle, children }: TasksPageLayoutProps) => {
  return (
    <VerticalBox sx={{ gap: '1rem' }}>
      {headtitle && <HeadTitle>{headtitle}</HeadTitle>}
      <Typography variant="h1" sx={{ mb: '0.5rem' }}>
        {headline}
      </Typography>
      {children}
    </VerticalBox>
  );
};
