import { Box, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { ReactNode } from 'react';
import { useFetchOrganization } from '../../../api/hooks/useFetchOrganization';
import { RootState } from '../../../redux/store';
import { ExportNviStatusButton } from './ExportNviStatusButton';
import { NviYearSelector } from './NviYearSelector';
import { NviVisibilitySelector } from './NviVisibilitySelector';
import { HorizontalBox, MediumTypography, VerticalBox } from '../../../components/styled/Wrappers';
import { useTranslation } from 'react-i18next';

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
}

export const NviStatusWrapper = ({ children, headline, totalPoints, yearSelector }: NviStatusWrapperProps) => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);
  const organizationQuery = useFetchOrganization(user?.topOrgCristinId ?? '');

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
        <ExportNviStatusButton acronym={organizationQuery.data?.acronym ?? ''} />
      </Box>
      {children}
    </VerticalBox>
  );
};
