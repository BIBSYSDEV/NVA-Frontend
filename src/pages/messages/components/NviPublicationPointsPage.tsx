import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useFetchNviInstitutionStatus } from '../../../api/hooks/useFetchNviStatus';
import { useFetchOrganization } from '../../../api/hooks/useFetchOrganization';
import { NviPublicationPointsTexts } from '../../../components/NviPublicationPointsTexts';
import { HorizontalBox } from '../../../components/styled/Wrappers';
import { RootState } from '../../../redux/store';
import { getDefaultNviYear } from '../../../utils/hooks/useNviCandidatesParams';
import { NviPublicationPointsHelper } from './NviPublicationPointsHelper';
import { NviPublicationPointsTableRow } from './NviPublicationPointsTableRow';
import { NviStatusWrapper } from './NviStatusWrapper';

export const NviPublicationPointsPage = () => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);
  const organizationQuery = useFetchOrganization(user?.topOrgCristinId ?? '');
  const institution = organizationQuery.data;
  const year = getDefaultNviYear();
  const nviStatusQuery = useFetchNviInstitutionStatus(year);
  const aggregations = nviStatusQuery.data;
  const headline = t('tasks.nvi.reporting_status_for_publication_points_for_year', { year: year });

  return (
    <NviStatusWrapper
      headline={headline}
      exportAcronym={organizationQuery.data?.acronym}
      topView={<NviPublicationPointsTexts aggregationsQuery={nviStatusQuery} />}
      visibilitySelector>
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'white' }}>
              <TableCell sx={{ width: '40%' }}>{t('registration.contributors.department')}</TableCell>
              <TableCell align="center">{t('candidates_our_institution_has_approved')}</TableCell>
              <TableCell align="center">{t('tasks.nvi.candidates_pending_verification_by_others')}</TableCell>
              <TableCell align="center">{t('candidates_everyone_has_approved')}</TableCell>
              <TableCell align="center">
                <HorizontalBox sx={{ justifyContent: 'center' }}>
                  {t('points_for_reporting')}
                  <NviPublicationPointsHelper />
                </HorizontalBox>
              </TableCell>
              <TableCell align="center">{t('percentage_approved_by_all')}</TableCell>
              <TableCell>
                {/* This cell is hidden to make the number of cells in the table header the same as in the table row, where we display an accordion-like arrow to expand or close rows that have subunits */}
                <Box component="span" sx={visuallyHidden}>
                  {t('tasks.nvi.show_subunits')}
                </Box>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {institution && (
              <NviPublicationPointsTableRow organization={institution} aggregations={aggregations} year={year} />
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </NviStatusWrapper>
  );
};
