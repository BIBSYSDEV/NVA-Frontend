import React, { FC, Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Link as MuiLink, TablePagination } from '@material-ui/core';
import { List, Typography } from '@material-ui/core';
import RegistrationListItem from '../dashboard/RegistrationListItem';
import { SearchResult } from '../../types/search.types';
import { ROWS_PER_PAGE_OPTIONS } from '../../utils/constants';
import { displayDate } from '../../utils/date-helpers';

const StyledSearchResults = styled.div`
  padding-bottom: 1rem;
`;

const StyledContributor = styled.span`
  padding-right: 1rem;
`;

interface SearchResultsProps {
  registrations: SearchResult[];
  searchTerm: string | null;
}

const SearchResults: FC<SearchResultsProps> = ({ registrations, searchTerm }) => {
  const { t } = useTranslation();
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[1]);
  const [page, setPage] = useState(0);

  // Ensure selected page is not out of bounds due to manipulated userList
  const validPage = registrations.length <= page * rowsPerPage ? 0 : page;

  return (
    <StyledSearchResults data-testid="search-results">
      {searchTerm && t('results', { count: registrations.length, term: searchTerm })}
      <List>
        {registrations &&
          registrations.slice(validPage * rowsPerPage, validPage * rowsPerPage + rowsPerPage).map((registration) => {
            const publicationId = registration.id?.split('/').pop();
            return (
              <RegistrationListItem
                data-testid={`search-result-${publicationId}`}
                key={publicationId}
                primaryComponent={
                  <MuiLink component={Link} to={`/registration/${publicationId}/public`}>
                    {registration.title}
                  </MuiLink>
                }
                secondaryComponent={
                  <Typography component="span">
                    {registration.date && <div>{displayDate(registration.date)}</div>}
                    {registration.contributors &&
                      registration.contributors.map((contributor) => (
                        <Fragment data-testid={`search-result-contributor-${contributor.name}`} key={contributor.name}>
                          {contributor.id ? (
                            <MuiLink component={Link} to={`/user/${contributor.id}`}>
                              <StyledContributor>{contributor.name} </StyledContributor>
                            </MuiLink>
                          ) : (
                            <StyledContributor>{contributor.name} </StyledContributor>
                          )}
                        </Fragment>
                      ))}
                  </Typography>
                }
              />
            );
          })}
      </List>
      {registrations.length > ROWS_PER_PAGE_OPTIONS[0] && (
        <TablePagination
          data-testid="search-pagination"
          rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
          component="div"
          count={registrations.length}
          rowsPerPage={rowsPerPage}
          page={validPage}
          onChangePage={(_, newPage) => setPage(newPage)}
          onChangeRowsPerPage={(event) => {
            setRowsPerPage(parseInt(event.target.value));
            setPage(0);
          }}
        />
      )}
    </StyledSearchResults>
  );
};

export default SearchResults;
