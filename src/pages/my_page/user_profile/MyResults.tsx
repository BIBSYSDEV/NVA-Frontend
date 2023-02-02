import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Box, Box as div, CircularProgress, TablePagination, Typography } from '@mui/material';
import { RootState } from '../../../redux/store';
import { ContributorFieldNames, SpecificContributorFieldNames } from '../../../types/publicationFieldNames';
import { ROWS_PER_PAGE_OPTIONS } from '../../../utils/constants';
import { useSearchRegistrations } from '../../../utils/hooks/useSearchRegistrations';
import { ExpressionStatement } from '../../../utils/searchHelpers';
import { RegistrationSearchResults } from '../../search/registration_search/RegistrationSearchResults';

export const MyResults = () => {
  const { t } = useTranslation();

  const personId = useSelector((store: RootState) => store.user?.cristinId) ?? '';

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[0]);

  const [registrations, isLoadingRegistrations] = useSearchRegistrations(
    {
      properties: [
        {
          fieldName: `${ContributorFieldNames.Contributors}.${SpecificContributorFieldNames.Id}`,
          value: personId,
          operator: ExpressionStatement.Contains,
        },
      ],
    },
    rowsPerPage,
    rowsPerPage * page
  );

  return (
    <>
      {isLoadingRegistrations ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          <CircularProgress />
        </Box>
      ) : (
        <div>
          <Typography id="registration-label" variant="h2" gutterBottom>
            {t('my_page.my_profile.my_research_results')}
          </Typography>
          {registrations && registrations.size > 0 ? (
            <>
              <RegistrationSearchResults searchResult={registrations} />
              <TablePagination
                rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
                component="div"
                count={registrations.size}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(_, newPage) => setPage(newPage)}
                onRowsPerPageChange={(event) => {
                  setRowsPerPage(+event.target.value);
                  setPage(0);
                }}
              />
            </>
          ) : (
            <Typography>{t('common.no_hits')}</Typography>
          )}
        </div>
      )}
    </>
  );
};
