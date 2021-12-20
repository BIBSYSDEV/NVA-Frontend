import { useFormikContext } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Button, TextField, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { ListSkeleton } from '../../../../components/ListSkeleton';
import { RootStore } from '../../../../redux/reducers/rootReducer';
import { Authority } from '../../../../types/authority.types';
import { Registration } from '../../../../types/registration.types';
import { useDebounce } from '../../../../utils/hooks/useDebounce';
import { AuthorityList } from '../../../user/authority/AuthorityList';
import { useFetch } from '../../../../utils/hooks/useFetch';
import { AuthorityApiPath } from '../../../../api/apiPaths';
import { ContributorRole } from '../../../../types/contributor.types';

const StyledDialogActions = styled.div`
  display: grid;
  grid-template-areas: 'create add-self verify';
  justify-content: end;
  gap: 1rem;
  margin-top: 1rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    grid-template-areas: 'add-self verify' 'create';
    justify-content: center;
  }
`;

const StyledVerifyButton = styled(Button)`
  grid-area: verify;
`;

const StyledCreateButton = styled(Button)`
  grid-area: create;
`;

const StyledAddSelfButton = styled(Button)`
  grid-area: add-self;
`;

interface AddContributorModalContentProps {
  addContributor: (selectedAuthority: Authority) => void;
  addSelfAsContributor: () => void;
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
  const [selectedAuthority, setSelectedAuthority] = useState<Authority | null>(null);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const debouncedSearchTerm = useDebounce(searchTerm);
  const [authorities, isLoadingAuthorities] = useFetch<Authority[]>({
    url: debouncedSearchTerm ? `${AuthorityApiPath.Person}?name=${encodeURIComponent(debouncedSearchTerm)}` : '',
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
        data-testid="search-field"
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

      {isLoadingAuthorities ? (
        <ListSkeleton arrayLength={3} minWidth={100} height={80} />
      ) : authorities && authorities.length > 0 && debouncedSearchTerm ? (
        <AuthorityList
          authorities={authorities}
          selectedArpId={selectedAuthority?.id}
          onSelectAuthority={setSelectedAuthority}
          searchTerm={debouncedSearchTerm}
        />
      ) : (
        debouncedSearchTerm && <Typography>{t('common:no_hits')}</Typography>
      )}

      <StyledDialogActions>
        <StyledVerifyButton
          data-testid="connect-author-button"
          disabled={!selectedAuthority}
          onClick={() => selectedAuthority && addContributor(selectedAuthority)}
          size="large"
          variant="contained">
          {initialSearchTerm
            ? t('contributors.verify_person')
            : t('common:add_custom', { name: t(`contributors.types.${roleToAdd}`) })}
        </StyledVerifyButton>
        <StyledCreateButton data-testid="button-create-new-author" onClick={openNewContributorModal}>
          {t('contributors.create_new_with_role', { role: t(`contributors.types.${roleToAdd}`) })}
        </StyledCreateButton>
        {!isSelfAdded && !initialSearchTerm && (
          <StyledAddSelfButton data-testid="button-add-self-author" onClick={addSelfAsContributor}>
            {t('contributors.add_self_as_role', { role: t(`contributors.types.${roleToAdd}`) })}
          </StyledAddSelfButton>
        )}
      </StyledDialogActions>
    </>
  );
};
