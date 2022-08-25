import { useFormikContext } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, TablePagination, TextField, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { LoadingButton } from '@mui/lab';
import { ListSkeleton } from '../../../../components/ListSkeleton';
import { RootState } from '../../../../redux/store';
import { Registration } from '../../../../types/registration.types';
import { useDebounce } from '../../../../utils/hooks/useDebounce';
import { useFetch } from '../../../../utils/hooks/useFetch';
import { CristinApiPath } from '../../../../api/apiPaths';
import { ContributorRole } from '../../../../types/contributor.types';
import { dataTestId } from '../../../../utils/dataTestIds';
import { SearchResponse } from '../../../../types/common.types';
import { CristinPerson } from '../../../../types/user.types';
import { CristinPersonList } from './CristinPersonList';
import { apiRequest } from '../../../../api/apiRequest';
import { isErrorStatus, isSuccessStatus } from '../../../../utils/constants';
import { setNotification } from '../../../../redux/notificationSlice';

const resultsPerPage = 10;

interface AddContributorFormProps {
  addContributor: (selectedUser: CristinPerson) => void;
  openAddUnverifiedContributor: () => void;
  initialSearchTerm?: string;
  roleToAdd: ContributorRole;
}

export const AddContributorForm = ({
  addContributor,
  openAddUnverifiedContributor,
  initialSearchTerm = '',
  roleToAdd,
}: AddContributorFormProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const user = useSelector((store: RootState) => store.user);

  const [isAddingSelf, setIsAddingSelf] = useState(false);
  const [selectedUser, setSelectedUser] = useState<CristinPerson>();
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const debouncedSearchTerm = useDebounce(searchTerm);

  const [page, setPage] = useState(0);

  const [userSearch, isLoadingUserSearch] = useFetch<SearchResponse<CristinPerson>>({
    url: debouncedSearchTerm
      ? `${CristinApiPath.Person}?name=${debouncedSearchTerm}&results=${resultsPerPage}&page=${page + 1}`
      : '',
    errorMessage: t('feedback.error.search'),
  });

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
        id="search"
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

      {isLoadingUserSearch ? (
        <ListSkeleton arrayLength={3} minWidth={100} height={80} />
      ) : userSearch && userSearch.size > 0 && debouncedSearchTerm ? (
        <>
          <CristinPersonList
            personSearch={userSearch}
            userId={selectedUser?.id}
            onSelectContributor={setSelectedUser}
            searchTerm={debouncedSearchTerm}
          />
          <TablePagination
            rowsPerPageOptions={[resultsPerPage]}
            component="div"
            count={userSearch.size}
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
            {t('registration.contributors.add_self_as_role', {
              role: t(`registration.contributors.types.${roleToAdd}`),
            })}
          </LoadingButton>
        )}
        {!initialSearchTerm && (
          <Button
            data-testid={dataTestId.registrationWizard.contributors.addUnverifiedContributorButton}
            onClick={openAddUnverifiedContributor}>
            {t('registration.contributors.user_not_found')}
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
            : t('common.add_custom', {
                name: t(`registration.contributors.types.${roleToAdd}`),
              })}
        </Button>
      </Box>
    </>
  );
};
