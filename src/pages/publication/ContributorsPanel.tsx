import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { Button, Typography } from '@material-ui/core';

import { getAuthorities } from '../../api/authorityApi';
import Box from '../../components/Box';
import ButtonModal from '../../components/ButtonModal';
import SearchBar from '../../components/SearchBar';
import TabPanel from '../../components/TabPanel/TabPanel';
import { searchFailure } from '../../redux/actions/searchActions';
import { Authority, emptyAuthority } from '../../types/authority.types';
import { debounce } from '../../utils/debounce';
import AuthorityCard from '../user/authority/AuthorityCard';

const StyledClickableDiv = styled.div`
  cursor: pointer;
`;

const StyledSearchBarContainer = styled.div`
  width: 35rem;
`;

interface ContributorsPanelProps {
  goToNextTab: (event: React.MouseEvent<any>) => void;
  savePublication: (event: React.MouseEvent<any>) => void;
}

const ContributorsPanel: React.FC<ContributorsPanelProps> = ({ goToNextTab, savePublication }) => {
  const { t } = useTranslation('profile');
  const dispatch = useDispatch();
  const [selectedAuthor, setSelectedAuthor] = useState<Authority>(emptyAuthority);
  const [matchingAuthorities, setMatchingAuthorities] = useState<Authority[]>();
  const [searchTerm, setSearchTerm] = useState('');

  const search = useCallback(
    debounce(async (searchTerm: string) => {
      const response = await getAuthorities(searchTerm, dispatch);
      if (response) {
        setMatchingAuthorities(response);
      } else {
        dispatch(searchFailure(t('error.search')));
      }
    }),
    [dispatch, t]
  );

  const handleSearch = async () => {
    if (searchTerm.length) {
      await search(searchTerm);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <TabPanel ariaLabel="references" goToNextTab={goToNextTab} onClickSave={savePublication}>
      <Box>
        <ButtonModal buttonText={t('contributors.add_author')} headingText={t('contributors.add_author')}>
          <div>
            <StyledSearchBarContainer>
              <SearchBar
                handleSearch={handleSearch}
                handleChange={handleChange}
                searchTerm={searchTerm}
                resetSearchInput={false}
              />
            </StyledSearchBarContainer>
            {matchingAuthorities && matchingAuthorities.length > 0 ? (
              <>
                <Typography variant="h3">results</Typography>
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
                <Button
                  data-testid="connect-author-button"
                  color="primary"
                  variant="contained"
                  size="large"
                  onClick={() => {
                    console.log('add author', selectedAuthor);
                  }}
                  disabled={!selectedAuthor}>
                  {t('authority.connect_authority')}
                </Button>
              </>
            ) : (
              <div>Ingen treff</div>
            )}
          </div>
        </ButtonModal>
      </Box>
    </TabPanel>
  );
};

export default ContributorsPanel;
