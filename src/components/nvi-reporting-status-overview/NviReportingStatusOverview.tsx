import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useFetchOrganization } from '../../api/hooks/useFetchOrganization';
import { useNviInstitutionStatusNumbers } from '../../pages/tasks/nvi/_hooks/useNviInstitutionStatusNumbers';
import { RootState } from '../../redux/store';
import { useNviCandidatesParams } from '../../utils/hooks/useNviCandidatesParams';
import { NviPageLayout } from '../page-layouts/NviPageLayout';
import { CenteredTableCell } from '../tables/table-styles';
import { NviReportingStatusOverviewRow } from './_components/NviReportingStatusOverviewRow';
import { NviReportingStatusTexts } from './_components/NviReportingStatusTexts';

interface NviReportingStatusOverviewProps {
  /** Whether the candidate counts link to the NVI candidate search (curator context) or render as plain text. */
  linkable?: boolean;
}

/**
 * Shows the NVI reporting status for the logged-in user's own institution
 * ({@link RootState.user.topOrgCristinId}) for the year read from the URL via {@link useNviCandidatesParams}.
 * Reused both by the NVI curator's own page and by the institution editor's page, which differ only in whether
 * the candidate counts are clickable links to the NVI candidate search.
 */
export const NviReportingStatusOverview = ({ linkable = false }: NviReportingStatusOverviewProps) => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);

  const organizationQuery = useFetchOrganization(user?.topOrgCristinId ?? '');
  const institution = organizationQuery.data;

  const { year } = useNviCandidatesParams();
  const { totalResults, percentageComparedToPreviousYear, statusData, isPending, isError } =
    useNviInstitutionStatusNumbers(year);

  return (
    <NviPageLayout
      headline={t('reporting_status')}
      topView={
        <NviReportingStatusTexts
          totalResults={totalResults}
          percentage={percentageComparedToPreviousYear}
          previousYear={year - 1}
          isError={isError}
          isPending={isPending}
        />
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
              <NviReportingStatusOverviewRow
                organization={institution}
                aggregations={statusData}
                user={user}
                year={year}
                linkable={linkable}
              />
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </NviPageLayout>
  );
};
