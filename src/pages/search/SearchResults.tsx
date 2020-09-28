import React, { FC, Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Link as MuiLink, TablePagination } from '@material-ui/core';
import { List, Typography } from '@material-ui/core';
import PublicationListItemComponent from '../dashboard/PublicationListItemComponent';
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
  publications: SearchResult[];
  searchTerm: string | null;
}

const SearchResults: FC<SearchResultsProps> = ({ publications, searchTerm }) => {
  const { t } = useTranslation();
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[1]);
  const [page, setPage] = useState(0);

  // Ensure selected page is not out of bounds due to manipulated userList
  const validPage = publications.length <= page * rowsPerPage ? 0 : page;

  return (
    <StyledSearchResults data-testid="search-results">
      {searchTerm && t('results', { count: publications.length, term: searchTerm })}
      <List>
        {publications &&
          publications.slice(validPage * rowsPerPage, validPage * rowsPerPage + rowsPerPage).map((publication) => {
            const publicationId = publication.id?.split('/').pop();
            return (
              <PublicationListItemComponent
                data-testid={`search-result-${publicationId}`}
                key={publicationId}
                primaryComponent={
                  <MuiLink component={Link} to={`/publication/${publicationId}/public`}>
                    {publication.title}
                  </MuiLink>
                }
                secondaryComponent={
                  <Typography component="span">
                    {publication.date && <div>{displayDate(publication.date)}</div>}
                    {publication.contributors &&
                      publication.contributors.map((contributor) => (
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
      {publications.length > ROWS_PER_PAGE_OPTIONS[0] && (
        <TablePagination
          data-testid="search-pagination"
          rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
          component="div"
          count={publications.length}
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
