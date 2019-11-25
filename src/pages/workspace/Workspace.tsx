import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { Button } from '@material-ui/core';

const Workspace: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <h1>List of resources</h1>
      <Link to="/resources/new">
        <Button>{t('New registration')}</Button>
      </Link>
    </>
  );
};

export default Workspace;
