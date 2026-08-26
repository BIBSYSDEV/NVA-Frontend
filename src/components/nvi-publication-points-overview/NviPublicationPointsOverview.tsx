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
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useFetchOrganization } from '../../api/hooks/useFetchOrganization';
import { NviPointsHelperTextModal, NviPointsModalVariant } from '../dialogs/helper-texts/NviPointsHelperTextModal';
import { NviPageLayout } from '../page-layouts/NviPageLayout';
import { HorizontalBox } from '../styled/Wrappers';
import { RootState } from '../../redux/store';
import { useNviCandidatesParams } from '../../utils/hooks/useNviCandidatesParams';
import { useNviInstitutionStatusNumbers } from '../../pages/tasks/nvi/_hooks/useNviInstitutionStatusNumbers';
import { NviPublicationPointsOverviewRow } from './_components/NviPublicationPointsOverviewRow';
import { NviPublicationPointsTexts } from './_components/NviPublicationPointsTexts';

interface NviPublicationPointsOverviewProps {
  /** Whether the candidate counts link to the NVI candidate search (curator context) or render as plain text. */
  linkable?: boolean;
  /** Overrides the default data-testid on the "read more" expand button. */
  testId?: string;
}

/**
 * Shows the NVI publication points status for the logged-in user's own institution
 * ({@link RootState.user.topOrgCristinId}) for the year read from the URL via {@link useNviCandidatesParams}.
 * Reused both by the NVI curator's own page and by the institution editor's page, which differ only in whether
 * the candidate counts are clickable links to the NVI candidate search.
 */
export const NviPublicationPointsOverview = ({ linkable = false, testId }: NviPublicationPointsOverviewProps) => {
  const { t } = useTranslation();

  const user = useSelector((store: RootState) => store.user);
  const organizationQuery = useFetchOrganization(user?.topOrgCristinId ?? '');
  const institution = organizationQuery.data;

  const { year } = useNviCandidatesParams();
  const { numApprovedByAll, publicationPoints, approvedByAllComparedToPreviousYear, statusData, isPending, isError } =
    useNviInstitutionStatusNumbers(year);

  return (
    <NviPageLayout
      headline={t('tasks.nvi.reporting_status_for_publication_points_for_year', { year })}
      exportAcronym={institution?.acronym}
      topView={
        <NviPublicationPointsTexts
          previousYear={year - 1}
          isPending={isPending}
          isError={isError}
          numApprovedByAll={numApprovedByAll}
          publicationPoints={publicationPoints}
          approvedPercentageComparedToPreviousYear={approvedByAllComparedToPreviousYear}
          exportAcronym={institution?.acronym}
          testId={testId}
        />
      }
      yearSelector
      visibilitySelector>
      {year <= 2024 && (
        <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
          {t('imported_data_warning')}
        </Typography>
      )}
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
                  <NviPointsHelperTextModal variant={NviPointsModalVariant.Curator} />
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
              <NviPublicationPointsOverviewRow
                organization={institution}
                statusData={statusData}
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
