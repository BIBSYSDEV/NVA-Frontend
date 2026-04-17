import { Box, Typography } from '@mui/material';
import { ReactNode } from 'react';
import { VerticalBox } from '../styled/Wrappers';
import { ExportNviPublicationPointsButton } from './export-buttons/ExportNviPublicationPointsButton';
import { ExportNviStatusButton } from './export-buttons/ExportNviStatusButton';
import { NviInstitutionSearch } from './filters/NviInstitutionSearch';
import { NviSectorSelector } from './filters/NviSectorSelector';
import { NviVisibilitySelector } from './filters/NviVisibilitySelector';
import { NviYearSelector } from './filters/NviYearSelector';

interface NviStatusWrapperProps {
  headline: string;
  topView?: ReactNode;
  yearSelector?: boolean;
  visibilitySelector?: boolean;
  sectorSelector?: boolean;
  institutionSearch?: boolean;
  exportAcronym?: string;
  exportPublicationPoints?: boolean;
  children?: ReactNode;
}

export const NviPageLayout = ({
  headline,
  topView,
  yearSelector,
  visibilitySelector,
  sectorSelector,
  institutionSearch,
  exportAcronym,
  exportPublicationPoints,
  children,
}: NviStatusWrapperProps) => {
  let exportButton;
  switch (true) {
    case exportPublicationPoints && !!exportAcronym:
      exportButton = <ExportNviPublicationPointsButton acronym={exportAcronym} />;
      break;
    case exportPublicationPoints:
      exportButton = <ExportNviPublicationPointsButton exportAllInstitutions />;
      break;
    default:
      exportButton = <ExportNviStatusButton />;
  }

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
        {exportButton}
      </Box>
      {children}
    </VerticalBox>
  );
};
