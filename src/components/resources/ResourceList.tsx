import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText, Typography } from '@material-ui/core';
import ImageIcon from '@material-ui/icons/Image';
import { useTranslation } from 'react-i18next';

import { Resource } from '../../types/resource.types';
import '../../styles/resource.scss';

export interface ResourceListProps {
  resources: Resource[];
}

const ResourceList: React.FC<ResourceListProps> = ({ resources }) => {
  const { t } = useTranslation();
  return (
    <div className="resource-list">
      {t('Results')}
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

export default ResourceList;
