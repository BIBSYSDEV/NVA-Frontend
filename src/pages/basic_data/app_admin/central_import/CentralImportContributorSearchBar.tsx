import SearchIcon from '@mui/icons-material/Search';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchForPerson } from '../../../../api/hooks/useSearchForPerson';
import { ContributorName } from '../../../../components/ContributorName';
import { OrganizationBox } from '../../../../components/institution/OrganizationBox';
import { ListPagination } from '../../../../components/ListPagination';
import { ListSkeleton } from '../../../../components/ListSkeleton';
import { Contributor } from '../../../../types/contributor.types';
import { dataTestId } from '../../../../utils/dataTestIds';
import { getFullCristinName } from '../../../../utils/user-helpers';

interface CentralImportContributorSearchBarProps {
  contributor: Contributor;
  isExpanded: string | boolean;
}

export const CentralImportContributorSearchBar = ({
  contributor,
  isExpanded,
}: CentralImportContributorSearchBarProps) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState(contributor.identity.name);
  const [submittedSearchTerm, setSubmittedSearchTerm] = useState(searchTerm);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const personQuery = useSearchForPerson({
    enabled: !!isExpanded,
    name: submittedSearchTerm,
    results: rowsPerPage,
    page,
  });
  const userSearch = personQuery.data?.hits ?? [];

  const handleSearch = () => {
    setSubmittedSearchTerm(searchTerm);
    personQuery.refetch();
  };

  return (
    <>
      <TextField
        type="search"
        data-testid={dataTestId.registrationWizard.contributors.searchField}
        variant="outlined"
        fullWidth
        onChange={(event) => {
          setSearchTerm(event.target.value);
          if (page !== 1) {
            setPage(1);
          }
        }}
        size="small"
        defaultValue={searchTerm}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="contained"
          color="secondary"
          sx={{ padding: '0.1rem 0.75rem', width: 'fit-content' }}
          data-testid={dataTestId.registrationWizard.contributors.verifyContributorButton(contributor.identity.name)}
          onClick={handleSearch}
          startIcon={<SearchIcon />}>
          {t('basic_data.add_employee.search_for_person')}
        </Button>
        <Button variant="contained" color="tertiary" sx={{ padding: '0.1rem 0.75rem', width: 'fit-content' }}>
          {t('update_name')}
        </Button>
      </Box>

      <Typography>{t('contributor_search_hits', { count: personQuery.data?.size ?? 0 })}</Typography>
      <ListPagination
        count={personQuery.data?.size ?? 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={setPage}
        onRowsPerPageChange={(newRowsPerPage) => {
          setRowsPerPage(newRowsPerPage);
          setPage(1);
        }}>
        {personQuery.isFetching ? (
          <ListSkeleton arrayLength={3} minWidth={100} height={80} />
        ) : userSearch && userSearch.length > 0 ? (
          <>
            {userSearch.map((user, index) => (
              <Box
                key={index}
                sx={{
                  border: '1px solid',
                  borderRadius: '4px',
                  boxShadow: '0px 3px 3px 0px rgba(0, 0, 0, 0.30)',
                  backgroundColor: 'white',
                  height: 'fit-content',
                  p: '0.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}>
                <ContributorName
                  name={getFullCristinName(user.names)}
                  hasVerifiedAffiliation={user.verified ? user.verified : false}
                  id={user.id}
                />
                {user.affiliations.map((affiliation) => (
                  <OrganizationBox key={affiliation.organization} unitUri={affiliation.organization} />
                ))}
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{ padding: '0.1rem 0.75rem', width: 'fit-content', mt: '0.5rem' }}
                  data-testid={dataTestId.registrationWizard.contributors.verifyContributorButton(
                    contributor.identity.name
                  )}>
                  {t('select_person_and_affiliation')}
                </Button>
              </Box>
            ))}
          </>
        ) : (
          submittedSearchTerm && <Typography>{t('common.no_hits')}</Typography>
        )}
      </ListPagination>
    </>
  );
};
