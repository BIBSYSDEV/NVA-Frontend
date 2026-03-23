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
import { useFetchNviInstitutionStatus } from '../../../api/hooks/useFetchNviStatus';
import { useFetchOrganization } from '../../../api/hooks/useFetchOrganization';
import { VerticalBox } from '../../../components/styled/Wrappers';
import { RootState } from '../../../redux/store';
import { useNviCandidatesParams } from '../../../utils/hooks/useNviCandidatesParams';
import { NviStatusTableRow } from './NviStatusTableRow';
import { NviStatusWrapper } from './NviStatusWrapper';

export const NviStatusPage = () => {
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
