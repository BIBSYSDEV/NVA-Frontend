import React, { FC, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { Button, Typography } from '@material-ui/core';

import { getAuthorities } from '../../../api/authorityApi';
import Modal from '../../../components/Modal';
import SearchBar from '../../../components/SearchBar';
import { searchFailure } from '../../../redux/actions/searchActions';
import { Authority, emptyAuthority } from '../../../types/authority.types';
import { debounce } from '../../../utils/debounce';
import AuthorityCard from '../../user/authority/AuthorityCard';

const StyledClickableDiv = styled.div`
  cursor: pointer;
  align-items: center;
  background-color: ${({ theme }) => theme.palette.box.main};
  padding-right: 0.5rem;
`;

const StyledSearchBarContainer = styled.div`
  width: 35rem;
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

const AddContributor: FC = () => {
  const { t } = useTranslation('publication');
  const dispatch = useDispatch();
  const [selectedAuthor, setSelectedAuthor] = useState<Authority>(emptyAuthority);
  const [matchingAuthorities, setMatchingAuthorities] = useState<Authority[]>();
  const [searchTerm, setSearchTerm] = useState('');
  const [displayValue, setDisplayValue] = useState<DisplayValue>({
    searchTerm: '',
    results: 0,
  });
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const search = useCallback(
    debounce(async (searchTerm: string) => {
      const response = await getAuthorities(searchTerm, dispatch);
      if (response) {
        setMatchingAuthorities(response);
        setDisplayValue({ searchTerm, results: response.length });
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
    <>
      <Button onClick={handleOpen} variant="contained" color="primary" data-testid="">
        {t('contributors.add_author')}
      </Button>
      {open && (
        <Modal
          ariaDescribedBy=""
          ariaLabelledBy=""
          headingText={t('contributors.add_author')}
          onClose={handleClose}
          openModal={open}>
          <>
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
                    onClick={handleClose}
                    size="large"
                    variant="contained">
                    {t('common:add')}
                  </Button>
                </StyledButtonContainer>
              </>
            ) : (
              <div>Ingen treff</div>
            )}
          </>
        </Modal>
      )}
    </>
  );
};

export default AddContributor;
