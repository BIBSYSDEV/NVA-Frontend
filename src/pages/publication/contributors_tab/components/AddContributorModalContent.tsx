import React, { FC, useCallback, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { Button } from '@material-ui/core';

import { getAuthorities } from '../../../../api/authorityApi';
import Label from '../../../../components/Label';
import Progress from '../../../../components/Progress';
import SearchBar from '../../../../components/SearchBar';
import { setNotification } from '../../../../redux/actions/notificationActions';
import { Authority } from '../../../../types/authority.types';
import { debounce } from '../../../../utils/debounce';
import AuthorityCard from '../../../user/authority/AuthorityCard';
import NormalText from '../../../../components/NormalText';
import { NotificationVariant } from '../../../../types/notification.types';

const StyledClickableDiv = styled.div`
  cursor: pointer;
  align-items: center;
  background-color: ${({ theme }) => theme.palette.box.main};
  padding-right: 0.5rem;
`;

const StyledButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
`;

const StyledProgressContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 2rem;
`;

const StyledLabel = styled(Label)`
  padding: 0.5rem;
`;

interface SearchSummary {
  isLoading: boolean;
  searchTerm: string;
  results: number;
}

interface AddContributorModalContentProps {
  addAuthor: (selectedAuthor: Authority) => void;
  initialSearchTerm?: string;
}

const AddContributorModalContent: FC<AddContributorModalContentProps> = ({ addAuthor, initialSearchTerm = '' }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation('publication');

  const [matchingAuthorities, setMatchingAuthorities] = useState<Authority[]>([]);
  const [selectedAuthor, setSelectedAuthor] = useState<Authority | null>(null);
  const [searchSummary, setSearchSummary] = useState<SearchSummary>({
    isLoading: false,
    searchTerm: '',
    results: 0,
  });

  const search = useCallback(
    debounce(async (searchTerm: string) => {
      setSearchSummary({ isLoading: true, searchTerm, results: 0 });
      const response = await getAuthorities(searchTerm, dispatch);
      if (response) {
        setMatchingAuthorities(response);
        setSearchSummary({ isLoading: false, searchTerm, results: response.length });
      } else {
        dispatch(setNotification(t('feedback:error.get_authorities'), NotificationVariant.Error));
      }
    }),
    [dispatch, t]
  );

  useEffect(() => {
    // Trigger search if initialSearchTerm is given
    if (initialSearchTerm) {
      search(initialSearchTerm);
    }
  }, [search, initialSearchTerm]);

  const handleSearch = async (searchTerm: string) => {
    if (searchTerm.length) {
      search(searchTerm);
    }
  };

  return (
    <>
      <SearchBar handleSearch={handleSearch} resetSearchInput={false} initialSearchTerm={initialSearchTerm} />
      {searchSummary.isLoading ? (
        <StyledProgressContainer>
          <Progress size={100} />
        </StyledProgressContainer>
      ) : matchingAuthorities?.length > 0 ? (
        <>
          <StyledLabel>
            {t('profile:authority.search_summary', {
              searchTerm: searchSummary.searchTerm,
              results: searchSummary.results,
            })}
          </StyledLabel>
          {matchingAuthorities?.map((authority) => (
            <StyledClickableDiv
              data-testid="author-radio-button"
              key={authority.systemControlNumber}
              onClick={() => setSelectedAuthor(authority)}>
              <AuthorityCard
                authority={authority}
                isSelected={selectedAuthor?.systemControlNumber === authority.systemControlNumber}
              />
            </StyledClickableDiv>
          ))}
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
        searchSummary.searchTerm && <NormalText>{t('common:no_hits')}</NormalText>
      )}
    </>
  );
};

export default AddContributorModalContent;
