import { useFormikContext } from 'formik';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Button, TextField, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { BackgroundDiv } from '../../../../components/BackgroundDiv';
import { ListSkeleton } from '../../../../components/ListSkeleton';
import { RootStore } from '../../../../redux/reducers/rootReducer';
import { lightTheme } from '../../../../themes/lightTheme';
import { Authority } from '../../../../types/authority.types';
import { Registration } from '../../../../types/registration.types';
import { useDebounce } from '../../../../utils/hooks/useDebounce';
import { AuthorityList } from '../../../user/authority/AuthorityList';
import { getCreateContributorText, getAddSelfAsContributorText } from '../../../../utils/translation-helpers';
import { useFetch } from '../../../../utils/hooks/useFetch';
import { AuthorityApiPath } from '../../../../api/apiPaths';

const StyledTextField = styled(TextField)`
  margin-bottom: 1rem;
`;

const StyledBackgroundDiv = styled(BackgroundDiv)`
  padding: 0;
`;

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
  handleCloseModal: () => void;
  openNewContributorModal: () => void;
  contributorRole: string;
  initialSearchTerm?: string;
}

export const AddContributorModalContent = ({
  addContributor,
  addSelfAsContributor,
  handleCloseModal,
  openNewContributorModal,
  contributorRole,
  initialSearchTerm = '',
}: AddContributorModalContentProps) => {
  const { t } = useTranslation('registration');
  const [selectedAuthority, setSelectedAuthority] = useState<Authority | null>(null);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const debouncedSearchTerm = useDebounce(searchTerm);
  const [authorities, isLoadingAuthorities] = useFetch<Authority[]>({
    url: searchTerm ? `${AuthorityApiPath.Person}?name=${encodeURIComponent(debouncedSearchTerm)}` : '',
    errorMessage: t('feedback:error.get_authorities'),
  });

  const user = useSelector((store: RootStore) => store.user);

  const { values } = useFormikContext<Registration>();
  const { entityDescription } = values;
  const contributors = entityDescription?.contributors ?? [];

  const isSelfAdded = contributors.some((contributor) => contributor.identity.id === user?.authority?.id);

  return (
    <StyledBackgroundDiv backgroundColor={lightTheme.palette.background.paper}>
      {initialSearchTerm && (
        <Typography variant="subtitle1">
          {t('registration:contributors.prefilled_name')}: <b>{initialSearchTerm}</b>
        </Typography>
      )}
      <StyledTextField
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
          color="secondary"
          data-testid="connect-author-button"
          disabled={!selectedAuthority}
          onClick={() => selectedAuthority && addContributor(selectedAuthority)}
          size="large"
          variant="contained">
          {initialSearchTerm ? t('contributors.verify_person') : t('common:add')}
        </StyledVerifyButton>
        <StyledCreateButton color="primary" data-testid="button-create-new-author" onClick={openNewContributorModal}>
          {getCreateContributorText(contributorRole)}
        </StyledCreateButton>
        {!isSelfAdded && !initialSearchTerm && (
          <StyledAddSelfButton color="primary" data-testid="button-add-self-author" onClick={addSelfAsContributor}>
            {getAddSelfAsContributorText(contributorRole)}
          </StyledAddSelfButton>
        )}
      </StyledDialogActions>
    </StyledBackgroundDiv>
  );
};
