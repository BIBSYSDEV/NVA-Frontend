import SearchIcon from '@mui/icons-material/Search';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { useQuery } from '@tanstack/react-query';
import { useFormikContext } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { apiRequest } from '../../../../api/apiRequest';
import { PersonSearchParams, searchForPerson } from '../../../../api/cristinApi';
import { ListPagination } from '../../../../components/ListPagination';
import { ListSkeleton } from '../../../../components/ListSkeleton';
import { setNotification } from '../../../../redux/notificationSlice';
import { RootState } from '../../../../redux/store';
import { ContributorRole } from '../../../../types/contributor.types';
import { Registration } from '../../../../types/registration.types';
import { CristinPerson } from '../../../../types/user.types';
import { ROWS_PER_PAGE_OPTIONS, isErrorStatus, isSuccessStatus } from '../../../../utils/constants';
import { dataTestId } from '../../../../utils/dataTestIds';
import { useDebounce } from '../../../../utils/hooks/useDebounce';
import { CristinPersonTableRow } from './AddContributorTableRow';

interface AddContributorFormProps {
  addContributor: (selectedUser: CristinPerson) => void;
  openAddUnverifiedContributor: () => void;
  initialSearchTerm?: string;
  roleToAdd: ContributorRole;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export const AddContributorForm = ({
  addContributor,
  openAddUnverifiedContributor,
  initialSearchTerm,
  searchTerm,
  setSearchTerm,
}: AddContributorFormProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const user = useSelector((store: RootState) => store.user);

  const [isAddingSelf, setIsAddingSelf] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<CristinPerson>();
  const debouncedSearchTerm = useDebounce(searchTerm);

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[0]);

  const personQueryParams: PersonSearchParams = {
    name: debouncedSearchTerm,
  };
  const personQuery = useQuery({
    enabled: debouncedSearchTerm.length > 0,
    queryKey: ['person', rowsPerPage, page, personQueryParams],
    queryFn: () => searchForPerson(rowsPerPage, page, personQueryParams),
    meta: { errorMessage: t('feedback.error.search') },
  });

  const userSearch = personQuery.data?.hits ?? [];

  const { values } = useFormikContext<Registration>();
  const contributors = values.entityDescription?.contributors ?? [];

  const isSelfAdded = user?.cristinId && contributors.some((contributor) => contributor.identity.id === user.cristinId);

  const addSelfAsContributor = async () => {
    if (user?.cristinId) {
      setIsAddingSelf(true);
      const getCurrentPersonResponse = await apiRequest<CristinPerson>({ url: user.cristinId });
      if (isErrorStatus(getCurrentPersonResponse.status)) {
        dispatch(setNotification({ message: t('feedback.error.add_contributor'), variant: 'error' }));
      } else if (isSuccessStatus(getCurrentPersonResponse.status)) {
        addContributor(getCurrentPersonResponse.data);
      }
      setIsAddingSelf(false);
    }
  };

  return (
    <>
      {initialSearchTerm && (
        <Typography variant="subtitle1">
          {t('registration.contributors.prefilled_name')}: <b>{initialSearchTerm}</b>
        </Typography>
      )}
      <TextField
        type="search"
        data-testid={dataTestId.registrationWizard.contributors.searchField}
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(event) => {
          setSearchTerm(event.target.value);
          if (page !== 1) {
            setPage(1);
          }
        }}
        placeholder={t('common.search_placeholder')}
        label={t('common.search')}
        InputProps={{
          startAdornment: <SearchIcon />,
        }}
        sx={{ my: '1rem' }}
      />

      {personQuery.isFetching ? (
        <ListSkeleton arrayLength={3} minWidth={100} height={80} />
      ) : userSearch && personQuery.data && personQuery.data.size > 0 && debouncedSearchTerm ? (
        <ListPagination
          count={personQuery.data.size}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={setPage}
          onRowsPerPageChange={(newRowsPerPage) => {
            setRowsPerPage(newRowsPerPage);
            setPage(1);
          }}
          showPaginationTop>
          <TableContainer component={Paper} sx={{ my: '0.5rem' }} elevation={3}>
            <Table size="medium">
              <caption style={visuallyHidden}>{t('search.persons')}</caption>
              <TableHead>
                <TableRow>
                  <TableCell width="10%">{t('registration.contributors.select_all')}</TableCell>
                  <TableCell width="20%">{t('common.person')}</TableCell>
                  <TableCell width="45%">{t('my_page.my_profile.heading.affiliations')}</TableCell>
                  <TableCell width="25%">{t('common.result_registrations')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {personQuery.data.hits.map((cristinPerson) => (
                  <CristinPersonTableRow
                    key={cristinPerson.id}
                    cristinPerson={cristinPerson}
                    setSelectedPerson={setSelectedPerson}
                    selectedPerson={selectedPerson}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </ListPagination>
      ) : (
        debouncedSearchTerm && <Typography>{t('common.no_hits')}</Typography>
      )}

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'end',
          gap: '0.5rem',
          mt: '1rem',
        }}>
        {!isSelfAdded && !initialSearchTerm && (
          <LoadingButton
            data-testid={dataTestId.registrationWizard.contributors.addSelfButton}
            onClick={addSelfAsContributor}
            loading={isAddingSelf}>
            {t('registration.contributors.add_self_as_contributor')}
          </LoadingButton>
        )}
        {!initialSearchTerm && (
          <Button
            data-testid={dataTestId.registrationWizard.contributors.addUnverifiedContributorButton}
            onClick={openAddUnverifiedContributor}>
            {t('registration.contributors.contributor_not_found')}
          </Button>
        )}
        <Button
          data-testid={dataTestId.registrationWizard.contributors.selectUserButton}
          disabled={!selectedPerson}
          onClick={() => selectedPerson && addContributor(selectedPerson)}
          size="large"
          variant="contained">
          {initialSearchTerm
            ? t('registration.contributors.verify_contributor')
            : t('registration.contributors.add_contributor')}
        </Button>
      </Box>
    </>
  );
};
