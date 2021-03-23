import { useFormikContext } from 'formik';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Button, TextField, Typography } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import BackgroundDiv from '../../../../components/BackgroundDiv';
import { RootStore } from '../../../../redux/reducers/rootReducer';
import lightTheme from '../../../../themes/lightTheme';
import { Authority } from '../../../../types/authority.types';
import { ContributorRole } from '../../../../types/contributor.types';
import { Registration } from '../../../../types/registration.types';
import useDebounce from '../../../../utils/hooks/useDebounce';
import useFetchAuthorities from '../../../../utils/hooks/useFetchAuthorities';
import AuthorityList from '../../../user/authority/AuthorityList';
import { PageSpinner } from '../../../../components/PageSpinner';

const StyledTextField = styled(TextField)`
  margin-bottom: 1rem;
`;

const StyledBackgroundDiv = styled(BackgroundDiv)`
  padding: 0;
`;

const StyledDialogActions = styled.div`
  display: grid;
  grid-template-areas: 'close create add-self verify';
  justify-content: end;
  gap: 1rem;
  margin-top: 1rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    grid-template-areas: 'add-self verify' 'close create';
    justify-content: center;
  }
`;

const StyledVerifyButton = styled(Button)`
  grid-area: verify;
`;

const StyledCloseButton = styled(Button)`
  grid-area: close;
`;

const StyledCreateButton = styled(Button)`
  grid-area: create;
`;

const StyledAddSelfButton = styled(Button)`
  grid-area: add-self;
`;

interface AddContributorModalContentProps {
  addAuthor: (selectedAuthor: Authority) => void;
  addSelfAsAuthor: () => void;
  handleCloseModal: () => void;
  openNewAuthorModal: () => void;
  contributorRole?: ContributorRole;
  initialSearchTerm?: string;
}

export const AddContributorModalContent = ({
  addAuthor,
  addSelfAsAuthor,
  handleCloseModal,
  openNewAuthorModal,
  contributorRole,
  initialSearchTerm = '',
}: AddContributorModalContentProps) => {
  const { t } = useTranslation('registration');
  const [selectedAuthor, setSelectedAuthor] = useState<Authority | null>(null);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const debouncedSearchTerm = useDebounce(searchTerm);
  const [authorities, isLoadingAuthorities] = useFetchAuthorities(debouncedSearchTerm);
  const user = useSelector((store: RootStore) => store.user);

  const { values } = useFormikContext<Registration>();
  const {
    entityDescription: { contributors },
  } = values;

  const isSelfAddedAsAuthor = contributors.some((contributor) => contributor.identity.id === user?.authority?.id);

  return (
    <StyledBackgroundDiv backgroundColor={lightTheme.palette.background.paper}>
      {initialSearchTerm && (
        <Typography variant="subtitle1">
          {t('registration:contributors.prefilled_name')}: <b>{initialSearchTerm}</b>
        </Typography>
      )}
      <StyledTextField
        id="search"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        autoFocus
        placeholder={t('common:search_placeholder')}
        label={t('common:search')}
        inputProps={{ 'data-testid': 'search-input' }}
        InputProps={{
          startAdornment: <SearchIcon />,
        }}
      />

      {isLoadingAuthorities ? (
        <PageSpinner />
      ) : authorities && authorities.length > 0 && debouncedSearchTerm ? (
        <AuthorityList
          authorities={authorities}
          selectedArpId={selectedAuthor?.id}
          onSelectAuthority={setSelectedAuthor}
          searchTerm={debouncedSearchTerm}
        />
      ) : (
        debouncedSearchTerm && <Typography>{t('common:no_hits')}</Typography>
      )}

      <StyledDialogActions>
        <StyledVerifyButton
          color="secondary"
          data-testid="connect-author-button"
          disabled={!selectedAuthor}
          onClick={() => selectedAuthor && addAuthor(selectedAuthor)}
          size="large"
          variant="contained">
          {initialSearchTerm ? t('contributors.verify_person') : t('common:add')}
        </StyledVerifyButton>
        <StyledCloseButton onClick={handleCloseModal}>{t('common:close')}</StyledCloseButton>
        <StyledCreateButton color="primary" data-testid="button-create-new-author" onClick={openNewAuthorModal}>
          {t('contributors.create_new_author')}
        </StyledCreateButton>
        {!isSelfAddedAsAuthor && (
          <StyledAddSelfButton color="primary" data-testid="button-add-self-author" onClick={addSelfAsAuthor}>
            {contributorRole === ContributorRole.EDITOR
              ? t('contributors.add_self_as_editor')
              : t('contributors.add_self_as_author')}
          </StyledAddSelfButton>
        )}
      </StyledDialogActions>
    </StyledBackgroundDiv>
  );
};
