import { Box, Typography } from '@mui/material';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { HorizontalBox, MediumTypography, VerticalBox } from '../../../components/styled/Wrappers';
import { ExportNviStatusButton } from './ExportNviStatusButton';
import { NviVisibilitySelector } from './NviVisibilitySelector';
import { NviYearSelector } from './NviYearSelector';

interface TotalPointsObject {
  orgName: string;
  result: number;
  publicationPoints: number;
}

interface NviStatusWrapperProps {
  children?: ReactNode;
  headline: string;
  totalPoints?: TotalPointsObject;
  yearSelector?: boolean;
  exportAcronym?: string;
}

export const NviStatusWrapper = ({
  children,
  headline,
  totalPoints,
  yearSelector,
  exportAcronym,
}: NviStatusWrapperProps) => {
  const { t } = useTranslation();

  return (
    <VerticalBox sx={{ gap: '1rem', alignItems: 'start' }}>
      <Typography variant="h1" sx={{ mb: '0.5rem' }}>
        {headline}
      </Typography>
      {totalPoints && (
        <HorizontalBox sx={{ mb: '0.5rem', gap: '1rem' }}>
          <MediumTypography sx={{ fontWeight: 'bold' }}>
            {t('tasks.nvi.total_for_organization', { orgName: totalPoints.orgName })}
          </MediumTypography>
          <MediumTypography>{t('tasks.nvi.result', { result: totalPoints.result })}</MediumTypography>
          <MediumTypography>
            {t('tasks.nvi.total_publication_points', { publicationPoints: totalPoints.publicationPoints })}
          </MediumTypography>
        </HorizontalBox>
      )}
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
        <Box sx={{ display: 'flex', gap: '1rem' }}>
          {yearSelector && <NviYearSelector sx={{ minWidth: '10rem' }} />}
          <NviVisibilitySelector sx={{ minWidth: '15rem' }} />
        </Box>
        <ExportNviStatusButton acronym={exportAcronym ?? ''} />
      </Box>
      {children}
    </VerticalBox>
  );
};
