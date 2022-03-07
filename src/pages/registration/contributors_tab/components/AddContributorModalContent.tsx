import { useFormikContext } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Box, Button, TextField, Typography } from '@mui/material';
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

interface AddContributorModalContentProps {
  addContributor: (selectedUser: CristinUser) => void;
  addSelfAsContributor?: () => void;
  openNewContributorModal: () => void;
  initialSearchTerm?: string;
  roleToAdd: ContributorRole;
}

export const AddContributorModalContent = ({
  addContributor,
  addSelfAsContributor,
  openNewContributorModal,
  initialSearchTerm = '',
  roleToAdd,
}: AddContributorModalContentProps) => {
  const { t } = useTranslation('registration');
  const [selectedUser, setSelectedUser] = useState<CristinUser | null>(null);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const debouncedSearchTerm = useDebounce(searchTerm);
  const [userSearch, isLoadingUserSearch] = useFetch<SearchResponse<CristinUser>>({
    url: debouncedSearchTerm
      ? `${CristinApiPath.Person}?query=${encodeURIComponent(debouncedSearchTerm)}&results=10`
      : '',
    errorMessage: t('feedback:error.get_authorities'),
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
        onChange={(event) => setSearchTerm(event.target.value)}
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
        <CristinPersonList
          personSearch={userSearch}
          selectedArpId={selectedUser?.id}
          onSelectContributor={setSelectedUser}
          searchTerm={debouncedSearchTerm}
        />
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
          <Button data-testid="button-add-self-author" onClick={addSelfAsContributor}>
            {t('contributors.add_self_as_role', { role: t(`contributors.types.${roleToAdd}`) })}
          </Button>
        )}
        <Button data-testid="button-create-new-author" onClick={openNewContributorModal}>
          {t('contributors.create_new_with_role', { role: t(`contributors.types.${roleToAdd}`) })}
        </Button>
        <Button
          data-testid={dataTestId.registrationWizard.contributors.connectAuthorButton}
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
