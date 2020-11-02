import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Button, CircularProgress, Typography } from '@material-ui/core';
import SearchBar from '../../../../components/SearchBar';
import { Authority } from '../../../../types/authority.types';
import AuthorityList from '../../../user/authority/AuthorityList';
import useFetchAuthorities from '../../../../utils/hooks/useFetchAuthorities';
import { StyledProgressWrapper, StyledRightAlignedWrapper } from '../../../../components/styled/Wrappers';

const StyledButtonContainer = styled(StyledRightAlignedWrapper)`
  margin: 1rem 0;
`;

const StyledSubHeading = styled(Typography)`
  margin-bottom: 1rem;
`;

interface AddContributorModalContentProps {
  addAuthor: (selectedAuthor: Authority) => void;
  initialSearchTerm?: string;
}

const AddContributorModalContent: FC<AddContributorModalContentProps> = ({ addAuthor, initialSearchTerm = '' }) => {
  const { t } = useTranslation('registration');
  const [selectedAuthor, setSelectedAuthor] = useState<Authority | null>(null);
  const [authorities, isLoadingAuthorities, handleNewSearchTerm, searchTerm] = useFetchAuthorities(initialSearchTerm);

  return (
    <>
      {initialSearchTerm && (
        <StyledSubHeading variant="h6">
          {t('registration:contributors.prefilled_name')}: {initialSearchTerm}
        </StyledSubHeading>
      )}
      <SearchBar handleSearch={handleNewSearchTerm} resetSearchInput={false} initialSearchTerm={initialSearchTerm} />
      {isLoadingAuthorities ? (
        <StyledProgressWrapper>
          <CircularProgress size={100} />
        </StyledProgressWrapper>
      ) : authorities && authorities.length > 0 ? (
        <>
          {searchTerm && (
            <AuthorityList
              authorities={authorities}
              selectedSystemControlNumber={selectedAuthor?.systemControlNumber}
              onSelectAuthority={setSelectedAuthor}
              searchTerm={searchTerm}
            />
          )}
          <StyledButtonContainer>
            <Button
              color="primary"
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
        searchTerm && <Typography>{t('common:no_hits')}</Typography>
      )}
    </>
  );
};

export default AddContributorModalContent;
