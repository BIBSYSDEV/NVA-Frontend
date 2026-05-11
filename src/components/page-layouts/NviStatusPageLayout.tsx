import { Box } from '@mui/material';
import { ReactNode } from 'react';
import { ExportNviPublicationPointsButton } from '../buttons/export-buttons/ExportNviPublicationPointsButton';
import { ExportNviStatusButton } from '../buttons/export-buttons/ExportNviStatusButton';
import { NviInstitutionSearch } from '../filters/nvi/NviInstitutionSearch';
import { NviSectorSelector } from '../filters/nvi/NviSectorSelector';
import { NviVisibilitySelector } from '../filters/nvi/NviVisibilitySelector';
import { NviYearSelector } from '../filters/nvi/NviYearSelector';
import { TasksPageLayout } from './TasksPageLayout';

interface NviStatusPageLayoutProps {
  headline: string;
  headtitle?: string;
  topView?: ReactNode;
  yearSelector?: boolean;
  visibilitySelector?: boolean;
  sectorSelector?: boolean;
  institutionSearch?: boolean;
  exportAcronym?: string;
  exportPublicationPoints?: boolean;
  children?: ReactNode;
}

export const NviStatusPageLayout = ({
  headline,
  headtitle,
  topView,
  yearSelector,
  visibilitySelector,
  sectorSelector,
  institutionSearch,
  exportAcronym,
  exportPublicationPoints,
  children,
}: NviStatusPageLayoutProps) => {
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
    <TasksPageLayout headline={headline} headtitle={headtitle}>
      {topView}
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
    </TasksPageLayout>
  );
};
