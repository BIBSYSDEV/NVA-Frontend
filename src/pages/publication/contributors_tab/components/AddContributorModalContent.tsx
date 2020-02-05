import React, { FC, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { Button, Typography } from '@material-ui/core';

import { getAuthorities } from '../../../../api/authorityApi';
import SearchBar from '../../../../components/SearchBar';
import { addNotification } from '../../../../redux/actions/notificationActions';
import { Authority, emptyAuthority } from '../../../../types/authority.types';
import { debounce } from '../../../../utils/debounce';
import AuthorityCard from '../../../user/authority/AuthorityCard';

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

interface DisplayValue {
  searchTerm: string;
  results: number;
}

interface AddContributorModalContentProps {
  addAuthor: (selectedAuthor: Authority) => void;
}

const AddContributorModalContent: FC<AddContributorModalContentProps> = ({ addAuthor }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation('publication');

  const [matchingAuthorities, setMatchingAuthorities] = useState<Authority[]>();
  const [selectedAuthor, setSelectedAuthor] = useState<Authority>(emptyAuthority);
  const [displayValue, setDisplayValue] = useState<DisplayValue>({
    searchTerm: '',
    results: 0,
  });

  const search = useCallback(
    debounce(async (searchTerm: string) => {
      const response = await getAuthorities(searchTerm, dispatch);
      if (response) {
        setMatchingAuthorities(response);
        setDisplayValue({ searchTerm, results: response.length });
      } else {
        dispatch(addNotification(t('feedback:error.get_authorities'), 'error'));
      }
    }),
    [dispatch, t]
  );

  const handleSearch = async (searchTerm: string) => {
    if (searchTerm.length) {
      await search(searchTerm);
    }
  };

  return (
    <>
      <SearchBar handleSearch={handleSearch} resetSearchInput={false} />
      {matchingAuthorities && matchingAuthorities.length > 0 ? (
        <>
          <Typography variant="h3">
            {t('profile:authority.search_summary', {
              searchTerm: displayValue.searchTerm,
              results: displayValue.results,
            })}
          </Typography>
          {matchingAuthorities.map(authority => (
            <StyledClickableDiv
              data-testid="author-radio-button"
              key={authority.systemControlNumber}
              onClick={() => setSelectedAuthor(authority)}>
              <AuthorityCard
                authority={authority}
                isSelected={selectedAuthor.systemControlNumber === authority.systemControlNumber}
              />
            </StyledClickableDiv>
          ))}
          <StyledButtonContainer>
            <Button
              color="primary"
              data-testid="connect-author-button"
              disabled={!selectedAuthor.systemControlNumber}
              onClick={() => addAuthor(selectedAuthor)}
              size="large"
              variant="contained">
              {t('common:add')}
            </Button>
          </StyledButtonContainer>
        </>
      ) : (
        <Typography variant="body1">{t('common:no_hits')}</Typography>
      )}
    </>
  );
};

export default AddContributorModalContent;
