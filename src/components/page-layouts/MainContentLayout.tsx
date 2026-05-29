import { SxProps, Theme, Typography } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { ReactNode } from 'react';
import { HeadTitle } from '../HeadTitle';
import { VerticalBox } from '../styled/Wrappers';

interface MainContentLayoutProps {
  headTitle?: string;
  heading?: string;
  hiddenHeading?: boolean;
  sx?: SxProps<Theme>;
  children?: ReactNode;
}

export const MainContentLayout = ({
  headTitle,
  heading,
  hiddenHeading = false,
  sx,
  children,
}: MainContentLayoutProps) => {
  return (
    <VerticalBox component="section" sx={{ gap: '1rem', ...sx }}>
      <HeadTitle>{headTitle}</HeadTitle>
      {heading && (
        <Typography variant="h1" sx={hiddenHeading ? visuallyHidden : {}} gutterBottom>
          {heading}
        </Typography>
      )}
      {children}
    </VerticalBox>
  );
};
