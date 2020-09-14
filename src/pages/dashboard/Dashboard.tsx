import React, { FC } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Link as MuiLink } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import LatestPublications from './LatestPublications';
import { PageHeader } from '../../components/PageHeader';

const StyledDashboard = styled.div`
  display: grid;
  grid-template-areas: 'search-bar' 'other-content';
  grid-template-rows: auto auto;
  row-gap: 1rem;
  justify-items: center;
`;

const StyledOtherContent = styled.div`
  grid-area: other-content;
  padding-bottom: 1.5rem;
`;

const StyledLinks = styled.div`
  > * {
    margin: 0.5rem;
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
  const { t } = useTranslation();

  return (
    <>
      <PageHeader>{t('publication:publication.newest_publications')}</PageHeader>
      <StyledDashboard>
        <StyledSearchBarContainer>
          <LatestPublications />
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
    </>
  );
};

export default Dashboard;
