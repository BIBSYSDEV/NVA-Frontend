import { Box, Typography } from '@mui/material';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useNviCandidatesParams } from '../../utils/hooks/useNviCandidatesParams';
import { ExportNviPublicationPointsButton } from '../buttons/export-buttons/ExportNviPublicationPointsButton';
import { ExportNviStatusButton } from '../buttons/export-buttons/ExportNviStatusButton';
import { NviInstitutionSearch } from '../filters/nvi/NviInstitutionSearch';
import { NviSectorSelector } from '../filters/nvi/NviSectorSelector';
import { NviVisibilitySelector } from '../filters/nvi/NviVisibilitySelector';
import { NviYearSelector } from '../filters/nvi/NviYearSelector';
import { VerticalBox } from '../styled/Wrappers';

interface NviPageLayoutProps {
  headline: string;
  topView?: ReactNode;
  yearSelector?: boolean;
  showImportedDataWarning?: boolean;
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
  showImportedDataWarning,
  visibilitySelector,
  sectorSelector,
  institutionSearch,
  exportAcronym,
  exportPublicationPoints,
  children,
}: NviPageLayoutProps) => {
  const { t } = useTranslation();
  const { year } = useNviCandidatesParams();
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
        <Box sx={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          {yearSelector && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', maxWidth: '20rem' }}>
              <NviYearSelector sx={{ minWidth: '10rem' }} />
              {showImportedDataWarning && year <= 2024 && (
                <Typography variant="body2">{t('tasks.nvi.imported_data_warning')}</Typography>
              )}
            </Box>
          )}
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
