import { Box, Typography } from '@mui/material';
import { ReactNode } from 'react';
import { VerticalBox } from '../../../components/styled/Wrappers';
import { ExportNviStatusButton } from './ExportNviStatusButton';
import { NviVisibilitySelector } from './NviVisibilitySelector';
import { NviYearSelector } from './NviYearSelector';

interface NviStatusWrapperProps {
  headline: string;
  topView?: ReactNode;
  yearSelector?: boolean;
  visibilitySelector?: boolean;
  exportAcronym?: string;
  children?: ReactNode;
}

export const NviStatusWrapper = ({
  headline,
  topView,
  yearSelector,
  visibilitySelector,
  exportAcronym,
  children,
}: NviStatusWrapperProps) => {
  return (
    <VerticalBox sx={{ gap: '1rem', alignItems: 'start' }}>
      <Typography variant="h1" sx={{ mb: '0.5rem' }}>
        {headline}
      </Typography>
      {topView ?? null}
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
        <Box sx={{ display: 'flex', gap: '1rem' }}>
          {yearSelector && <NviYearSelector sx={{ minWidth: '10rem' }} />}
          {visibilitySelector && <NviVisibilitySelector sx={{ minWidth: '15rem' }} />}
        </Box>
        {exportAcronym && <ExportNviStatusButton acronym={exportAcronym} />}
      </Box>
      {children}
    </VerticalBox>
  );
};
