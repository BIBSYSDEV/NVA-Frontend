import '../../styles/resource.scss';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { Button } from '@material-ui/core';

const ResourceList: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="resource">
      <h1>List of resources</h1>
      <Link to="/resources/new">
        <Button>{t('New registration')}</Button>
      </Link>
    </div>
  );
};

export default ResourceList;
