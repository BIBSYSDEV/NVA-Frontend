import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Link as MuiLink } from '@material-ui/core';
import { search } from '../../api/publicationApi';
import SearchBar from '../../components/SearchBar';
import { useTranslation } from 'react-i18next';

const StyledDashboard = styled.div`
  display: grid;
  grid-template-areas: 'search-bar' 'other-content';
  grid-template-rows: 2rem auto;
  row-gap: 1rem;
  justify-items: center;
  padding-top: 4rem;
`;

const StyledOtherContent = styled.div`
  grid-area: other-content;
  padding-top: 2rem;
`;

const StyledLinks = styled.div`
  > * {
    margin: 0 0.5rem;
  }
`;

const StyledSearchBarContainer = styled.div`
  grid-area: search-bar;
  width: 35rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    width: 15rem;
  }
`;

const Dashboard: FC = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handleSearch = async (searchTerm: string) => {
    if (searchTerm.length) {
      await search(searchTerm, dispatch);
      history.push(`/search/${searchTerm}`);
    }
  };

  return (
    <StyledDashboard>
      <StyledSearchBarContainer>
        <SearchBar resetSearchInput handleSearch={handleSearch} />
      </StyledSearchBarContainer>
      <StyledOtherContent>
        <StyledLinks>
          <MuiLink
            aria-label={t('infopages:description.heading')}
            color="primary"
            component={Link}
            to="/description"
            data-testid="description_link">
            {t('infopages:description.heading')}
          </MuiLink>
          <MuiLink
            aria-label={t('infopages:order_information.heading')}
            color="primary"
            component={Link}
            to="/order-information"
            data-testid="order_information_link">
            {t('infopages:order_information.heading')}
          </MuiLink>
        </StyledLinks>
      </StyledOtherContent>
    </StyledDashboard>
  );
};

export default Dashboard;
