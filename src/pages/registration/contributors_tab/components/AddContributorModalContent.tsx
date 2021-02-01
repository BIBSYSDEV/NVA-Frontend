import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Button, CircularProgress, DialogActions, TextField, Typography } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import BackgroundDiv from '../../../../components/BackgroundDiv';
import { StyledProgressWrapper } from '../../../../components/styled/Wrappers';
import lightTheme from '../../../../themes/lightTheme';
import { Authority } from '../../../../types/authority.types';
import useDebounce from '../../../../utils/hooks/useDebounce';
import useFetchAuthorities from '../../../../utils/hooks/useFetchAuthorities';
import AuthorityList from '../../../user/authority/AuthorityList';

const StyledTextField = styled(TextField)`
  margin-bottom: 1rem;
`;

const StyledBackgroundDiv = styled(BackgroundDiv)`
  padding: 0;
`;

interface AddContributorModalContentProps {
  addAuthor: (selectedAuthor: Authority) => void;
  handleCloseModal: () => void;
  openNewAuthorModal: () => void;
  initialSearchTerm?: string;
}

const AddContributorModalContent = ({
  addAuthor,
  handleCloseModal,
  openNewAuthorModal,
  initialSearchTerm = '',
}: AddContributorModalContentProps) => {
  const { t } = useTranslation('registration');
  const [selectedAuthor, setSelectedAuthor] = useState<Authority | null>(null);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const debouncedSearchTerm = useDebounce(searchTerm);
  const [authorities, isLoadingAuthorities] = useFetchAuthorities(debouncedSearchTerm);

  return (
    <StyledBackgroundDiv backgroundColor={lightTheme.palette.background.paper}>
      {initialSearchTerm && (
        <Typography variant="subtitle1">
          {t('registration:contributors.prefilled_name')}: "{initialSearchTerm}"
        </Typography>
      )}
      <StyledTextField
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
        <StyledProgressWrapper>
          <CircularProgress size={100} />
        </StyledProgressWrapper>
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

      <DialogActions>
        <Button onClick={handleCloseModal}>{t('common:close')}</Button>
        <Button color="primary" data-testid="button-create-new-author" onClick={openNewAuthorModal}>
          {t('contributors.create_new_author')}
        </Button>
        <Button
          color="secondary"
          data-testid="connect-author-button"
          disabled={!selectedAuthor}
          onClick={() => selectedAuthor && addAuthor(selectedAuthor)}
          size="large"
          variant="contained">
          {initialSearchTerm ? t('contributors.verify_person') : t('common:add')}
        </Button>
      </DialogActions>
    </StyledBackgroundDiv>
  );
};

export default AddContributorModalContent;
