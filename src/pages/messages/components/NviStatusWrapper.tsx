import { Box, Typography } from '@mui/material';
import { ReactNode } from 'react';
import { VerticalBox } from '../../../components/styled/Wrappers';
import { NviInstitutionSearch } from './NviInstitutionSearch';
import { NviSectorSelector } from './NviSectorSelector';
import { NviVisibilitySelector } from './NviVisibilitySelector';
import { NviYearSelector } from './NviYearSelector';
import { ExportNviStatusButton } from './ExportNviStatusButton';

interface NviStatusWrapperProps {
  headline: string;
  topView?: ReactNode;
  yearSelector?: boolean;
  visibilitySelector?: boolean;
  sectorSelector?: boolean;
  institutionSearch?: boolean;
  exportAcronym?: string;
  children?: ReactNode;
  disableExportButton?: boolean;
}

export const NviStatusWrapper = ({
  headline,
  topView,
  yearSelector,
  visibilitySelector,
  sectorSelector,
  institutionSearch,
  exportAcronym,
  children,
  disableExportButton = false,
}: NviStatusWrapperProps) => {
  return (
    <VerticalBox sx={{ gap: '1rem', alignItems: 'start' }}>
      <Typography variant="h1" sx={{ mb: '0.5rem' }}>
        {headline}
      </Typography>
      {topView ?? null}
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
        <Box sx={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {yearSelector && <NviYearSelector sx={{ minWidth: '10rem' }} />}
          {sectorSelector && <NviSectorSelector sx={{ minWidth: '15rem' }} />}
          {institutionSearch && <NviInstitutionSearch sx={{ minWidth: '30rem' }} />}
          {visibilitySelector && <NviVisibilitySelector sx={{ minWidth: '15rem' }} />}
        </Box>
        {exportAcronym && <ExportNviStatusButton acronym={exportAcronym} disabled={disableExportButton} />}
      </Box>
      {children}
    </VerticalBox>
  );
};
