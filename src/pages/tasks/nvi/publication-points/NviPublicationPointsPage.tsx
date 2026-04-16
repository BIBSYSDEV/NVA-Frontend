import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useFetchOrganization } from '../../../../api/hooks/useFetchOrganization';
import { NviPublicationPointsTexts } from '../../../../components/nvi/top-view-texts/NviPublicationPointsTexts';
import { NviTopTextViewVariant } from '../../../../components/nvi/top-view-texts/top-text-types';
import { HorizontalBox } from '../../../../components/styled/Wrappers';
import { useNviInstitutionStatusNumbers } from '../../../../hooks/nvi/useNviInstitutionStatusNumbers';
import { RootState } from '../../../../redux/store';
import { useNviCandidatesParams } from '../../../../utils/hooks/useNviCandidatesParams';
import { NviPointsModalVariant, NviPointsQuestionIcon } from '../../../messages/components/NviPointsQuestionIcon';
import { NviPublicationPointsTableRow } from '../../../messages/components/NviPublicationPointsTableRow';
import { NviStatusWrapper } from '../../../messages/components/NviStatusWrapper';

export const NviPublicationPointsPage = () => {
  const { t } = useTranslation();

  const user = useSelector((store: RootState) => store.user);
  const organizationQuery = useFetchOrganization(user?.topOrgCristinId ?? '');
  const institution = organizationQuery.data;

  const { year } = useNviCandidatesParams();
  const { aggregations, isPending, isError, percentageApprovedComparedToLastYear } =
    useNviInstitutionStatusNumbers(year);

  return (
    <NviStatusWrapper
      headline={t('tasks.nvi.reporting_status_for_publication_points_for_year', { year: year })}
      exportAcronym={organizationQuery.data?.acronym}
      topView={
        <NviPublicationPointsTexts
          variant={NviTopTextViewVariant.Curator}
          isPending={isPending}
          isError={isError}
          totalCount={aggregations?.totals.globalApprovalStatus.Approved}
          percentageComparedToYearBefore={percentageApprovedComparedToLastYear}
          validPoints={aggregations?.totals.points}
          yearBefore={year - 1}
          exportAcronym={organizationQuery.data?.acronym}
        />
      }
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
                  <NviPointsQuestionIcon variant={NviPointsModalVariant.Curator} />
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
