import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useFetchNviInstitutionStatus } from '../../../../api/hooks/useFetchNviStatus';
import { useFetchOrganization } from '../../../../api/hooks/useFetchOrganization';
import { NviStatusTexts } from '../../../../components/nvi/top-view-texts/NviStatusTexts';
import { NviTopTextViewVariant } from '../../../../components/nvi/top-view-texts/top-text-types';
import { RootState } from '../../../../redux/store';
import { useNviCandidatesParams } from '../../../../utils/hooks/useNviCandidatesParams';
import { NviStatusTableRow } from '../../../messages/components/NviStatusTableRow';
import { NviStatusWrapper } from '../../../messages/components/NviStatusWrapper';

export const NviStatusPage = () => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);

  const organizationQuery = useFetchOrganization(user?.topOrgCristinId ?? '');
  const institution = organizationQuery.data;

  const { year } = useNviCandidatesParams();

  const nviStatusQuery = useFetchNviInstitutionStatus(year);
  const nviStatusQueryYearBefore = useFetchNviInstitutionStatus(year - 1);
  const candidateCount = nviStatusQuery.data?.totals.candidateCount;
  const candidateCountYearBefore = nviStatusQueryYearBefore.data?.totals.candidateCount;
  const percentageComparedToYearBefore =
    candidateCount && candidateCountYearBefore
      ? Math.round((candidateCount / candidateCountYearBefore) * 100)
      : undefined;

  return (
    <NviStatusWrapper
      headline={t('tasks.nvi.institution_nvi_status')}
      topView={
        <NviStatusTexts
          variant={NviTopTextViewVariant.Curator}
          isPending={nviStatusQuery.isPending || nviStatusQueryYearBefore.isPending}
          numResults={candidateCount}
          percentageComparedToYearBefore={percentageComparedToYearBefore}
          yearBefore={year - 1}
        />
      }
      exportAcronym={organizationQuery.data?.acronym}
      yearSelector
      visibilitySelector>
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow sx={{ whiteSpace: 'nowrap', bgcolor: 'white' }}>
              <TableCell sx={{ width: '60%' }}>{t('registration.contributors.department')}</TableCell>
              <TableCell align="center">{t('tasks.nvi.status.New')}</TableCell>
              <TableCell align="center">{t('tasks.nvi.status.Pending')}</TableCell>
              <TableCell align="center">{t('tasks.nvi.status.Approved')}</TableCell>
              <TableCell align="center">{t('tasks.nvi.status.Rejected')}</TableCell>
              <TableCell align="center">{t('common.total_number')}</TableCell>
              <TableCell align="center">{t('percentage_controlled')}</TableCell>
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
              <NviStatusTableRow
                organization={institution}
                aggregations={nviStatusQuery.data}
                user={user}
                year={year}
              />
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </NviStatusWrapper>
  );
};
