import { useFormikContext } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Box, Button, TablePagination, TextField, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { ListSkeleton } from '../../../../components/ListSkeleton';
import { RootStore } from '../../../../redux/reducers/rootReducer';
import { Registration } from '../../../../types/registration.types';
import { useDebounce } from '../../../../utils/hooks/useDebounce';
import { useFetch } from '../../../../utils/hooks/useFetch';
import { CristinApiPath } from '../../../../api/apiPaths';
import { ContributorRole } from '../../../../types/contributor.types';
import { dataTestId } from '../../../../utils/dataTestIds';
import { SearchResponse } from '../../../../types/common.types';
import { CristinUser } from '../../../../types/user.types';
import { CristinPersonList } from './CristinPersonList';

const resultsPerPage = 10;

interface AddContributorFormProps {
  addContributor: (selectedUser: CristinUser) => void;
  addSelfAsContributor?: () => void;
  openAddUnverifiedContributor: () => void;
  initialSearchTerm?: string;
  roleToAdd: ContributorRole;
}

export const AddContributorForm = ({
  addContributor,
  addSelfAsContributor,
  openAddUnverifiedContributor,
  initialSearchTerm = '',
  roleToAdd,
}: AddContributorFormProps) => {
  const { t } = useTranslation('registration');
  const [selectedUser, setSelectedUser] = useState<CristinUser>();
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const debouncedSearchTerm = useDebounce(searchTerm);

  const [page, setPage] = useState(0);

  const [userSearch, isLoadingUserSearch] = useFetch<SearchResponse<CristinUser>>({
    url: debouncedSearchTerm
      ? `${CristinApiPath.Person}?name=${debouncedSearchTerm}&results=${resultsPerPage}&page=${page + 1}`
      : '',
    errorMessage: t('feedback:error.search'),
  });

  const user = useSelector((store: RootStore) => store.user);

  const { values } = useFormikContext<Registration>();
  const contributors = values.entityDescription?.contributors ?? [];

  const isSelfAdded = contributors.some((contributor) => contributor.identity.id === user?.authority?.id);

  return (
    <>
      {initialSearchTerm && (
        <Typography variant="subtitle1">
          {t('registration:contributors.prefilled_name')}: <b>{initialSearchTerm}</b>
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
        autoFocus
        placeholder={t('common:search_placeholder')}
        label={t('common:search')}
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
        debouncedSearchTerm && <Typography>{t('common:no_hits')}</Typography>
      )}

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'end',
          gap: '0.5rem',
          mt: '1rem',
        }}>
        {!isSelfAdded && !initialSearchTerm && addSelfAsContributor && (
          <Button data-testid={dataTestId.registrationWizard.contributors.addSelfButton} onClick={addSelfAsContributor}>
            {t('contributors.add_self_as_role', { role: t(`contributors.types.${roleToAdd}`) })}
          </Button>
        )}
        {!initialSearchTerm && (
          <Button
            data-testid={dataTestId.registrationWizard.contributors.addUnverifiedContributorButton}
            onClick={openAddUnverifiedContributor}>
            {t('contributors.user_not_found')}
          </Button>
        )}
        <Button
          data-testid={dataTestId.registrationWizard.contributors.selectUserButton}
          disabled={!selectedUser}
          onClick={() => selectedUser && addContributor(selectedUser)}
          size="large"
          variant="contained">
          {initialSearchTerm
            ? t('contributors.verify_person')
            : t('common:add_custom', { name: t(`contributors.types.${roleToAdd}`) })}
        </Button>
      </Box>
    </>
  );
};
