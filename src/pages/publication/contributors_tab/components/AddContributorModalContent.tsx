import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Button, CircularProgress } from '@material-ui/core';
import SearchBar from '../../../../components/SearchBar';
import { Authority } from '../../../../types/authority.types';
import NormalText from '../../../../components/NormalText';
import SubHeading from '../../../../components/SubHeading';
import AuthorityList from '../../../user/authority/AuthorityList';
import useFetchAuthorities from '../../../../utils/hooks/useFetchAuthorities';
import { ProgressWrapper, RightAlignedButtonWrapper } from '../../../../components/styled/Wrappers1';

const StyledButtonContainer = styled(RightAlignedButtonWrapper)`
  margin: 1rem 0;
`;

const StyledSubHeading = styled(SubHeading)`
  margin-bottom: 1rem;
`;

interface AddContributorModalContentProps {
  addAuthor: (selectedAuthor: Authority) => void;
  initialSearchTerm?: string;
}

const AddContributorModalContent: FC<AddContributorModalContentProps> = ({ addAuthor, initialSearchTerm = '' }) => {
  const { t } = useTranslation('publication');
  const [selectedAuthor, setSelectedAuthor] = useState<Authority | null>(null);
  const [authorities, isLoadingAuthorities, handleNewSearchTerm, searchTerm] = useFetchAuthorities(initialSearchTerm);

  return (
    <>
      {initialSearchTerm && (
        <StyledSubHeading>
          {t('publication:contributors.prefilled_name')}: {initialSearchTerm}
        </StyledSubHeading>
      )}
      <SearchBar handleSearch={handleNewSearchTerm} resetSearchInput={false} initialSearchTerm={initialSearchTerm} />
      {isLoadingAuthorities ? (
        <ProgressWrapper>
          <CircularProgress size={100} />
        </ProgressWrapper>
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
        searchTerm && <NormalText>{t('common:no_hits')}</NormalText>
      )}
    </>
  );
};

export default AddContributorModalContent;
