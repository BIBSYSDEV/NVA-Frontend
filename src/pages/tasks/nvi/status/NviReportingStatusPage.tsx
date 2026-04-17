import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useFetchNviInstitutionStatus } from '../../../../api/hooks/useFetchNviStatus';
import { useFetchOrganization } from '../../../../api/hooks/useFetchOrganization';
import { NviReportingStatusRow } from '../../../../components/nvi/table/rows/NviReportingStatusRow';
import { VerticalBox } from '../../../../components/styled/Wrappers';
import { CenteredTableCell } from '../../../../components/tables/table-styles';
import { RootState } from '../../../../redux/store';
import { useNviCandidatesParams } from '../../../../utils/hooks/useNviCandidatesParams';
import { NviStatusWrapper } from '../../../messages/components/NviStatusWrapper';

export const NviReportingStatusPage = () => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);

  const organizationQuery = useFetchOrganization(user?.topOrgCristinId ?? '');
  const institution = organizationQuery.data;

  const { year } = useNviCandidatesParams();

  const nviStatusQuery = useFetchNviInstitutionStatus(year);

  return (
    <NviStatusWrapper
      headline={t('tasks.nvi.institution_nvi_status')}
      topView={
        <VerticalBox sx={{ mb: '1rem', gap: '0.5rem' }}>
          <Trans t={t} i18nKey="reporting_status_description" components={[<Typography key="1" />]} />
        </VerticalBox>
      }
      exportAcronym={institution?.acronym}
      yearSelector
      visibilitySelector>
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow sx={{ whiteSpace: 'nowrap' }}>
              <TableCell sx={{ width: '60%' }}>{t('registration.contributors.department')}</TableCell>
              <CenteredTableCell>{t('tasks.nvi.status.New')}</CenteredTableCell>
              <CenteredTableCell>{t('tasks.nvi.status.Pending')}</CenteredTableCell>
              <CenteredTableCell>{t('tasks.nvi.status.Approved')}</CenteredTableCell>
              <CenteredTableCell>{t('tasks.nvi.status.Rejected')}</CenteredTableCell>
              <CenteredTableCell>{t('common.total_number')}</CenteredTableCell>
              <CenteredTableCell>{t('percentage_controlled')}</CenteredTableCell>
              <TableCell>
                {/* HACK: This cell is hidden to make the number of cells in the table header the same as in the table row, where we display an accordion-like arrow to expand or close rows that have subunits */}
                <Box component="span" sx={visuallyHidden}>
                  {t('tasks.nvi.show_subunits')}
                </Box>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {institution && (
              <NviReportingStatusRow
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
