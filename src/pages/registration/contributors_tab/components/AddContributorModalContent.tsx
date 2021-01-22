import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Button, CircularProgress, TextField, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/AddCircleOutlineSharp';
import SearchIcon from '@material-ui/icons/Search';
import { Authority } from '../../../../types/authority.types';
import AuthorityList from '../../../user/authority/AuthorityList';
import useFetchAuthorities from '../../../../utils/hooks/useFetchAuthorities';
import { StyledProgressWrapper, StyledRightAlignedWrapper } from '../../../../components/styled/Wrappers';
import useDebounce from '../../../../utils/hooks/useDebounce';

const StyledButtonContainer = styled(StyledRightAlignedWrapper)`
  margin: 1rem 0;
`;

const StyledTextField = styled(TextField)`
  margin-bottom: 1rem;
`;

interface AddContributorModalContentProps {
  addAuthor: (selectedAuthor: Authority) => void;
  initialSearchTerm?: string;
}

const AddContributorModalContent = ({ addAuthor, initialSearchTerm = '' }: AddContributorModalContentProps) => {
  const { t } = useTranslation('registration');
  const [selectedAuthor, setSelectedAuthor] = useState<Authority | null>(null);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const debouncedSearchTerm = useDebounce(searchTerm);
  const [authorities, isLoadingAuthorities] = useFetchAuthorities(debouncedSearchTerm);

  return (
    <>
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
      ) : authorities && authorities.length > 0 ? (
        <>
          {debouncedSearchTerm && (
            <AuthorityList
              authorities={authorities}
              selectedArpId={selectedAuthor?.id}
              onSelectAuthority={setSelectedAuthor}
              searchTerm={debouncedSearchTerm}
            />
          )}
          <StyledButtonContainer>
            <Button
              color="secondary"
              startIcon={<AddIcon />}
              data-testid="connect-author-button"
              disabled={!selectedAuthor}
              onClick={() => selectedAuthor && addAuthor(selectedAuthor)}
              size="large"
              variant="contained">
              {t('common:add')}
            </Button>
          </StyledButtonContainer>
        </>
      ) : (
        debouncedSearchTerm && <Typography>{t('common:no_hits')}</Typography>
      )}
    </>
  );
};

export default AddContributorModalContent;
