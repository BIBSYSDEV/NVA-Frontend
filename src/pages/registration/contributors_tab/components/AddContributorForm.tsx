import { useFormikContext } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, TablePagination, TextField, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { LoadingButton } from '@mui/lab';
import { useQuery } from '@tanstack/react-query';
import { ListSkeleton } from '../../../../components/ListSkeleton';
import { RootState } from '../../../../redux/store';
import { Registration } from '../../../../types/registration.types';
import { useDebounce } from '../../../../utils/hooks/useDebounce';
import { ContributorRole } from '../../../../types/contributor.types';
import { dataTestId } from '../../../../utils/dataTestIds';
import { CristinPerson } from '../../../../types/user.types';
import { CristinPersonList } from './CristinPersonList';
import { apiRequest } from '../../../../api/apiRequest';
import { isErrorStatus, isSuccessStatus } from '../../../../utils/constants';
import { setNotification } from '../../../../redux/notificationSlice';
import { searchForPerson } from '../../../../api/cristinApi';

const resultsPerPage = 10;

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
  const [selectedUser, setSelectedUser] = useState<CristinPerson>();
  const debouncedSearchTerm = useDebounce(searchTerm);

  const [page, setPage] = useState(0);

  const personQuery = useQuery({
    enabled: debouncedSearchTerm.length > 0,
    queryKey: ['person', resultsPerPage, page, debouncedSearchTerm],
    queryFn: () => searchForPerson(resultsPerPage, page + 1, debouncedSearchTerm),
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
          if (page !== 0) {
            setPage(0);
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
        <>
          <CristinPersonList
            personSearch={personQuery.data}
            userId={selectedUser?.id}
            onSelectContributor={setSelectedUser}
            searchTerm={debouncedSearchTerm}
          />
          <TablePagination
            rowsPerPageOptions={[resultsPerPage]}
            component="div"
            count={personQuery.data?.size ?? 0}
            rowsPerPage={resultsPerPage}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
          />
        </>
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
          disabled={!selectedUser}
          onClick={() => selectedUser && addContributor(selectedUser)}
          size="large"
          variant="contained">
          {initialSearchTerm
            ? t('registration.contributors.verify_person')
            : t('registration.contributors.add_contributor')}
        </Button>
      </Box>
    </>
  );
};
