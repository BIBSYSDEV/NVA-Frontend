import '../../styles/search.scss';

import React from 'react';
import { useTranslation } from 'react-i18next';

import { List, ListItem, ListItemIcon, ListItemText, Typography } from '@material-ui/core';
import ImageIcon from '@material-ui/icons/Image';

import { Resource } from '../../types/resource.types';

export interface SearchResultsProps {
  resources: Resource[];
  searchTerm: string;
}

const SearchResults: React.FC<SearchResultsProps> = ({ resources, searchTerm }) => {
  const { t } = useTranslation();

  const numberOfResults: number = resources.length;
  return (
    <div className="search-results">
      {t('Results', { count: numberOfResults, term: searchTerm })}
      <List>
        {resources &&
          resources.map(resource => (
            <ListItem key={resource.identifier}>
              <ListItemIcon>
                <ImageIcon />
              </ListItemIcon>
              <ListItemText
                primary={resource.title}
                secondary={
                  <React.Fragment>
                    <Typography component="span">{resource.identifier_handle}</Typography>
                    <br />
                    {resource.description}
                  </React.Fragment>
                }></ListItemText>
            </ListItem>
          ))}
      </List>
    </div>
  );
};

export default SearchResults;
